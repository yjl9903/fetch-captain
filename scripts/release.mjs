import { execa } from 'execa';
import { readJSON, writeJSON } from 'fs-extra';

async function check() {
  const result = await execa('git', ['branch']);
  if (result.stdout.search('main') < 0) {
    console.error(`Please re-run in main branch`);
    process.exit(1);
  }
}

async function run(cmd, ...args) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  await execa(cmd, args, { stdio: 'inherit' });
  console.log();
}

async function bootstrap() {
  await check();

  const version = process.argv[2];

  if (!version || !/^\d+.\d+.\d+/.test(version)) {
    console.error(`Invalid version: ${version}`);
    process.exit(1);
  }

  console.log(`Publish fetch-captain@${version}`);
  console.log();

  const json = await readJSON('./package.json');
  json.version = version;
  await writeJSON('./package.json', json, { spaces: 2 });

  await run('pnpm', 'run', 'all');

  await run('git', 'add', '.');
  await run('git', 'commit', '-m', `release: v${version}`);

  await run('git', 'tag', '-a', `v${version}`, '-m', `release: v${version}`);
  await run('git', 'push', 'origin', `:refs/tags/v${version.split('.')[0]}`);
  await run('git', 'tag', '-fa', `v${version.split('.')[0]}`, '-m', `release: v${version}`);
  await run('git', 'push', 'origin', 'main', '--tags');
}

bootstrap();
