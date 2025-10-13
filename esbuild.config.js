import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node22',
  format: 'esm',
  outdir: 'dist',
  packages: 'external',
  minify: false,
  sourcemap: false,
});

console.log('✓ Server built successfully');
