import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { build } from 'esbuild';

const output = 'dist';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of await readdir('.')) {
  if (/\.html$|\.css$|\.js$|\.ico$/i.test(item) && item !== 'portal-ofertas.js') {
    await cp(item, join(output, item));
  }
}
await cp('assets', join(output, 'assets'), { recursive: true });
await cp('data', join(output, 'data'), { recursive: true });
await build({
  entryPoints: ['src/portal-ofertas.js'],
  outfile: join(output, 'portal-ofertas.js'),
  bundle: true,
  minify: true,
  target: ['es2022'],
  platform: 'browser',
  format: 'iife',
});
