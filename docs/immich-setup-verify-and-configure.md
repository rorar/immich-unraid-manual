# Step 10: Setup, Verify & Configure Immich

## Setup Immich

1. Click on the `Immich` folder in Docker and hit ![Start](assets/images/Unraid%20-%20Docker%20Tab%20-%20Dropdown-Menu%20Dropdown-Context%20-%20Button%20Start.png){: .inline-button } (this will start all containers in the correct order)
2. Wait a few minutes for the server and all dependent services to initialize
3. Access Immich at `http://<your-unraid-ip>:2283`
4. Create an admin account with your email and a strong password (you'll need this to log in to the web UI)
5. Log in with the admin account you created
6. Go through the initial setup steps in the web UI
7. If asked for "[Storage Template](https://docs.immich.app/administration/storage-template/)":
    1. Enable the toggle to enable it.
    2. I'd recommend the following template (which results in the folder/file structure `/YYYY/MM/DD/filename`) for better organization of your library:

        ```
        {{y}}/{{MM}}/{{dd}}/{{filename}}
        ```

        But you can manually build one by yourself OR choose a template from the preset dropdown. You can also change this later in the settings.

8. Recommendation: Follow the 3-2-1 backup strategy. You can set this up later.
9. Go to `Account Icon (Top right) → Account Settings → Administration` and set up Immich to your liking.

## Administration Settings

### Set periodic server jobs & Unraid Appdata Backup Plugin Conflict Warning

Quicklink to the relevant settings page in Immich Admin UI:

```
http://<your-unraid-ip>:2283/admin/system-settings?isOpen=external-library+notifications+library-watching+library-scanning+nightly-tasks+backup
```

> [!WARNING]
> If you've got the Unraid plugin `Appdata Backup` installed, avoid setting
>
> - `Database Dump Settings` -> `Cron expression`
> - `External Library` (if used) -> `Periodic scanning`
> - `Nightly Tasks Settings` -> `Start time`
>
> *at the same time you would backup your appdata folder.*
>
> If set in parallel/in the same time window, your
>
> - database won't get backed up
> - Libraries won't get indexed
> - Nightly Task won't run
>
> as the `Appdata Backup` plugin stops the docker container.
> Worst case would be **corrupted data.**
> To avoid this, you can set the named schedules to a different time than your appdata backup schedule.
>
> **Recommended schedule order:**
>
> 1. **Database Dump** — backup a clean database state first
> 2. **External Library Periodic Scanning** — index new/changed files
> 3. **Nightly Tasks** — process the newly indexed data
>
> This way, if something goes wrong during library indexing, you already have a clean database backup from before it started.

### Image Settings

Quicklink to the relevant settings page:

```
http://<your-unraid-ip>:2283/admin/system-settings?isOpen=image+thumbnail-settings+preview-settings+fullsize-settings
```

**Or navigate manually:** Administration → System Settings → Image

#### Thumbnail Settings

Under **Image → Thumbnail Settings** (small thumbnails used in the main timeline and grid views):

- **Format:** `JPEG` (default: WebP. JPEG is faster to encode and has broader compatibility. WebP produces smaller files but is slower.)
- **Resolution:** `480p` (default: 250p. Higher resolution thumbnails look sharper in the timeline grid, especially on high-DPI displays.)
- **Quality:** `80` (default. 1-100, higher is better but produces larger files.)
- **Progressive:** Off (default. Encode JPEG progressively for gradual loading. No effect on WebP.)

#### Preview Settings

Under **Image → Preview Settings** (medium-size images used when viewing a single asset and for machine learning):

- **Format:** `JPEG` (default. WebP produces smaller files but is slower to encode.)
- **Resolution:** `1440p` (default. Setting a low value may affect machine learning quality.)
- **Quality:** `80` (default. Low values may affect ML quality.)
- **Progressive:** Off (default.)

#### Full-size Image Settings

Under **Image → Full-size Image Settings** (full-size images used when zoomed in):

- **Enable:** Off (default. Generate full-size images for non-web-friendly formats like RAW. Does not affect JPEG.)

#### General Image Options

- **Prefer wide gamut:** On (default. Uses Display P3 colorspace for thumbnails. Better preserves vibrance of wide-gamut images.)
- **Prefer embedded preview:** Off (default. Use embedded previews in RAW photos. Can produce more accurate colors but quality is camera-dependent.)

Click ![Save](assets/images/Immich%20-%20Administration%20-%20Button%20Save.png){: .inline-button } after making changes.

### Hardware Acceleration

If you chose a GPU-accelerated server template (QSV/VAAPI or NVENC), you need to enable hardware acceleration in the Immich Admin UI.

Quicklink to the relevant settings page:

```
http://<your-unraid-ip>:2283/admin/system-settings?isOpen=video-transcoding+transcoding-policy+machine-learning+encoding-options+hardware-acceleration
```

**Or navigate manually:** Administration → System Settings → Video Transcoding

#### 1. Hardware Acceleration Settings

Under **Video Transcoding → Hardware Acceleration**, set the **Acceleration API** based on your template:

| Template | Acceleration API |
|----------|-----------------|
| `immich-server` (CPU only) | Disabled |
| `immich-server-qsv-vaapi` (Intel) | Quick Sync |
| `immich-server-qsv-vaapi` (AMD) | VAAPI |
| `immich-server-nvenc` (NVIDIA) | NVENC |

- **Hardware decoding:** Enable (recommended) - accelerates both decoding and encoding
- **Constant quality mode:** Auto (recommended)
- **Temporal AQ:** Leave disabled unless you have a modern NVIDIA GPU (NVENC only)
- **Preferred hardware device:** Leave empty unless you have multiple GPUs

#### 2. Transcode Policy

> [!NOTE]
> The Transcoding settings below are recommendations for a good balance of disk usage and quality. You can adjust them based on your needs and preferences. For best compatibility, consider using Immich's default settings.

Under **Video Transcoding → Transcode Policy**:

- **Transcode policy:** `Only videos not in an accepted format` (default - only transcodes incompatible videos)
- **Accepted video codecs:** `VP9` (For Apple iOS devices below iOS 14, choose `H.264` instead for better compatibility)
- **Accepted audio codecs:** `opus` (For Apple iOS devices below iOS 17 and Android devices below Android 10, choose `AAC` instead for better compatibility)
- **Accepted containers:** Deselect all (everything will be transcoded to MP4)

#### 3. Encoding Options

> [!NOTE]
> The Encoding settings below are recommendations for a good balance of disk usage and quality. You can adjust them based on your needs and preferences. For best compatibility, consider using Immich's default settings.

Under **Video Transcoding → Encoding Options**:

- **Video codec:** `VP9` (For Apple iOS devices below iOS 14, choose `H.264` instead for better compatibility)
- **Audio codec:** `opus` (For Apple iOS devices below iOS 17 and Android devices below Android 10, choose `AAC` instead for better compatibility)
- **Target resolution:** `Original` (avoid unnecessary re-encoding if the original resolution is already suitable)
- **Constant rate factor (-crf):** `31` for VP9 / `23` for H.264. Lower = better quality but larger files. Typical values: 23 for H.264, 28 for HEVC, 31 for VP9, 35 for AV1.
- **Preset:** `veryslow` (best quality and compression, but slowest encoding speed. You can choose `slow` or `medium` for faster encoding at the cost of larger file sizes.)
- **Threads:** `0` (default - auto, uses all available CPU cores)

Click ![Save](assets/images/Immich%20-%20Administration%20-%20Button%20Save.png){: .inline-button } after making changes.

## Setup Mobile Apps

> [!WARNING]
> For Google Takeout: I would recommend not to sync images from your mobile phone yet as it may lead to duplicates.

1. Download the Immich app: [iOS App Store](https://apps.apple.com/app/immich/id1613945652) | [Google Play](https://play.google.com/store/apps/details?id=app.alextran.immich) | [F-Droid](https://f-droid.org/packages/app.alextran.immich/)
2. Open the app and enter your server URL: `http://<your-unraid-ip>:2283`
3. Log in with your admin account (or a user account you created)
4. To enable auto-backup: tap the cloud icon (top right) → "Choose albums to backup" → select albums (e.g. Camera Roll) → configure foreground/background upload preferences
5. **iOS Background Backup:** Settings → General - Background App Refresh Ensure → Immich is toggled ON and grant location permission for reliable background uploads.
6. **Android Battery Optimization** Settings → Apps → Immich → Battery. Visit [dontkillmyapp.com](https://dontkillmyapp.com) for device-specific guidance on preventing battery optimization from interrupting uploads.

## Verify

1. Verify that everything is working by uploading a test photo and checking that thumbnails are generated and that the photo appears in the library.
2. Check the logs of each container if you encounter any issues to troubleshoot.
3. **Verify GPU acceleration for Machine Learning (if applicable):**
    If you chose a GPU-accelerated ML template (CUDA, OpenVINO, or ROCm), verify that the GPU is being used:

    - Upload a photo and wait for face detection / smart search to process (the provider log appears on first model load, not on container startup)
    - Then run this command in the Unraid terminal:

        ```bash
        docker logs immich-machine-learning 2>&1 | grep -i "execution providers" | tail -1 | grep -qv "'CPUExecutionProvider'" && echo "GPU acceleration: ACTIVE" || echo "GPU acceleration: NOT ACTIVE (CPU only)"
        ```

    - If it says **NOT ACTIVE**, check your device mappings and driver setup
    - For details, check the full log:

        ```bash
        docker logs immich-machine-learning 2>&1 | grep -i "execution providers"
        ```

        - NVIDIA: `['CUDAExecutionProvider', 'CPUExecutionProvider']`
        - Intel: `['OpenVINOExecutionProvider', 'CPUExecutionProvider']`
        - AMD: `['MIGraphXExecutionProvider', 'CPUExecutionProvider']`
        - CPU only: `['CPUExecutionProvider']`

> [!NOTE]
> **Not migrating from Google Photos?** You're done! Immich is ready to use.
> If you want to migrate, continue with [Create an API-Key](#create-an-api-key) below, then proceed to [Google Takeout Phase 3: PhotoMigrator](google-takeout-import-with-photomigrator.md).

---

## Create an API-Key

You'll need an API key for tools that connect to the Immich API, such as [PhotoMigrator](google-takeout-import-with-photomigrator.md) (Google Takeout import) and [Immich Power Tools](immich-power-tools.md) (advanced library management).

Quicklink to the API key settings page:

```
http://<your-unraid-ip>:2283/user-settings?isOpen=api-keys
```

1. Go to `Account Icon (Top right) → Account Settings → API Keys`
2. Click **New API Key**
3. Grant **ALL** access by clicking "Select All"
4. Click **Create**
5. Copy the API key and store it securely — you won't be able to see it again.

> [!TIP]
> Delete your API key after migration is complete to avoid leaving unused credentials. (see [Cleanup](cleanup-after-migration.md))
