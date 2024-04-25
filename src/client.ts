import * as core from '@actions/core';
import axios from 'axios';

import type { User, Captain } from './types';

import { retry } from './utils';

type RawCaptain = Omit<Captain, 'level' | 'medal'> & {
  guard_level: number;
  medal_info: {
    medal_name: string;
    medal_level: number;
    medal_color_start: number;
    medal_color_end: number;
    medal_color_border: number;
  };
};

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
      throw error;
    }
  }

  private async fetch(page: number): Promise<RawCaptain[]> {
    try {
      const { data } = await retry(() =>
        axios.get('https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList', {
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
      throw error;
    }
  }

  async get(): Promise<Captain[]> {
    const ans = [];
    for (let i = 1; ; i++) {
      const res = await this.fetch(i);
      if (res.length === 0) {
        break;
      }
      ans.push(...res);
    }

    return ans
      .map((u) => ({
        rank: u.rank,
        uid: u.uid,
        username: u.username,
        level: u.guard_level,
        accompany: u.accompany,
        medal: {
          name: u.medal_info.medal_name,
          level: u.medal_info.medal_level,
          colorStart: u.medal_info.medal_color_start,
          colorEnd: u.medal_info.medal_color_end,
          colorBorder: u.medal_info.medal_color_border
        }
      }))
      .sort((lhs, rhs) => lhs.rank - rhs.rank);
  }
}
