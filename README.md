# Fetch Captain

[![Build](https://github.com/yjl9903/fetch-captain/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/fetch-captain/actions/workflows/ci.yml) [![Check dist](https://github.com/yjl9903/fetch-captain/actions/workflows/check-dist.yml/badge.svg)](https://github.com/yjl9903/fetch-captain/actions/workflows/check-dist.yml)

Automatically fetch the captain list of your favourite bilibili VUP.

## Usage

Add the following config to your Github Actions. Fill roomid and ruid.

```yml
- uses: yjl9903/fetch-captain@v0
  with:
    roomid: 直播间 ID
    ruid: UID
    # outDir: './'
    # sender: ${{ secrets.SENDER }}
    # sender_pass: ${{ secrets.SENDER_PASS }}
    # sender_host: ${{ secrets.SENDER_HOST }}
    # receiver: ${{ secrets.RECEIVER }}
```

Notice that you should push changes (e.g. `./2022-3-5.csv`) in your following actions steps manually.

Example repo: [Miki-Captain](https://github.com/yjl9903/Miki-Captain).

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
