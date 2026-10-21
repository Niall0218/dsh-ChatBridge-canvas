# AFC v3 评审（2026-10-20）

评审对象：`<workspace>\画布插件交付\AFC-算法-v3.js`（876 行，自测通过）。

## 结论

算法修正是对的，但**当前不要直接拿 autoBudget 的结果上线**。6 个真实会话里，auto 预算全部出现未覆盖锚点；S3-B 即使加到 2,000 字符仍有 7 个 tier-A 漏项。主要不是预算不够，而是子句切分后按子句渲染，锚点跨子句时 `survives` 判定失败，同时输出出现断句。

## 实测（autoBudget）

| 会话 | auto 预算 | 输出字符 | missed | 渲染后 lost |
| --- | --- | --- | --- | --- |
| S1-A | 700 | 647 | 6 | 7 |
| S1-B | 1,323 | 1,101 | 2 | 0 |
| S2-A | 1,438 | 1,201 | 5 | 0 |
| S2-B | 1,162 | 1,026 | 6 | 0 |
| S3-A | 414 | 361 | 4 | 1 |
| S3-B | 1,470 | 1,244 | 10 | 1 |

固定预算对照：

- S1-A：700 → missed 6；900 → 4；1,100 → 1；**1,300 → 0**；1,600 → 0（1,294 字符）。
- S3-B：700 → missed 18；1,100 → 14；1,600 → 9；**2,000 → 仍 7**；说明存在结构性漏项，不是单纯预算问题。

## 三个具体 bug

1. **floor 与渲染不一致**：`floorFor` 只按锚点 key 记账，没有用 `survives` 验证渲染文本；S1-A floor 608、S3-B floor 1,278 都报 `uncoveredAtFloor=0`，但实际 digest 仍漏。
2. **子句渲染导致断句**：`collectSentences` 用 `splitWithOffsets(msg.text, clauseMax)` 产出子句，`renderLines` 直接渲染子句。于是出现 `数据目录、；`、`纯 TTL 从 24h 到 10min，。` 这类断句。v3-6 只修了锚点抽取的整句上下文，没有修渲染。
3. **autoBudget 过低且不升档**：S3-A 只给 414 字符（floor 360 × 1.15），不可能覆盖 10 个 tier-A；`extractiveDigest` 发现 missed 后只是追加 `**未覆盖锚点**：transition|...`，没有升档或回退全文。

## 建议的最小修复

1. **子句保留 parentText**：`splitWithOffsets` 给 clause 加 `parentText/parentStart/parentEnd`；`renderLines` 用 parent 渲染，并按 parent 去重。
2. **autoBudget 改成升档**：`max(800, floor+120)` 起步，按 1,300 / 1,600 / 2,000 / 2,400 逐档调用，直到 `missed.length===0`；仍失败则回退全文或显式警告，不要追加机器锚点列表。
3. **floorFor 加 +3 成本并用 `survives` 重算**：或者明确它只是下界，不承诺 `uncovered=0`。
4. **turnFloor 放在覆盖之后且仅在余量充足时启用**，避免挤掉覆盖句。
5. **与画布集成时补头部**（目标/追问/决定）并过滤用户原话重复；否则会退回“片段堆”而不是摘要。

## 值得保留的改进

- `v3-1` transition 切片修复、`v3-2` 无单位约束左边界、`v3-3` 元/后置比较级、`v3-4` 验收/回滚/口径标签，方向都对；
- `v3-7` 修剪后重算 missed 是对的；
- `v3-8` token 估算对齐 prelude，便于预算。

自测 `node AFC-算法-v3.js` 输出 303 字符、0 lost；但自测只有 5 条短消息，覆盖不到长会话的子句/预算问题。
