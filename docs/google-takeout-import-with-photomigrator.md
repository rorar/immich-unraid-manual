# Google Takeout Phase 3 — Import with PhotoMigrator
PhotoMigrator is a tool to help with the migration of photos from Google Takeout and other services to Immich. It automates importing photos including metadata handling and organizing files in the correct structure for Immich.

---

## PhotoMigrator Setup
1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the `photomigrator` template
3. Configure the volume mappings:

| Container Path | Host Path | Purpose |
|----------------|-----------|---------|
| `/app/config` | `/mnt/user/appdata/photomigrator/config` | Config files (Config.ini, docker.conf) |
| `/app/data/admin` | **`/mnt/user/immich/Takeout`** | Your extracted Google Takeout files |

4. Set **Network** to `immich_internal` (so PhotoMigrator can reach Immich by container name)
5. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.
6. Access the PhotoMigrator web UI at `http://<your-unraid-ip>:6078`

> [!NOTE]
> The mount target is `/app/data/admin` because PhotoMigrator's file browser uses per-user subdirectories. The default `admin` user browses under `/app/data/admin/`. With this mapping, your Takeout files are directly accessible via the `···` browse button → "Home (data)" in the web UI.

---

## Quick Start Guide: Import Google Takeout Photos to Immich
### Set Immich settings
1. Open the PhotoMigrator web UI at `http://<your-unraid-ip>:6078`
2. Login with default credentials — User: `admin` / Password: `admin123`
3. Go to **Configuration Panel** → **Feature Config** → **Immich Photos**
4. Fill out:
   - **IMMICH_URL:** `http://immich-server:2283` (uses container name since both are on `immich_internal`)
   - **IMMICH_API_KEY_ADMIN:** Paste in your Immich API-Key from Sektion [Create an API-Key](immich-setup-verify-and-configure.md#create-an-api-key)
   - **IMMICH_USERNAME_1:** <your Immich admin email address> (the one you use to log in to the Immich web UI)
   - **IMMICH_PASSWORD_1:** <your Immich admin password> (the one you use to log in to the Immich web UI)
   - **IMMICH_API_KEY_USER_1** Can be the same as IMMICH_API_KEY_ADMIN or you can create a separate API key for the user account in Immich and use that here for better security practices (recommended)
5. Click **Save config** to save your Immich connection settings.
### Prepare your photo library
1. Go to **Features Selector** → select the **GOOGLE TAKEOUT** tab
2. In the **Takeout Input & Output** section, click the `···` button next to `google-takeout`
3. In the folder dialog, click **"Home (data)"**
4.  Navigate into the **`Takeout`** folder (this contains either your `zip` files OR from the `tar` archive your extracted `Takeout/Google Fotos/...` files)
5.  Optionally change settings BUT Defaults should be find
6.  Click **"Use Current"** to set the path
7.  Click **Run module** to start your library preperation
8.  Grab a cup of coffee - the procedure can take a while depending on your photo library size
### Import your Google Takeout photo library to Immich
1. Go to **Features Selector** → select the **IMMICH PHOTOS** tab
2. At `select module`, open the dropdown menu and select `Upload All`
3. Click the `···` button next to `input folder`.
4. Select your input folder. At the moment of writing there's a bug that duplicates the path, so you have to dig through the folder structure (e.g. `/app/data/admin/Takeout/Takeout_/app/data/admin/processed_20260523-132324/Google Fotos`)
5. **Create Albums:** Click the `···` button next to `Albums Folder`
6. Select your folders that belongs into an Album (e.g. `Holidays 2023`, `Family`, etc.).
7.  Click **Run module** to start your library import.
8.  The module will upload your photos to Immich and assign them to albums based on the folder structure you selected in the previous step.

> [!NOTE]
> - The import process can take a while depending on the size of your library and your network speed. Be patient and monitor the logs for progress and any potential issues.
> - *Your system will be under heavy load during the import*, especially if you have a large library. This is normal as Immich processes each photo (generating thumbnails, extracting metadata, etc.) after upload.
> - For detailed instructions on all features and migration options, see the [PhotoMigrator repository](https://github.com/jaimetur/PhotoMigrator) and [PhotoMigrator repository](https://github.com/jaimetur/PhotoMigrator/blob/main/help/6-immich-photos.md).
