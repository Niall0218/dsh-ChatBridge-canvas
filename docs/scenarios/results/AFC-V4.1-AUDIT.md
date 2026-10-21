# AFC v4.1 独立审计报告

审计对象：`<workspace>\画布插件交付\AFC-算法-v4.1.js`（50,569 B，SHA-256 `05defeea288396036cc59cf8b23eb587376f642d83097d6da2d28d7b32287e47`，只读）
审计日期：2026-10-20
审计目录：`<workspace>\dsh-context-canvas\.v41-audit\`（本目录外的文件均未修改）
方法：Node `new Function(src + "\nreturn AFC;")` 加载；6 份 raw 会话按 `.test-audit/independent.cjs` 的 parse 风格解析（该文件未修改）；每个会话调用 `AFC.autoBudget(messages, anchors, "src")`，再以 `{budget: auto.budgetChars, strict: true}` 调用 `AFC.extractiveDigest`；42 条 INDEP 业务锚点按原正则回归；另用内存补丁版 v4（只修 3 个 blocker，不落盘）做基线对比。

## 1. 加载与自测

| 检查 | 结果 |
| --- | --- |
| `node --check` | 通过（exit 0） |
| `new Function` 加载 | 通过，无 SyntaxError/ReferenceError |
| `node AFC-算法-v4.1.js` 自测 | 通过，exit 0（日志见 `selftest.log`，27 行） |
| 6 会话实际调用 | 无异常；autoBudget/extractiveDigest/sectionedDigest 均可运行 |
| v4 原文件对照 | 未补丁版仍报 `SyntaxError: missing ) after argument list`，说明 line 124 修复是真实差异 |

自测关键输出：锚点 318 字符/201 tok、floor 未覆盖 0、建议预算 366、升档 0、终验 missed 0、tier-A 存活丢失 0、无单位约束「500」对「1500」判定 false、长句粘连标点检查“通过”、floor 一致性 0/12。
注意：自测只 `console.log`，没有 assert，也没有非零退出码；即使回归也仍 exit 0，不能当 CI 门禁。

## 2. 六会话结果（v4.1，默认字符预算）

| 会话 | auto 预算 | 输出字符 | token | 行数 | 用户行 | 精确重复 | missed | 问号→句号 | 标点/碎片 | capped/stalled | INDEP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | ---: |
| S1-A | 1,323 | 1,120 | 832 | 9 | 1 | 0 | 0 | 0 | 干净 | false/false | 8/9 |
| S1-B | 1,922 | 1,569 | 1,099 | 11 | 2 | 0 | 0 | 0 | 干净 | false/false | 7/7 |
| S2-A | 2,400 | 1,916 | 1,479 | 14 | 2 | 0 | 0 | 0 | 干净 | true/false | 7/7 |
| S2-B | 2,143 | 1,729 | 1,280 | 13 | 2 | 0 | 0 | 0 | 干净 | false/false | 6/6 |
| S3-A | 747 | 540 | 447 | 5 | 2 | 0 | 0 | 0 | 干净 | false/false | 6/6 |
| S3-B | 2,400 | 1,905 | 1,466 | 13 | 2 | 0 | **5** | 0 | 正文干净；附录 6/7 引号、5 条碎片 | true/true | 7/7 |
| 合计/均值 | — | 8,779（1,463） | 6,603 | 65 | 11 | 0 | 5 | 0 | — | — | **41/42** |

“问号→句号”指输出片段以「。」结尾、但其同文在原文中紧跟「？」的转换；v4 基线在 S1-A/S1-B 各命中 1 次，v4.1 为 0。S1-A 的 `如果需求要求价格 P95 新鲜度 ≤ 10 分钟，你还会坚持 24 小时吗？` 保留问号（v4 为“吗。”），修复属实。
“标点/碎片”按用户指定的 `、；`、`，。`、`。；`，以及 `、。`、`；。`、`，；`、`；、`、`：。`、`，，`、`。。`、行首/行尾标点扫描：6 份正文全部 0 命中，括号成对；唯一异常在 S3-B 的“未覆盖锚点”附录（见 §5）。S3-B 正文中的 `」；` 来自原文 `「结果确定」与「可恢复」；A.`，不是 joinParts 伪造。
“精确重复”按去掉 `[src·轮N·角色]` 前缀后的整行比较，6 份均为 0。

### v4 基线（内存补丁版，仅修 3 个 blocker）对比

| 会话 | v4 字符 | v4 token | v4 missed | v4.1 字符 | v4.1 missed |
| --- | ---: | ---: | ---: | ---: | ---: |
| S1-A | 1,120 | 832 | 0 | 1,120 | 0 |
| S1-B | 1,569 | 1,099 | 0 | 1,569 | 0 |
| S2-A | 2,114 | 1,653 | 0 | 1,916 | 0 |
| S2-B | 1,729 | 1,280 | 0 | 1,729 | 0 |
| S3-A | 540 | 447 | 0 | 540 | 0 |
| S3-B | **3,288** | **2,565** | **1** | **1,905** | **5** |

v4.1 总量少 1,581 字符 / 1,273 token，但 S3-B 多丢 4 个锚点，是本次唯一覆盖回退。

## 3. 42 条独立业务锚点

- 逐条正则、按输出正文（去掉 `**未覆盖锚点**` 附录）统计：**41/42 = 97.6%**。
- 按含附录的完整输出统计同为 **41/42**，附录没有制造假命中。
- 唯一未命中：`S1-chatA-history.txt` 的 **「不能保留」**。原文在轮 2 助手的长表格句末：“一句话：24h 不能保留，但‘10min TTL’也不是答案……”。该句未被选入摘要；AFC 自己的 tier-A 锚点在 S1-A 渲染后丢失为 0，所以这是独立锚点/抽取覆盖问题，不是 tier-A 存活回归。
- 其余 41 条全部命中；S2-A/S2-B/S3-A/S3-B 均全中。

## 4. 预期修复逐项核对

| 声明 | 结论 | 证据 |
| --- | --- | --- |
| line 124 闭合 `});` | 通过 | `node --check` 0；v4 原文件仍 SyntaxError |
| 缺失 `u` | 通过 | survives 全量调用无 ReferenceError；自测无单位约束判定 false |
| 缺失 `limit` | 通过 | greedyCover 在 6 会话均正常收敛，输出均 ≤ 预算 |
| stripTail 保留 `?!.` | 通过 | v4 的“吗。”在 v4.1 变“吗？”；6 会话问号转换 0 |
| joinParts | 通过 | 无 `、；`/`，。`/`。；`；无 `…；`、`」；` 伪连接（S3-B 的 `」；` 为原文） |
| prompt-meta 剥离 | 通过 | S3-B 首行直接以“冲突按最新时间戳……”开头；6 份输出均无“请只基于/不要调用工具” |
| parent/fullText 渲染 | 通过 | 正文均为完整句，无子句断句；S3-B 13 行（v4 21 行） |
| autoBudget 2400 字符上限 | 通过 | 6 份预算最大 2,400；输出最大 1,916（S3-B 1,905），无 3k+ |
| autoBudget 1400 token 上限 | **仅 token 模式生效** | 默认字符模式下 S2-A 实际 1,479 tok、auto.budgetTokens 1,535；S3-B 1,466 tok。只有 `{budgetTokens:true}` 时才是 1,400 |
| stalled escalation | 机制通过，语义偏粗 | S3-B capped/stalled=true；但 stalled 同时表示“已封顶”和“无收益”，见 §5 |
| finalMissed 行为 | 默认通过，关闭升档时失真 | 默认 6 份 auto.finalMissed 与 digest.missed 集合完全一致；`autoEscalate:false` 时 S3-B 报 0，实际 digest 漏 10 |
| S1-A 标点干净 | 通过 | 0 个目标标点序列；括号 6/6；无重复行 |
| S3-B 标点干净 | **正文通过，附录不通过** | 正文括号 8/8、引号 13/13；附录引号 6/7，5 条锚点显示为截断/半引号碎片 |

## 5. 仍存问题（按严重度）

### P1：1400 token 上限在默认字符模式下不成立（虚假承诺风险）

- S2-A：`autoBudget` 返回 `budgetChars=2400`、`budgetTokens=1535`；实际输出 **1,479 tok**，超过 1,400。
- S3-B：实际 **1,466 tok**，也超过 1,400。
- 若调用方按 token 模式取预算（`{budgetTokens:true}`），上限确实 1,400，但覆盖代价大：S2-A 1,184 tok / **5 missed**（upstream_connect_error、upstream_ssl_error、no live upstreams、没有一起回滚；、no healthy upstream）；S3-B 1,257 tok / **9 missed**。
- 结论：2400 字符与 1400 token 是互斥的两个分支，不是同时生效的双上限。CONFIG 注释“token 预算硬上限”只在 token 分支为真；默认路径可超 5.6%。

### P2：S3-B 的 2400 字符硬上限造成覆盖回退（1→5 missed）

- v4 在 4,449 预算下输出 3,288 字符、漏 1；v4.1 封顶 2,400 后输出 1,905、漏 5。
- 上限是“预算”而不是“输出”：把 `maxChars` 提到 3,422 时输出仅 **2,579 字符（仍 <3k）**、**0 missed**、1,972 tok；即全量覆盖只需 2,579 字符输出，但 greedy 选句需要 3,422 预算。
- 因此 2,400 的预算硬顶把 4 个可恢复锚点（`不做迁移」会永久堵住这条路。`、`没有开关、旧客户端兼容或回退方案。`、`没有规定数据目录、单写者或锁、崩溃后`、`「不做迁移」改写为「不迁移历史格式,但`）连同 1 个日期锚点 `D6–7` 一起截掉；`stalled=true` 只是把“封顶”误标成“无收益”。
- 副作用：为这 5 项追加的 `**未覆盖锚点**` 附录（145 字符）本身是坏碎片：`「不做迁移」会永久堵住这条路。」`（多一个 `」`）、`没有规定数据目录、单写者或锁、崩溃后`（截断）、`不迁移历史格式,但`（半角逗号 + 截断），导致 S3-B 全输出引号 6/7 不平衡。missedDetail 声称“人类可读”，实际不可直接补录。
- 建议：把 2,400 的“预算帽”改为“输出帽”（例如 2,600），或在封顶前允许一次按 missed 句数精确补预算；同时修 display 截断与 `「」` 包裹逻辑。

### P3：`autoEscalate:false` 时 finalMissed 谎报 0

- `autoBudget(..., {autoEscalate:false})` 不进入 probe 循环，`check` 保持 null，返回 `finalMissed = floor.uncovered`。
- S3-B：返回 `finalMissed=0`，但用同一预算 1,544 调 `extractiveDigest` 实际 **10 missed**。
- S2-A：返回 0，实际 **6 missed**。
- 这与字段名“final”矛盾；调用方若为省 CPU 关闭升档，会把“漏 10 项”当成“全覆盖”。默认路径不受影响（6 份 finalMissed 与 digest.missed 完全一致）。

### 其他发现

1. S1-A 的独立锚点「不能保留」未命中（41/42）；同句语义在输出中有近似表述，但字面缺失。v4 基线同样 8/9，不是 v4.1 新增回退。
2. 自测没有 assert，永远 exit 0；本次所有“通过”依赖人工读日志。
3. S3-B 正文有 13 行、2 条用户行，未出现 `、；` 等粘连；唯一 `」；` 是原文标点。
4. `sectionedDigest` 可运行（S1-A 1,186 字符/3 missed；S3-B 1,250/13），非主路径，未做进一步评分。
5. 字符模式附录可能把总字符推过预算（本次未发生：S3-B 正文 1,760 + 附录 145 = 1,905 < 2,400）。

## 6. 复现与证据文件

- `audit.cjs`：6 会话 + 42 锚点 + v4 内存基线，输出 `audit-results.json`
- `inspect.cjs`：S1-A/S2-A/S3-B 全文与 missedDetail
- `check2.cjs`：标点/引号/附录、S3-B 高预算恢复、升档轨迹
- `check3.cjs`：maxChars 扫描（S2-A 2000→4 missed、2400→0；S3-B 2400→5、3422→0）、autoEscalate:false、token 模式
- `check4.cjs`：v4/v4.1 问号对比、异常连接扫描、sectionedDigest
- `check5.cjs`：S3-B `」；` 来源确认
- `selftest.log` / `selftest.exit` / `sha256.txt`

结论：v4.1 的 3 个 blocker、问号、joinParts、prompt-meta、整句渲染均真实修复；字符上限与 S2-A 覆盖达标。但“1400 token 硬上限”在默认路径不成立，S3-B 为封顶多丢 4 个锚点且附录碎片化，`autoEscalate:false` 时 finalMissed 失真。建议修复这 3 项后再宣称 v4.1 可交付。
