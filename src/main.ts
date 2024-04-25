import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import * as core from '@actions/core';
import { format } from 'date-fns';

import { Client } from './client';
import { padLeft } from './utils';
import { getType, toCSV } from './output';

function today(): string {
  const now = new Date();
  return format(now, 'yyyy-MM-dd');
}

async function run(): Promise<void> {
  const roomid = core.getInput('roomid');
  const ruid = core.getInput('ruid');
  const client = new Client(roomid, ruid);

  const list = await client.get();

  {
    let cnt = 1;
    const width = String(list.length).length;
    for (const user of list) {
      core.info(
        `${padLeft(String(cnt++), width)}. ${getType(user.level)} ${user.username} (uid: ${
          user.uid
        })`
      );
    }
  }
  {
    const outDir = core.getInput('outDir');
    const csvname = path.join(outDir, `${today()}.csv`);
    const content = toCSV(list);
    core.info(`---------------------------------------`);
    core.info(`Writing to ${csvname}`);
    core.setOutput('csv', csvname);
    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }
    writeFileSync(csvname, content, 'utf-8');
  }
}

run();
