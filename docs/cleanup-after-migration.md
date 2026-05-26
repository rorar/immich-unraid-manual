# Cleanup After Migration

## Cleanup Files

After you have successfully downloaded and extracted your photos from Google Takeout, you can delete any temporary files in `/mnt/user/immich/Takeout/` that were created during the download process.

## Cleanup Firefox Container

The Firefox container was only needed for downloading the Google Takeout export. You can safely remove it:

1. Go to the **Docker** tab
2. Click on the Firefox container and select **Remove**
3. Delete the Firefox appdata at `/mnt/user/appdata/firefox-takeout-export/` (or whatever name you chose) to free up space and remove any saved browser data (cookies, sessions, cached login credentials)

## Cleanup API Keys

Remove your Immich API key that you created for PhotoMigrator / Immich Power Tools in the Immich web UI to ensure that there are no security risks from having an unused API key lying around.

```
http://<your-unraid-ip>:2283/user-settings?isOpen=api-keys
```

## Cleanup Google Photos

If you have verified that all your photos have been successfully migrated to Immich and you no longer need your Google Photos library, you can choose to delete your Google Photos library to free up space.

> [!CAUTION]
> Make sure to double-check that everything is working correctly in Immich and that you have backups of your photos before deleting your Google Photos library. This action is irreversible and can't be undone.
