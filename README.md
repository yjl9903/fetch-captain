# Fetch Captain

[![Build](https://github.com/yjl9903/fetch-captain/actions/workflows/ci.yml/badge.svg)](https://github.com/yjl9903/fetch-captain/actions/workflows/ci.yml)
[![Check dist](https://github.com/yjl9903/fetch-captain/actions/workflows/check-dist.yml/badge.svg)](https://github.com/yjl9903/fetch-captain/actions/workflows/check-dist.yml)

Automatically fetch the captain list of your favourite bilibili VUP.

## Usage

Add the following config to your Github Actions. Fill roomid and ruid.

```yml
- uses: yjl9903/fetch-captain@v1
  with:
    ruid: <UID>
    roomid: <直播间 ID>
    # output: './YYYY-MM-DD.csv'
```

Notice that you should push changes (e.g. `./2022-3-5.csv`) in your following actions steps manually.

Example repo: [Miki-Captain](https://github.com/yjl9903/Miki-Captain), [Nagisa-Captain](https://github.com/yjl9903/Nagisa-Captain).

> 👷 **Migration from v0 to v1**
>
> **Sending email is deprecated**: If you still want to use it, please combine this action with other stuffs.
>
> **CSV output path**: Change `outdir` to `output`, which means the output file pattern instead of output directory. It uses supports some date placeholder, including `YYYY`, `MM`, `DD`. By default, it will dump csv file to `./YYYY-MM-DD.csv` (i.e. `./2024-04-25.csv`).

## License

MIT License © 2023 [XLor](https://github.com/yjl9903)
