# Google Takeout Phase 1 — Request Export

Before you can get your photos into Immich, you need to get them out of Google Photos.
If you have a large library, the Google Takeout exporting process can take a while (from my experience for 100GB half a day), so it's best to get it started as soon as possible.

**Purpose:** You can use Google Takeout to export your photos and videos from Google Photos including metadata.
For exporting from Google Takeout, you can choose between a `zip` and `tar` file that you can extract and then using tools to upload to Immich.

Depending on:

- Your internet connection speed
- possibly metered internet connection (some ISPs throttle download speeds after a certain amount of data downloaded)

... choose between `zip` and `tar` for your export.

**The convenient choice: `zip` (recommended)**

`zip` has a larger file size but is supported by PhotoMigrator out of the box, *taking care of the extraction process*. See chapter [Google Takeout Phase 3: PhotoMigrator](google-takeout-import-with-photomigrator.md) for more details.

**The smaller and faster choice: `tar`**

But if you have a large library and/or slower internet speed, I would recommend choosing `tar` for better compression and faster extraction times. You can easily extract `tar` files on Unraid using the terminal or a Docker container. We got that step covered in chapter [Pre-Work: Google Takeout Phase 2.5 - Extract tar Archives](google-takeout-extract-tar-archives.md).

1. Go to [Google Takeout](https://takeout.google.com/)
2. Sign in to your Google account
3. Deselect all products using the "Deselect all" option
4. Then scroll down or search for "Google Photos"
5. Select only Google Photos for export.
6. Scroll to the bottom and click "Next step"
7. Choose your delivery method (e.g., "Send download link via email")
8. Choose the export frequency: "Export once"
9. Choose the file type: `zip` or `tar`
10. Choose the file size: "50GB" (Google will split the export into multiple files if your library exceeds this size.)
11. Hit "Create export" and wait for the process to complete. You will receive an email with a download link once the export is ready.
