# DSH ChatBridge Canvas

无限画布式 DSH 上下文编排插件：把历史对话、文件和提示词拖到一张画布上，用连线接到新的「新对话」，再编译成一份带来源、可预览、可编辑的上下文。

[![CI](https://github.com/Niall0218/dsh-ChatBridge-canvas/actions/workflows/ci.yml/badge.svg)](https://github.com/Niall0218/dsh-ChatBridge-canvas/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](CHANGELOG.md)

> 仓库名：**dsh-ChatBridge-canvas**  
> DSH 包名：**dsh-context-canvas**（保持已安装实例的兼容 id）

![画布总览](docs/screenshots/canvas.png)

## 这是什么

DSH 里的历史对话通常只能一条一条打开。这个插件把「选择哪些对话、哪些文件、按什么顺序、以什么方式进入新对话」变成一张可视化的图：

- **对话节点**：从素材库拖入历史对话；
- **文件节点**：拖入/选择文件，或粘贴路径；文本可内联，也可以只保留引用；
- **提示词节点**：把本次任务要求单独放在画布上；
- **新对话节点**：把来源连到它上面，预览、编辑，然后创建新会话。

它不是白板，而是一个**可审阅的上下文编排器**：发送前能看到最终内容、来源和 token 估算。

## 特性

- 无限画布：平移、缩放、适应视图、拖动节点、Delete 删除；
- 历史对话自动摘要：AFC 锚点保真压缩，优先保留约束、区间、冲突、决定、否定、日期和标识；
- 文件路径引用 / 文本内联；
- 来源顺序、启用/禁用、已禁用统计；
- 上下文预览：来源统计、字符数、估算 tokens、可编辑；
- 创建并预填（推荐）或创建并发送；
- 画布自动保存，支持导出 / 导入 JSON；
- 导入清洗：重复节点、无效连线、未知类型、异常视口会给出反馈；
- 侧边栏入口在「自动化任务」下面，名称「画布」；
- 原生主题 token，跟随明暗主题。

![上下文预览](docs/screenshots/preview.png)

## 安装

### 方式一：Release 包（推荐）

1. 从 [Releases](https://github.com/Niall0218/dsh-ChatBridge-canvas/releases) 下载 `dsh-context-canvas-0.2.0.zip` 并解压到一个目录；
2. 打开 DSH → **插件** → 安装本地 bundle；
3. 选择解压后的目录（根目录里应有 `package.json` 和 `cordis.patch.yml`）；
4. 启用后刷新页面，侧边栏会出现「画布」。

### 方式二：从源码

```bash
git clone https://github.com/Niall0218/dsh-ChatBridge-canvas.git
cd dsh-ChatBridge-canvas
# client.js 已提交；只有修改 src/ 后才需要重新构建
node build.mjs
```

然后把整个目录作为本地 bundle 安装。

### 命令行 profile

非桌面端 profile 可以用：

```bash
dsh plugin --profile <profile> add link:<path-to-dsh-ChatBridge-canvas>
```

桌面端 profile 由 Electron 独占管理，`dsh plugin` 会拒绝操作；请使用「插件 → 安装本地 bundle」。

## 快速使用

1. 侧边栏点击 **画布**；
2. 在素材库「对话」里搜索并拖入一个历史对话；第一次加入素材会自动生成一个「新对话」节点；
3. 从来源节点右侧圆点拖线到「新对话」节点；
4. 加入文件、提示词，继续连线；
5. 点选「新对话」节点，在右侧选择目标工作区、写任务指令、调整来源顺序；
6. 点击 **预览上下文**，检查来源、字符数和 token；
7. 点击 **创建并预填**，在新会话输入框里检查后发送。

> 文件默认以路径引用进入上下文，由新对话里的智能体按需读取；文本文件可以点「读取」内联。路径引用可能触发智能体读取文件并消耗 token，小文件建议内联。

## 上下文如何编译

| 来源 | 默认方式 | 说明 |
| --- | --- | --- |
| 历史对话 | AFC 摘要 | 目标 + 追问 + 决定 + 整句锚点；每个来源约 1,300–1,600 字符 |
| 历史对话（可选） | 摘要 + 片段 / 完整文本 | 完整文本单会话上限约 26k 字符 |
| 文件 | 路径引用 | 读取后可内联，单文件上限 16k 字符 |
| 提示词 | 任务要求 | 按顺序进入「任务要求」区 |

编译结果包含：画布名称、生成时间、来源统计、本次任务指令、每个来源的编号和出处，以及「给新对话的工作约定」：先复述理解、冲突并列呈现、引用来源、未内联文件按需读取、资料不足要提问、除非任务要求否则不写工作区文件、篇幅从紧。

### AFC 摘要

AFC 先抽取 tier-A 锚点（约束、区间、冲突、决定、否定、日期、标识等），再用整句覆盖它们；预算按锚点密度自适应，覆盖不足会升档，不用省略号截断。详见 [docs/APC.md](docs/APC.md) 和 [docs/scenarios/results/AFC-V43-INTEGRATION.md](docs/scenarios/results/AFC-V43-INTEGRATION.md)。

## 隐私

- 插件只通过 DSH 本地 Client 服务读取你选择的会话；
- 插件本身不访问网络、不上报、不写额外 session 事件；
- 画布保存在 DSH Web 存储的 localStorage，键为 `dsh-context-canvas:v1`；
- 导出 JSON 需要你手动触发；
- 历史对话本身不会被修改。

## 兼容性

- 主要验证版本：DSH **0.2.1-rc.2**（desktop / web）；
- 构建与测试需要 Node **>=22**，运行时不需要额外 npm 依赖（React 由 DSH 提供）；
- DSH 插件 API 仍在演进，升级后如有 slot/服务变化请提 issue。

## 开发与测试

```bash
npm run build   # 生成 client.js
npm test        # 编译器 + AFC 回归
npm run check   # build + node --check + tests
```

CI 在 Ubuntu + Node 22 上运行，并检查 `client.js` 是否与 `src/` 的构建一致。

## 已知限制

- 「创建并发送」依赖当前 profile 已配置模型；推荐「创建并预填」；
- 文件读取使用 DSH 预览接口首屏；超长文件建议路径引用；
- 没有结构化记忆、自动冲突裁决、来源哈希、多画布、协作；
- 暗色主题和桌面端原生文件拖拽尚未逐项回归；
- 主要验证环境是 DSH 0.2.1-rc.2，其他版本请先看 [docs/VERIFICATION.md](docs/VERIFICATION.md)。

## 目录

```text
dsh-ChatBridge-canvas/
├── client.js            # 构建产物（已提交）
├── index.js             # Host 半：无副作用
├── cordis.patch.yml     # bundle patch
├── src/
│   ├── prelude.js
│   ├── afc.js           # 锚点保真压缩
│   ├── model.js         # 图模型、摘要、上下文编译、DSH 适配
│   ├── ui-*.js          # 画布、节点、检查器、预览
│   ├── apply.js
│   └── styles.css
├── tests/               # 编译器 + AFC 回归
├── docs/                # 设计、操作测试、示例、场景
└── .github/workflows/   # CI
```

## 文档

- [设计说明](docs/DESIGN.md)
- [AFC 算法](docs/APC.md)
- [验证记录](docs/VERIFICATION.md)
- [操作测试](docs/OPERATION-RESULTS.md)
- [示例画布](docs/examples/)
- [场景夹具](docs/scenarios/)

## License

[MIT](LICENSE) © 2026 Niall0218
