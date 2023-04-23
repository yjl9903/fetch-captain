import * as core from '@actions/core';
import axios from 'axios';
import format from 'date-fns/format';

import path from 'path';
import { writeFileSync } from 'fs';

import { User } from './types';
import { padLeft, retry } from './utils';
import { sendEmail } from './email';
import { getType, toCSV } from './output';

class Client {
  private readonly roomid: string;
  private readonly ruid: string;

  constructor(roomid: string, ruid: string) {
    this.roomid = roomid;
    this.ruid = ruid;
  }

  async getUP(): Promise<User> {
    try {
      return await retry(async () => {
        const { data } = await axios.get('https://api.bilibili.com/x/space/acc/info', {
          params: {
            mid: this.ruid
          }
        });
        return {
          uid: data.data.mid,
          username: data.data.name
        };
      }, 10);
    } catch (error: unknown) {
      core.setFailed(error as any);
      process.exit(1);
    }
  }

  private async fetch(page: number): Promise<Array<User & { guard_level: number }>> {
    try {
      const { data } = await retry(() =>
        axios.get('https://api.live.bilibili.com/guard/topList', {
          params: {
            roomid: this.roomid,
            ruid: this.ruid,
            page
          }
        })
      );
      if (page === 1) {
        return [...data.data.top3, ...data.data.list];
      } else {
        return data.data.list;
      }
    } catch (error: unknown) {
      core.setFailed(error as any);
      process.exit(1);
    }
  }

  async get(): Promise<User[]> {
    const ans = [];
    for (let i = 1; ; i++) {
      const res = await this.fetch(i);
      if (res.length === 0) {
        break;
      }
      ans.push(...res);
    }
    return ans
      .map((u) => ({ uid: u.uid, username: u.username, level: u.guard_level }))
      .sort((lhs, rhs) => (lhs.level ?? 3) - (rhs.level ?? 3));
  }
}

function today(offset = 0): string {
  const date = new Date(new Date().getTime() - offset);
  return format(date, 'yyyy-MM-dd');
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
    const csvname = path.join(core.getInput('outDir'), `${today(+core.getInput('offset'))}.csv`);
    const content = toCSV(list);
    core.info(`---------------------------------------`);
    core.info(`Writing to ${csvname}`);
    core.setOutput('csv', csvname);
    writeFileSync(csvname, content, 'utf-8');
  }

  await sendEmail(await client.getUP(), list);
}

run();
