import * as core from '@actions/core';

import type { Captain } from './types';

import { padLeft } from './utils';

function getType(level?: number): string {
  if (level === 3) return '舰长';
  if (level === 2) return '提督';
  if (level === 1) return '总督';
  return '舰长';
}

export function printUsers(list: Captain[]) {
  const width = String(list.length).length;
  for (const user of list) {
    const index = padLeft(String(user.rank), width);
    const type = getType(user.level);
    const medal = `${padLeft(String(user.medal.level), 2)}级${user.medal.name}`;
    const accompany = `陪伴了主播 ${user.accompany} 天`;
    core.info(`${index}. ${type} ${medal} ${user.username} (uid: ${user.uid}) ${accompany}`);
  }
}

export function toCSV(list: Captain[]): string {
  const text = ['rank,uid,username,type,accompany,medal_name,medal_level'];
  for (const user of list) {
    const type = getType(user.level);
    text.push(
      `${user.rank},${user.uid},${user.username},${type},${user.accompany},${user.medal.name},${user.medal.level}`
    );
  }
  return text.join('\n');
}

export function toMarkdown(list: Captain[]): string {
  const text = ['|序号|UID|用户名|大航海|陪伴天数|粉丝牌|等级|', '|:-:|:-:|:-:|:-:|:-:|:-:|:-:|'];
  for (const user of list) {
    text.push(
      `|${user.rank}|${user.uid}|${user.username}|${getType(user.level)}|${user.accompany}|${user.medal.name}|${user.medal.level}|`
    );
  }
  return text.join('\n');
}
