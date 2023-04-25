import * as core from '@actions/core';
import { createTransport } from 'nodemailer';
import { readFileSync } from 'fs';
import MarkdownIt from 'markdown-it';
import format from 'date-fns/format';

import { User } from './types';
import { style } from './style';
import { Client } from './client';
import { toMarkdown } from './output';

const md = new MarkdownIt();

const date = new Date();

function render(template: string, up: User, users: User[]): string {
  const content = template
    .replace(/{data}/g, toMarkdown(users))
    .replace(/{vup}/g, up.username)
    .replace(/{today}/g, format(date, 'yyyy 年 M 月 d 日'))
    .replace(/{today:src}/g, format(date, 'yyyy-MM-dd'))
    .replace(/{today:full}/g, format(date, 'yyyy 年 M 月 d 日 HH:mm'));
  return `<div class="markdown-body">${md.render(content)}</div><style>${style}</style>`;
}

export async function sendEmail(client: Client, users: User[]): Promise<void> {
  const sender = core.getInput('sender');
  const senderHost = core.getInput('sender_host');
  const senderPass = core.getInput('sender_pass');
  const receiver = core.getInput('receiver');

  if (sender === '' || senderHost === '' || senderPass === '' || receiver === '') return;

  const transport = createTransport({
    host: senderHost,
    port: 587,
    secure: true,
    auth: {
      user: sender,
      pass: senderPass
    }
  });

  const up = await client.getUP();
  const template = readFileSync('./template.md', 'utf-8');
  const content = render(template, up, users);

  await transport.sendMail({
    from: sender,
    to: receiver,
    subject: `${up.username} 的 ${format(date, 'yyyy 年 M 月 d 日')} 舰长日报`,
    html: content
  });
}
