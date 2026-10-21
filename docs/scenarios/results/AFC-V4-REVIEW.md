# AFC v4 评审（2026-10-20）

对象：`<workspace>\画布插件交付\AFC-算法-v4.js`（49,337 字节）。结论：**原文件现在不能运行**，先修 3 个被注释掉的语句；修完后 autoBudget 在 5/6 会话可用，但 S3-B 会膨胀到 3,288 字符且仍漏 1 项。

## 1. 阻塞性 bug（原文件直接报错）

1. **语法错误**：第 124 行 `sentStart: sent.start, sentEnd: sent.end // });` 把闭合的 `});` 注释掉了。`node AFC-算法-v4.js` 报 `SyntaxError: missing ) after argument list`（指向 125 行）。
2. **`u` 未定义**：第 440 行 `// const u = unitPattern(a.unit);` 被注释，441/444 行仍使用 `u`。加载后第一次 `survives` 就 `ReferenceError: u is not defined`。
3. **`limit` 未定义**：第 616 行 `// const limit = useTokens ? opts.budgetTokens : budget;` 被注释，greedyCover 的预算判断引用 `limit`，报 `ReferenceError: limit is not defined`。

这三处都像批量注释/回滚时误伤；修完先跑 `node --check` 和文件底部自测。

## 2. 修完 3 个 bug 后的实测（temp 副本）

| 会话 | auto 预算 | 升档 | 输出字符 | 行数 | finalMissed | 渲染后 lost |
| --- | --- | --- | --- | --- | --- | --- |
| S1-A | 1,323 | 2 | 1,120 | 9 | 0 | 0 |
| S1-B | 1,922 | 1 | 1,569 | 11 | 0 | 0 |
| S2-A | 2,654 | 2 | 2,114 | 15 | 0 | 0 |
| S2-B | 2,143 | 2 | 1,729 | 13 | 0 | 0 |
| S3-A | 747 | 2 | 540 | 5 | 0 | 0 |
| S3-B | 4,449 | 4 | 3,288 | 21 | **1** | **1** |

v4 确实修掉了 v3 的子句断句：`数据目录、；`、`10min，。` 这类粘连不再出现；`parentText/fullText`、`survKeys`、floor 终验、升档和人类可读 missedDetail 都是对的。

## 3. 仍然要修的问题

1. **问号被改成句号**：`stripTail` 把 `。！？!?` 都剥掉，renderLines 最后统一补 `。`。S1-A 用户问题变成 `……你还会坚持 24 小时吗。`，语义变了。只应剥 `，、：；` 这类悬挂标点，保留 `。！？`。
2. **S3-B 的 auto 会膨胀**：4,449 预算、3,288 字符、2,565 tok，仍然漏 `无法回滚。`。说明存在“没有任何候选句能让该锚点 survives”的死锚点；继续升档只是浪费预算。应在 `survKeys` 无候选时停止升档，明确标记“需人工补录”，并把预算封顶（建议 2,000 字符/800 tok）。
3. **auto 没有用户可见的硬上限**：S2-A 2,114、S3-B 3,288，三个来源会超过 6k，反而比旧预览 5.4k 更大。建议 `maxChars` 默认 1,600–2,000，超出回退到固定预算并告警。
4. **用户原话仍会进正文**：S3-B 首行是 `请只基于下面的上下文回答，不要调用工具；冲突按最新时间戳自动裁决……`，把 prompt 前言和约束混在一起。接画布时要复用 `stripMeta`，并在头部放“目标/追问/决定”。
5. **行数仍偏多**：S3-B 21 行、S2-A 15 行；分组已生效，但“一眼看结论”还不够。可把同轮同角色的连续句合并上限从 180 降到 120，或把 `**未覆盖锚点**` 从正文移到 warnings。
6. **`sectionedDigest` 的 share 仍有小问题**：`Math.max(Math.min(120,budget), ...)` 在 budget<120 时会给 120，超过总预算；当前不是主路径，但建议修正。

## 4. 建议的验证顺序

1. 修 3 个阻塞 bug，跑 `node --check` + 自测；
2. 修 `stripTail`，加回归：输出中 `？` 不得变 `。`；
3. autoBudget 加 `maxChars` 封顶与死锚点停止条件；
4. 用 6 个真实会话跑固定 1,600/2,000 和 auto 三组，记录 chars/tokens/lines/missed；
5. 再接画布，补头部与用户原话去重。
