# Fetch Captain

Add the following config to your Github Actions. Fill roomid and ruid.

```yml
- uses: yjl9903/fetch-captain@v0
  with:
    roomid: 直播间 ID
    ruid: UID
    # sender: ${{ secrets.SENDER }}
    # sender_pass: ${{ secrets.SENDER_PASS }}
    # sender_host: ${{ secrets.SENDER_HOST }}
    # receiver: ${{ secrets.RECEIVER }}
```

Notice that you should push changes (e.g. `2022-3-5.csv`) in your following actions steps manually.

Example repo: [Miki-Captain](https://github.com/yjl9903/Miki-Captain).
