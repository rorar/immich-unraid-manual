# Step 1: Create Shares

Quicklink to the Shares overview (paste into your browser while logged into Unraid):

```
http://<your-unraid-ip>/Shares/Share?name=
```

Open up your Unraid web interface and using the top navigation menu, navigate to the ![Shares](assets/images/Unraid%20-%20Tab%20Shares.png){: .inline-button } tab.
Here, we will create two shares: one for the main media library and another for generated files.
Click on ![Add Share](assets/images/Unraid%20-%20Tab%20Shares%20-%20Button%20Add%20Share.png){: .inline-button } on the bottom left of your Share table and create the following shares:

## `immich` Share
**Data storage:** *Array (HDD)*

**Purpose:** *This share will be used to store your photo and video library, as well as backups and uploads. It will be the main storage location for your media files.*

- **Share name:** `immich`
- **Comments:** `Immich photo and video library, as well as backups and uploads.`
- **Minimum free space:** `10GB`
  (you can adjust this based on your needs - Setting too low may lead to issues with uploads and backups if the share runs out of space)
- **Primary storage (for new files and folders):** `Array`
- **Allocation method:** `High-Water`
- **Split level:** `Automatically split any directory as required`
- **Included disk(s):** `All`
  (BUT you can exclude disks if you want to dedicate specific disks for other purposes or if you have a mix of HDDs and SSDs in your array and want to keep the immich share on the HDDs. Also usable if you've got untrusted disks in your array that you don't want to use for immich storage.)
- **Excluded disk(s):** `None`

→ Hit ![Add Share](assets/images/Unraid%20-%20Tab%20Shares%20-%20Button%20Add%20Share.png){: .inline-button } to create the share.


## `immich-gen` Share
**Data storage:** *Cache (SSD/NVMe)*

**Purpose:** *This share will be used to store **gen**erated files like thumbnails and encoded videos. Also your profile lives here.*

- **Share name:** `immich-gen`
- **Comments:** `Immich generated files (thumbnails, encoded videos) and profile.`
- **Minimum free space:** `10GB`
  (you can adjust this based on your needs - Setting too low may lead to issues with thumbnail generation and video encoding if the share runs out of space)
- **Primary storage (for new files and folders):** `Cache`
- **Secondary storage:** `Array`
  (HDD - this is a fallback in case the cache runs out of space, but ideally, you want to keep the immich-gen share on the cache for optimal performance)
- **Allocation method:** `High-Water`
- **Split level:** `Automatically split any directory as required`
- **Included disk(s):** `All`
  (BUT you can exclude disks if you want to dedicate specific disks for other purposes or if you have a mix of HDDs and SSDs in your array and want to keep the immich share on the HDDs. Also usable if you've got untrusted disks in your array that you don't want to use for immich storage.)
- **Excluded disk(s):** `None`
- **Mover actions:** `Cache -> Array`

→ Hit ![Add Share](assets/images/Unraid%20-%20Tab%20Shares%20-%20Button%20Add%20Share.png){: .inline-button } to create the share.
