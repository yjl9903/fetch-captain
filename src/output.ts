import { User } from './types';

export function getType(level?: number): string {
  if (level === 3) return '舰长';
  if (level === 2) return '提督';
  if (level === 1) return '总督';
  return '舰长';
}

export function toCSV(list: User[]): string {
  const text = ['rank,uid,username,type'];
  let cnt = 1;
  for (const user of list) {
    text.push(`${cnt++},${user.uid},${user.username},${getType(user.level)}`);
  }
  return text.join('\n');
}

export function toMarkdown(list: User[]): string {
  const text = ['|序号|UID|用户名|大航海|', '|:-:|:-:|:-:|:-:|'];
  let cnt = 1;
  for (const user of list) {
    text.push(`|${cnt++}|${user.uid}|${user.username}|${getType(user.level)}|`);
  }
  return text.join('\n');
}
