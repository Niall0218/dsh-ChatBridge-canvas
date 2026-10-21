# 设计说明 · DSH Context Canvas V1

## 1. 为什么先做这个版本

原始方案（`DSH画布_V1_执行方案.md`）描述了一个完整系统：结构化记忆提取、冲突模型、快照版本、上下文编译器、运行记录。方向是对的，但如果第一版先把这些全部做完，会面临三个问题：

1. 记忆提取需要额外模型调用，延迟和 token 成本不可控；
2. 结构化记忆的质量很难在早期稳定，用户会先被错误摘要困扰；
3. 最关键的交互——把多个对话、文件连起来并开始新对话——反而被推迟验证。

因此 V1 的取舍是：**先验证「画布式上下文编排」这个交互闭环**，把记忆提取做成可替换的后续层，而不是一开始就绑死在核心链路里。

## 2. V1 的闭环

```text
历史对话 / 文件 / 提示词
        ↓ 拖入画布
      节点 + 连线
        ↓ 编译
  预览（来源、统计、token）
        ↓ 创建
新对话（预填或直接发送）
```

用户不需要先配置记忆库，也不需要理解「ContextBundle」内部结构；看到的就是节点、线和一份可读的上下文。

## 3. 架构

### 3.1 为什么是纯 Client 插件

- 画布本身就是浏览器 UI，放在 Client 侧没有跨进程往返；
- 历史对话读取复用 `ctx.sessions`（Session Controller），会话创建复用 `ctx.sessions.create`，输入框预填复用 `ctx.conversation.input`；
- 不新增 Host 权限，不写新的 session event 类型，历史会话保持只读；
- Host 半只保留一个空的 `apply()`，让 bundle 的 Loader 行和 Client 模块图能发现本包。

### 3.2 用到的 DSH 能力

| 能力 | 接口 | 用途 |
| --- | --- | --- |
| 面板与侧边栏 | `ctx.slots.inject("main"/"sidebar.panellist")` | 注册「画布」面板和入口 |
| 主题 | `--dsw-alias-*` CSS token | 跟随明暗主题和宿主控件风格 |
| 会话列表 | `ctx.sessions.list` | 素材库、标题、工作区、更新时间 |
| 会话读取 | `ctx.sessions.using(id, {source}) + ref.binding.session.eventSource` | 读取尾部消息生成摘要 |
| 新建会话 | `ctx.sessions.create({ workspaceId })` | 创建目标对话 |
| 打开会话 | `ctx.uiWorkspace.openSession(id)` | 创建后进入会话 |
| 预填输入框 | `ctx.conversation.input.requestDraftInitialization(binding, {prompt})` | 把上下文放进 composer |
| 直接发送 | `ref.binding.ctx.get("conversation").send(prompt)` | 「创建并发送」路径 |
| 文件读取 | `ctx.remote.workspaceFiles.read(sessionId, path, {offset:1})` | 内联文本文件 |
| 工作区 | `ctx.workspaces.list` | 目标工作区选择 |

### 3.3 数据模型

画布状态是一个纯 JSON 图，存在 localStorage：

```json
{
  "version": 1,
  "id": "canvas-...",
  "name": "未命名画布",
  "viewport": { "x": 48, "y": 48, "scale": 1 },
  "nodes": [
    {
      "id": "conversation-...",
      "type": "conversation",
      "x": 120, "y": 200,
      "data": {
        "sessionId": "session-...",
        "title": "产品需求讨论",
        "cwd": "<workspace>",
        "includeMode": "digest",
        "digest": "...",
        "digestAt": 1790000000000,
        "messageCount": 12
      }
    },
    {
      "id": "file-...",
      "type": "file",
      "x": 120, "y": 420,
      "data": {
        "path": "<workspace>\\spec.md",
        "name": "spec.md",
        "includeMode": "auto",
        "content": "...",
        "contentAt": 1790000000000
      }
    },
    { "id": "prompt-...", "type": "prompt", "data": { "text": "..." } },
    {
      "id": "chat-...",
      "type": "chat",
      "data": {
        "title": "新对话",
        "instruction": "",
        "workspaceId": "",
        "status": "idle",
        "resultSessionId": ""
      }
    }
  ],
  "edges": [
    {
      "id": "edge-...",
      "from": "conversation-...",
      "to": "chat-...",
      "kind": "context",
      "enabled": true,
      "order": 1
    }
  ]
}
```

节点位置是画布世界坐标；视口是屏幕变换（平移 + 缩放）。摘要、文件内容和运行结果都是**派生缓存**，可以刷新，原始对话和文件不被修改。

### 3.4 摘要策略：锚点保真压缩（APC）

