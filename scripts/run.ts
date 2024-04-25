import { Client } from '../src/client';
import { printUsers } from '../src/output';

const ruid = '477317922';
const roomid = '21672023';

async function main() {
  const client = new Client(roomid, ruid);
  const list = await client.get();
  printUsers(list);
}

main();
