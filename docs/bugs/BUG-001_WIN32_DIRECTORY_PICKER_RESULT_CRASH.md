# BUG-001：Windows 选择工作区后目录选择 worker 崩溃

状态：**已定位，未修复，等待产品实现基线**

严重级别：P1（应用可启动，但选择工作区主流程被阻断）

风险归类：DSH/桌面基础设施风险；不依赖已废弃的科研绘图产品逻辑。

记录日期：2026-08-15

## 现象

在 Catnap Desktop 中打开系统文件夹选择窗口，选择一个文件夹并点击“选择文件夹”确认后，应用显示“无法打开文件夹”：

```text
directory picker failed: directory picker failed: win32 folder dialog worker exited before reporting a result
```

系统文件夹选择窗口本身可以正常打开。失败发生在用户确认选择之后。

## 已确认基线

- 当前唯一可写仓库 `D:\deepseek-agent\dsh-research-cat-platform` 的产品执行基线为 `9a5edf5`，仓库内尚无实现代码。
- 发生问题的只读参考实现为 `D:\deepseek-agent\dsh-catnap-desktop`，检查时 commit 为 `862bf62`。
- 参考实现内置 `@deepseek-ai/dsh` 与 `@deepseek-ai/dsh-host-directory-picker-native` `0.1.0-rc.6`。

## 复现证据

1. 用户截图记录了完整错误文本。
2. 用户确认系统文件夹选择窗口正常出现，点击确认选择后才报错。
3. 使用打包后的 `Catnap Desktop.exe` 单独启动同一个 worker，成功收到：

```text
message: {"kind":"showing","threadId":11836}
```

这排除了 worker 无法启动、IPC 无法建立和对话框无法显示；故障位于对话框返回后的结果处理路径。

## 根因

`dsh-host-directory-picker-native` 的 Win32 worker 在取得 `IShellItem::GetDisplayName` 返回的 UTF-16 路径指针后，通过 `koffi.view(address, 32768)` 固定映射 32 KiB，再扫描 NUL 结束符。COM 只保证返回一块足够容纳实际字符串的内存，并不保证该地址之后存在 32 KiB 可安全读取的连续区域。确认文件夹后，这个越界映射可能导致 native worker 直接退出，来不及发送 `done` 或可捕获的 `error` 消息；父进程因此只能报告 “worker exited before reporting a result”。

Koffi 3.1 提供针对 NUL 结尾 UTF-16 指针的解码接口，结果处理不应依赖固定长度的越界内存视图。

## 合规修复要求

当前不能直接修改只读参考仓库、已安装依赖或 DeepSeek Harness 上游核心。实现基线落地后，修复必须选择以下合规路径之一：

1. 升级到经相同 Windows 复现步骤证明已修复该问题的官方 DSH 版本；或
2. 通过 DSH 官方目录选择器扩展接口提供桌面后端，并使用 Electron 主进程的原生 `dialog.showOpenDialog`，同时保留取消、超时、窗口关闭和插件失败降级行为。

禁止通过运行时改写 `node_modules`、DOM 猴子补丁或覆盖 DSH single slots 修复。

## 修复后的最低验证

- 修复前失败证明能够稳定触发。
- 在 Windows 安装版和开发版分别选择包含中文、空格及较长路径的空测试目录。
- 取消选择返回正常状态，不显示错误。
- 连续选择、窗口关闭和 worker/插件失败均不会永久 Loading。
- 工作区成功打开，并且 Harness 原生会话仍可用。
- 相关单元/契约测试、类型检查、构建与桌面启动验证全部通过。
- UI 验证使用用户明确选择的 Browser 能力（如适用）或原生窗口验证，保持相同视口进行前后对比。

## 剩余风险

- 当前产品实现尚未落入唯一可写仓库，无法提交或运行实际修复。
- 尚未验证官方 DSH 是否已有包含该修复的新版本。
- 未获得开发/安装版的精确启动命令与 Windows 版本信息。

## 回滚方式

本记录没有修改功能实现。未来修复应通过独立 commit 交付，并使用 `git revert <fix-commit>` 回滚；不得修改或删除用户数据。
