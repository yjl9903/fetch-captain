import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import * as core from '@actions/core';
import { format } from 'date-fns';

import { Client } from './client';
import { printUsers, toCSV } from './output';

function today(): string {
  const now = new Date();
  return format(now, 'yyyy-MM-dd');
}

async function run(): Promise<void> {
  const ruid = core.getInput('ruid');
  const roomid = core.getInput('roomid');
  const outDir = core.getInput('outDir');

  const client = new Client(roomid, ruid);
  const list = await client.get();

  // Print users
  printUsers(list);

  // Dump fetched list to csv
  {
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
