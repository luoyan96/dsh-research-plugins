import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/domain/index.ts'],
  format: 'esm',
  dts: true,
  clean: true,
  outDir: 'lib',
  deps: { neverBundle: ['@deepseek-ai/cordis', '@deepseek-ai/dsh-tools'] },
})
