# DSH Research Core

面向 DeepSeek Harness（DSH）的本地科研基础插件。它提供可审计的项目与 Artifact 存储，并内置六个科研 Skills 与会话内「科研快速开始」入口；插件不会生成或伪造文献、引用和实验结果。

> 当前可用版本是阶段 0–1：只包含本地 Project / Artifact 能力。不包含论文搜索、PDF 解析、引用验证或实验执行。

## 安装

需要 Node.js 22.19+、pnpm，以及已可运行的 DSH。

将本仓库安装到 DSH 的 `web` profile：

```powershell
dsh plugin --profile web add dsh-research-plugins@latest
```

安装后启动或重启 DSH：

```powershell
dsh web
```

从仓库目录本地开发或试装时，使用：

```powershell
git clone https://github.com/luoyan96/dsh-research-plugins.git
cd dsh-research-plugins
dsh plugin --profile web add .
dsh web
```

`dsh plugin` 会读取包内的 `cordis.patch.yml`，自动把 `research-core` 加入该 profile；不需要手工复制配置文件。

尚未发布 npm 版本时，可临时使用 GitHub 安装：

```powershell
dsh plugin --profile web add github:luoyan96/dsh-research-plugins
```

## 验证安装

新对话的输入框正下方会出现「科研插件」入口。点击后会展开六个科研工作流的用途说明；每张卡片的「去使用」只会把可编辑的 Skill 调用模板放入原输入框，例如「论文检索」会填入 `/paper-search-pro …`。补全研究问题后发送即可；按钮不会自动下载、检索或执行实验。

也可以直接在 DSH 对话中输入任意 Skill 调用：

```text
/paper-search-pro：找 2022–2026 年小语言模型校准相关论文，中英文都要。
```

或请求基础工具验证：

```text
调用 research_health，检查科研插件是否可用。
```

成功结果会包含 `plugin_version`、`schema_version`，以及 `projects`、`artifacts` 两项服务。插件还会把下列 Skills 登记进 DSH 的 Skill catalog，模型可以按需加载它们：

| Skill | 用于 |
|---|---|
| `paper-search-pro` | 文献检索与排序简报 |
| `systematic-literature-review` | 系统/范围综述 |
| `academic-paper-review` | 论文精读与审稿 |
| `hypothesis-research-loop` | 假设、最小实验与研究日志 |
| `statistical-result-analysis` | 统计分析与可复现报告 |
| `research-writing-and-rebuttal` | 学术写作、修稿与 rebuttal |

## 当前工具

| 工具 | 用途 |
|---|---|
| `research_health` | 无 I/O 地报告版本与已挂载服务。 |
| `project_create` / `project_get` | 创建或读取本地科研项目。 |
| `artifact_save` | 原子保存带来源、状态、时间戳和 SHA-256 的 Artifact。事实性产物必须提供来源。 |
| `artifact_list` / `artifact_get` | 列出或读取某项目的 Artifact 与正文。 |

默认数据目录是运行 DSH 时的工作区下的 `research-projects/`。可在启动 DSH 前设置 `DSH_RESEARCH_WORKSPACE`，将其改到指定目录：

```powershell
$env:DSH_RESEARCH_WORKSPACE = 'D:\research-workspace'
dsh web
```

## 与科研 Skills 配合

这些内置 Skill 内容来自并持续对应 [dsh-research-skills](https://github.com/luoyan96/dsh-research-skills)。该仓库仍是工作流的完整源代码与治理材料；本包把可执行入口随插件一起交付，避免用户另行复制 Skills 目录。

## 开发与验证

```powershell
pnpm install
pnpm run ci
pnpm pack --dry-run
```

测试覆盖持久化恢复、缺少来源、路径穿越、并发写入、损坏 schema，以及 DSH 工具注册。

## 路线图

后续阶段的边界与验收条件位于 [`docs/phases`](docs/phases)：

1. 论文检索、获取和解析；
2. 引用验证与 Claim → Evidence 溯源；
3. 代码复现和受审批实验；
4. 兼容性、迁移与发布稳定化。

依赖 DSH 的代码必须保留在插件入口与适配边界，禁止修改上游 Harness 源码。

## 发布维护者说明

为发布 `dsh-research-plugins@latest`，推送形如 `v0.2.1` 的版本 tag。GitHub Actions 会校验可发布 tarball，并通过 npm trusted publishing 发布带 provenance 的公开包。构建产物随仓库提交，因此发布工作流不依赖尚未公开发布的 DSH 内部开发包。首次发布前，请在 npm 包设置中将本仓库的 `publish.yml` workflow 配置为 trusted publisher。