V1 的早期实现是「首条用户消息 + 最近 10 条消息」，实测 tier-A 锚点召回只有 41%。现已替换为 AFC：

1. 清洗 DSH 注入的 runtime-context、工具流水和过程叙述；
2. 用 11 类锚点抽取器标记约束、区间、迁移、冲突、决定、否定、日期、标识和中文数字；
3. 只选含锚点的**完整句**，贪心覆盖 tier-A 锚点（目标 100%，实测 98.2%）；
4. 计算覆盖所需的 floor，预算取 min(1600, max(800, floor + 120))；
5. 覆盖不足时升档到 1600/2000/2400；仍不足则回退全文并标注；
6. 头部补目标、追问、决定；每条抽取句带 `[轮K·角色]` 出处；
7. 「完整文本」仍保留单会话约 26k 字符上限。

AFC 是确定性的、可复现的，不额外调用模型。六个真实会话实测 270/275 个 tier-A 锚点（98.2%）、独立业务锚点 41/42（98%），平均 1,293 字符/来源；完全重复 0。完整定义、保证、实测和失效模式见 [APC.md](APC.md)。

### 3.5 上下文编译器

输入：画布图、目标 chat 节点、当前会话/工作区快照。

1. 取所有指向 chat 节点的边，按 `order` 排序；
2. 跳过 `enabled: false` 的来源；
3. 按类型生成来源块：
   - 对话：标题、session ID、cwd、最近活动、提取方式、摘要；
   - 文件：路径、使用方式，内联时附文本；
   - 提示词：作为任务要求；
4. 顶部放任务指令，底部放「工作约定」；
5. 统计来源数、字符数、估算 token。

优先级与原始方案一致：任务指令 > 已连接来源摘要 > 文件/片段 > 完整文本。超出预算时先截断片段，不先删任务指令。

### 3.6 冲突处理

V1 不做自动冲突检测，但显式要求新对话：

> 如果不同来源相互冲突，请并列列出冲突双方及其来源，不要静默选择其中一个。

这比「假装检测了冲突」更诚实。V1.1 可以在编译前对「决定类」摘要做一次小模型比对，把冲突作为预览里的待确认项。

## 4. 与原始方案的对应关系

| 原始方案 | V1 状态 | 说明 |
| --- | --- | --- |
| 无限画布、节点、连线 | 已实现 | 对话/文件/提示词/新对话四类节点 |
| 历史对话、文件、提示词 | 已实现 | 素材库 + 拖拽/点击/路径 |
| 新对话节点与创建 | 已实现 | 预填优先，直接发送可选 |
| 上下文预览、token 估算 | 已实现 | 可编辑后创建 |
| 对话摘要 | 已实现（原文截取） | 无 LLM 提取 |
| 结构化记忆、去重、冲突识别 | 未实现 | V1.1 |
| 来源版本/快照哈希 | 部分 | 摘要时间 + 会话最近活动提示 |
| 画布保存/恢复 | 已实现 | localStorage + JSON 导出导入 |
| 运行记录/来源复现 | 部分 | 节点保存 resultSessionId 和上下文统计 |
| 多画布/协作 | 未实现 | 后续 |

## 5. 后续路线

### V1.1：可审阅的记忆

- 单对话结构化提取：goal / fact / decision / constraint / task / open_question；
- 每条记忆带 provenance（sessionId、message seq、提取时间、提取器版本）；
- 冲突候选在预览里并列展示，用户选择或保留冲突；
- 摘要缓存带来源 revision，来源更新时提示。

### V1.2：更可靠的文件与快照

- 文件哈希与版本；
- 大文件分页/摘要；
- 已删除文件的提示；
- 画布 JSON schema 版本迁移。

### V1.3：多画布与模板

- 画布列表、复制画布、模板；
- 常用连线组合（例如「三对话 + 一个规范文件 → 设计评审」）；
- 结果回填到画布。

## 6. 风险

| 风险 | 处理 |
| --- | --- |
| DSH 客户端 API 变化 | 只依赖 `sessions`/`uiWorkspace`/`conversation` 这几个稳定服务；UI 不碰宿主 DOM |
| 会话读取失败/被删 | 摘要失败只警告，不阻塞其他来源；节点保留原 sessionId |
| 上下文过长 | 分层截断 + token 估算 + 预览；优先保留指令和摘要 |
| 用户误以为自动解决了冲突 | 文案明确「不自动裁决」，并写进上下文工作约定 |
| 本地存储丢失 | 导出/导入 JSON；后续可接 Host 存储 |

## 7. 一句话总结

V1 不是「白板 + 自动记忆」，而是**一个可审阅、可回退的上下文编排器**：用户负责选择来源和连线，画布负责把它们变成一份有出处、有预算、可以检查后再发送的上下文。
