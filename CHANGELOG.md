# Changelog

## 0.2.0 — 2026-10-21

### Added

- **AFC（Anchor-Fidelity Compression）锚点保真压缩**：先锁定约束、区间、冲突、决定、否定、日期和标识锚点，再用整句抽取覆盖；预算按锚点密度自适应，覆盖不足自动升档，不再用省略号截断。
- 导入清洗反馈：重复节点、无效连线、未知类型和异常视口的处理会显示在 Toast 中。
- 预览中的「已禁用来源」统计和「不自动裁决冲突」提示。
- 第 6、7 条工作约定：除非任务要求，否则不写工作区文件；篇幅从紧。
- 操作测试报告、AFC 审计、场景夹具和示例画布。
- tests/ 下的编译器与 AFC 回归测试，以及 GitHub Actions CI。

### Fixed

- 会话列表字段使用 `id/displayTitle`，修复加入对话后 sessionId 为空。
- 文件读取 offset 从 1 开始，修复 `offset must be a safe integer of at least 1`。
- `fitView` 把点击事件当成 minScale，修复缩放变成 NaN。
- 新节点统一堆在视口中心，改为 `findFreeSpot` 避让。
- 导入异常 viewport 导致 250% 缩放，改为严格类型判断、重置并自动 fit。
- AFC 全文回退误触发、`strict:true` 污染正文、头部与正文重复。
- 摘要混入 runtime-context 注入消息，增加噪音过滤。
- 窄窗口 Tab 换行。

### Known limitations

- 「创建并发送」依赖当前 profile 的模型配置；推荐使用「创建并预填」。
- 文件默认路径引用；路径引用可能触发新对话读取文件并消耗 token。
- 没有结构化记忆、自动冲突裁决、来源哈希、多画布和协作。
- 主要验证环境为 DSH 0.2.1-rc.2；插件 API 仍可能变化。

## 0.1.0 — 2026-10-20

- 初始版本：无限画布、历史对话/文件/提示词/新对话节点、连线、摘要、上下文预览、创建并预填、localStorage 持久化、导入导出。
