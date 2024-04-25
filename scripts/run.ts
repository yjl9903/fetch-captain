import { Client } from '../src/client';
import { printUsers, toCSV } from '../src/output';

const ruid = '477317922';
const roomid = '21672023';

async function main(csv: boolean) {
  const client = new Client(roomid, ruid);
  const list = await client.get();

  if (csv) {
    console.log(toCSV(list));
  } else {
    printUsers(list);
  }
}

main(true);
