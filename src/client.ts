import * as core from '@actions/core';
import axios from 'axios';

import { User } from './types';
import { retry } from './utils';

export class Client {
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
      }, 50);
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
