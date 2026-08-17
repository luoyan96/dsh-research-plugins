import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const configs: UserConfig[] = [
  {
    entry: ['src/index.ts', 'src/domain/index.ts'],
    format: 'esm',
    dts: true,
    clean: true,
    outDir: 'lib',
    deps: { neverBundle: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-skill', '@deepseek-ai/dsh-tools'] },
  },
  {
    entry: { client: 'src/client/index.ts' },
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    dts: false,
    clean: false,
    outDir: 'lib',
    deps: { alwaysBundle: () => true, onlyBundle: false },
    outputOptions: {
      entryFileNames: 'client.js',
      banner: 'window.__ModuleLoader__.load({ id: "dsh-research-plugins", factory: (require) => {',
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
]

export default defineConfig(configs)
