# 阶段 3：引用验证与证据溯源

## 目标

验证书目信息并建立 Claim → Source → Artifact 的可查询关系。

## 任务

1. 实现 `citation_verify`：标准化 reference、匹配候选、比较作者/年份/venue/DOI、输出置信度和差异。
2. 区分“书目存在”与“引用内容被支持”；后者必须关联具体论文片段。
3. 定义不可变 Evidence Link：claim、source ref、位置、验证方法、置信度、创建时间。
4. 提供 Artifact 中的来源回填与查询接口。
5. 加入同名论文、作者变体、DOI 不一致、无匹配和冲突来源的测试。

## 验收

系统不会把“检索到相似论文”表述为“已验证正确”；任意已保存 Claim 均可查询其支持或反驳证据。

## 给代码 AI 的 Prompt

```text
在 dsh-research-plugins 实现阶段 3 的 citation_verify 和 Evidence Link。请严格区分 bibliographic verification 与 claim support verification；前者不能自动证明后者。

工具输出要包含候选、匹配理由、字段差异、confidence、verification sources 和 problems。Evidence Link 必须保存 source artifact、精确位置、支持/反驳关系和方法版本，且不得静默覆盖。为常见书目歧义和错误匹配写单元测试。保持网络 provider 可替换，绝不将模型生成内容当作验证来源。
```
