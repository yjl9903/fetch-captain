import * as core from '@actions/core';

import type { User } from './types';

import { padLeft } from './utils';

function getType(level?: number): string {
  if (level === 3) return '舰长';
  if (level === 2) return '提督';
  if (level === 1) return '总督';
  return '舰长';
}

export function printUsers(list: User[]) {
  let cnt = 1;
  const width = String(list.length).length;
  for (const user of list) {
    const index = padLeft(String(cnt++), width);
    const type = getType(user.level);
    const accompany = user.accompany ? `, accompany: ${user.accompany}` : '';
    core.info(`${index}. ${type} ${user.username} (uid: ${user.uid}${accompany})`);
  }
}

export function toCSV(list: User[]): string {
  const text = ['rank,uid,username,type,accompany'];
  let cnt = 1;
  for (const user of list) {
    text.push(
      `${cnt++},${user.uid},${user.username},${getType(user.level)},${user.accompany ?? ''}`
    );
  }
  return text.join('\n');
}

export function toMarkdown(list: User[]): string {
  const text = ['|序号|UID|用户名|大航海|陪伴天数|', '|:-:|:-:|:-:|:-:|:-:|'];
  let cnt = 1;
  for (const user of list) {
    text.push(
      `|${cnt++}|${user.uid}|${user.username}|${getType(user.level)}|${user.accompany ?? ''}|`
    );
  }
  return text.join('\n');
}
