import { User } from './types';

export function toCSV(list: User[]): string {
  const text = ['rank,uid,username'];
  let cnt = 1;
  for (const user of list) {
    text.push(`${cnt++},${user.uid},${user.username}`);
  }
  return text.join('\n');
}

export function toMarkdown(list: User[]): string {
  const text = ['|序号|UID|用户名|', '|:-:|:-:|:-:|'];
  let cnt = 1;
  for (const user of list) {
    text.push(`|${cnt++}|${user.uid}|${user.username}|`);
  }
  return text.join('\n');
}
