# 架构边界与工程护栏

## 1. 目录与数据边界

- 本仓库是唯一允许写入的科研平台实现目录。
- `E:\acceptcat`、`D:\deepseek-agent\dsh-catnap-desktop`、`D:\deepseek-agent\local-plugins\dsh-client-ui-skin-catnap` 只读。
- 禁止读取、输出、复制或提交 `.env`、访问令牌、数据库、备份、上传内容和真实用户数据。
- 选择性迁移代码或素材时，记录源路径、许可证、修改内容和迁移理由。

## 2. DSH 插件边界

- 使用标准 host/browser 两半插件结构。
- browser half 使用 `@deepseek-ai/dsh-client-runtime`、官方 UI primitives 和 slots。
- 优先使用列表型或明确可扩展的内部插槽，例如侧栏动作和 shell overlay。
- `sidebar`、`conversation`、`details` 等 single slot 已有核心占用者；覆盖它们等于替换整块原生 UI，默认禁止。
- 不依赖随机 class 名、文本选择器、定时轮询 DOM 或 MutationObserver 猴子补丁完成核心功能。
- 插件 `apply` 必须小而同步，异步初始化要有超时、错误边界和卸载清理。

## 3. 桌面壳边界

- Electron 主进程只负责生命周期、单实例、端口、日志、窗口、更新与受控 IPC。
- 页面业务状态属于 Web/插件层，不能依赖主进程内存维持。
- 启动前检查端口占用；已有合法实例时聚焦窗口，异常占用时给出可操作提示。
- 所有子进程必须有明确所有权、退出清理和日志位置。
- 自动更新必须验证签名/校验和，失败后保留当前可运行版本。

## 4. UI 与猫咪边界

- 猫咪装饰层默认 `pointer-events: none`；只有明确的交互热区恢复指针事件。
- 菜单、弹窗、输入、画布和确认操作拥有更高交互优先级。
- 设置、下拉菜单或窄窗口打开时，猫咪避让、缩小或隐藏。
- 不用 emoji、CSS 绘画或占位框冒充最终猫咪资产。
- 所有动画支持减少动态效果，所有音效可关闭。

## 5. 状态与错误

- FigureProject、FigureBrief、GenerationJob、FigureVersion 使用明确标识和可恢复状态。
- 幂等操作带 idempotency key；刷新或重试不得重复扣费、重复生成或覆盖旧版本。
- 网络、模型、插件和文件错误必须映射为稳定错误码与用户可理解文案。
- UI 不允许无限 Loading；超时后提供重试、诊断信息和安全返回路径。

## 6. 变更门禁

- 修复只处理已确认根因，不顺手重构无关模块。
- 禁止 `git reset --hard`、覆盖用户改动或大范围机械改写。
- 变更前记录基线 commit 和工作区状态。
- 合并前至少完成受影响包的类型检查、测试、构建与关键路径手工验证。
- 影响启动、插件加载、计费、文件写入或自动更新的变更属于高风险，必须增加失败路径验证。

