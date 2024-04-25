import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

import * as core from '@actions/core';

import { Client } from './client';
import { format } from './utils';
import { printUsers, toCSV } from './output';

async function run(): Promise<void> {
  const now = new Date();

  const ruid = core.getInput('ruid');
  const roomid = core.getInput('roomid');
  const outputPattern = core.getInput('output');

  const client = new Client(roomid, ruid);
  const list = await client.get();

  // Print users
  printUsers(list);

  // Dump fetched list to csv
  {
    const csvname = format(now, outputPattern);

    const content = toCSV(list);
    core.info(`---------------------------------------`);
    core.info(`Writing to ${csvname}`);

    // Set output `csv` for further usage
    core.setOutput('csv', csvname);

    // Dump csv
    if (!existsSync(path.dirname(csvname))) {
      mkdirSync(path.dirname(csvname), { recursive: true });
    }
    writeFileSync(csvname, content, 'utf-8');
  }
}

run();
