# Google Takeout Phase 2.5 — Extract tar Archives

> [!IMPORTANT]
> THIS STEP IS ONLY NECESSARY IF YOU CHOSE `tar` AS THE FILE TYPE FOR YOUR GOOGLE TAKEOUT EXPORT. IF YOU'VE CHOSEN `zip`, YOU CAN SKIP THIS STEP AND MOVE FORWARD TO [Google Takeout Phase 3: PhotoMigrator](google-takeout-import-with-photomigrator.md) AS PHOTO MIGRATOR CAN HANDLE ZIP FILES OUT OF THE BOX.

Once your Google Takeout downloads are complete (see [Phase 2](google-takeout-download-with-firefox.md)), you need to extract them.

Open the Unraid web interface and open the terminal (click the ![Terminal](assets/images/Unraid%20-%20Top%20Menu%20-%20Button%20Start%20Webterminal.png){: .inline-button } icon in the top right corner of the navigation bar). The following commands use a `tmux` session so the extraction continues even if you close the web terminal.

First, download the extraction script:
```bash
wget -O /mnt/user/immich/Takeout/extract-takeout.sh https://raw.githubusercontent.com/rorar/immich-unraid-manual/main/scripts/extract-takeout.sh
```

Then run it inside a tmux session:
```bash
tmux new-session -s takeout 'bash /mnt/user/immich/Takeout/extract-takeout.sh /mnt/user/immich/Takeout'
```

The script extracts each archive sequentially, then verifies every file. You will see `OK` or `WARNING` per archive, and any missing files are listed individually.

**tmux tips:**
- If you close the terminal, the extraction keeps running in the background
- To reattach: `tmux attach -t takeout`
- To check if it's still running: `tmux ls`

> [!NOTE]
> - Extraction can take a while for large libraries. Be patient.
> - After successful extraction and migration to Immich, you can delete the `.tgz` files to free up space.
> - Keep the extracted files and your Google Photos library until you've verified everything imported correctly into Immich.
