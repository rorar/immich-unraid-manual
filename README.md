# Table of Contents
- [Unraid Immich Performance Setup](#unraid-immich-performance-setup)


## Unraid Immich Performance Setup + Google Takeout Guide
### TL;DR:
#### Immich Setup
We use a share living on the Cache (SSD/NVMe) for `encoded-video`, `profile` and `thumbs` - and a HDD share living on the Array for `backups`, `library` and `upload`. This setup allows us to leverage the speed of the Cache for frequently accessed data while utilizing the Array for long-term storage of original media files.
Plus we use a custom network for better performance and security, avoiding an overhead of the default `bridge` network.

##### Google Takeout Guide
Also for the migration from Google Photos to Immich, we use Google Takeout to export our photos and videos, and then utilize a Firefox Docker container on Unraid to download the exported files directly to our Unraid server, avoiding the need to download them to a local machine first.
We'll be using PhotoMigrator to automate the process of importing photos from our Google Takeout export into Immich. PhotoMigrator takes care of handling metadata and organizing the photos in the correct structure for Immich.

## Intdended Use
**READ THROUGH BEFORE STARTING YOUR SETUP.**
### In Scope:
This guide is intended for NEW setups of Immich on Unraid.

### Out of Scope:
Upgrading existing Immich setups as it requires significant changes to the existing setup and *data migration*.
If you have an existing Immich setup on Unraid and want to optimize it for better performance, I would recommend **backing up your data**, setting up a new instance of Immich following this guide and then migrating your data from the old instance to the new one.

*If you REALLY want to upgrade: Consult the Immich documentation and community for best practices on how to do this migration to ensure that you don't lose any data in the process. Happy learning!*

### What's inside this repository?
This repository contains a step-by-step guide for an optimal setup of Unraid for Immich, a self-hosted photo and video management application. The guide covers Unraid configuration WITHOUT using Docker Compose for a more Unraid-native approach and also performance optimization tips to ensure a smooth and efficient experience with Immich on Unraid.

AGAIN: This guide is intended for users who want to run a *NEW instance of Immich* on Unraid and are looking for best practices to achieve optimal performance and to ensure that your setup is running efficiently and effectively.

### Pre-requisites
- 2 hours of time to set up and configure everything (depending on your familiarity with Unraid and Docker, it may take more or less time)
- Unraid Server with Docker support
- Basic understanding of Unraid and Docker
- Knowledge how to add a Docker Container to a (custom) docker network
- Unraid Community Applications plugin installed
- A SSD/NVMe drive for Cache
- Very basic Terminal/Command Line knowledge for Unraid
- Google Account with photos stored in Google Photos (if you want to migrate from Google Photos to Immich)
- Triple the space of your Google Photos library available on your Unraid server for the migration process.
  Example: 100GB of Google Takeout Photos * 3 = 300GB
  -> 100GB for the compressed files, 100GB for the extracted files, 100GB for the final library after migration.


### Installation and Configuration
#### Pre-Work: Google Takeout Phase 1 - Request Exporting Your Photos from Google Photos
Before you can get your photos into Immich, you need to get them out of Google Photos.
If you have a large library, the Google Takeout exporting process can take a while (from my experience for 100GB half a day), so it's best to get it started as soon as possible.

**Purpose:** You can use Google Takeout to export your photos and videos from Google Photos including metadata.
For exporting from Google Takeout, you can choose between a `zip` and `tar`  file that you can extract and then using tools to upload to Immich.

We're covering `tar` here because of it's better compression and faster extraction times, especially for large libraries.

1. Go to [Google Takeout](https://takeout.google.com/)
2. Sign in to your Google account
3. Deselect all products using the "Deselect all" option
4. Then scroll down or search for "Google Photos"
5. Select only Google Photos for export.
6. Scroll to the bottom and click "Next step"

7. Choose your delivery method (e.g., "Send download link via email")
8. Choose the export frequency: "Export once"
9. Choose the file type: "tar"
10. Choose the file size: "50GB" (Google will split the export into multiple files if your library exceeds this size.)
11. Hit "Create export" and wait for the process to complete. You will receive an email with a download link once the export is ready.

#### Step 1: Create Shares `immich` and `immich-gen` for Immich on Unraid
Open up your Unraid web interface and using the top navigation menu, navigate to the "Shares" tab.
Here, we will create two shares: one for the main media library and another for generated files.
Click on "Add Share" on the bottom left of your Share table and create the following shares:

##### `immich` Share
**Data storage: **Array (HDD)
**Purpose:** This share will be used to store your photo and video library, as well as backups and uploads. It will be the main storage location for your media files.

**Share name:** immich
**Comments:** Immich photo and video library, as well as backups and uploads.
**Minimum free space:** 10GB (you can adjust this based on your needs - Setting too low may lead to issues with uploads and backups if the share runs out of space)
**Primary storage (for new files and folders):** Array
**Allocation method:** High-Water
**Split level:** Automatically split any directory as required
**Included disk(s):** All (BUT you can exclude disks if you want to dedicate specific disks for other purposes or if you have a mix of HDDs and SSDs in your array and want to keep the immich share on the HDDs. Also usable if you've got untrusted disks in your array that you don't want to use for immich storage.)
**Excluded disk(s):** None

-> Hit "Add Share" to create the share.


##### `immich-gen` Share
**Data storage:** Cache (SSD/NVMe)
**Purpose:** This share will be used to store **gen**erated files like thumbnails and encoded videos. Also your profile lives here.

**Share name:** immich-gen
**Comments:** Immich generated files (thumbnails, encoded videos) and profile.
**Minimum free space:** 10GB (you can adjust this based on your needs - Setting too low may lead to issues with thumbnail generation and video encoding if the share runs out of space)
**Primary storage (for new files and folders):** Cache
**Secondary storage:** Array (HDD - this is a fallback in case the cache runs out of space, but ideally, you want to keep the immich-gen share on the cache for optimal performance)
**Allocation method:** High-Water
**Split level:** Automatically split any directory as required
**Included disk(s):** All (BUT you can exclude disks if you want to dedicate specific disks for other purposes or if you have a mix of HDDs and SSDs in your array and want to keep the immich share on the HDDs. Also usable if you've got untrusted disks in your array that you don't want to use for immich storage.)
**Excluded disk(s):** None
**Mover actions:** Cache -> Array

-> Hit "Add Share" to create the share.

#### Pre-Work: Google Takeout Phase 2 - Downloading and Extracting Your Photos from Google Takeout utilizing a Firefox Docker Container on Unraid
Once you receive the email from Google Takeout with the download link, you can use a Firefox Docker container on Unraid to download the exported files directly to your Unraid server. This method is especially useful if you have a large library, slower download speed and to avoid downloading the files to your local machine first and moving it to Unraid.

1. Go to the "Apps" tab in your Unraid web interface
2. Search for "Firefox" in the Community Applications.
3. Choose a Firefox container by LinuxServer.io and click "Install".
4. If you already have a Firefox container setup, choose to name the new container something like "firefox-takeout-export" to differentiate it from any other Firefox containers you may have.
5. During the installation process, scroll down and click on `Add another Path, Port, Variable, Label or Device`
6. To map the Download Path to the `immich` share, set the "Config Type" to "Path" (It's automtically pre-set)
   1. Name: takeout-export
   2. Container Path: /config/Downloads
   3. Host Path: /mnt/user/immich/Takeout
   4. Access Mode: Read/Write
   5. --> Hit "Save" to add the path mapping
7. Hit "Apply" to start the installation of the Firefox container with the new path mapping.
8.  Open the Firefox container's web UI
9.  You may be prompted with an SSL warning since the container is using a self-signed certificate. You can safely bypass this warning by clicking on "Advanced" and then "Accept the Risk and Continue" to proceed to the Firefox web UI.
10. Go to [https://mail.google.com/](https://mail.google.com/)
11. When prompted for giving Google/Alphabet your data, click "Deny All" (or similar)
12. Sign in to the Google account associated with your Google Takeout export.
13. Open the email from Google Takeout
14. Click on the download link(s) for your export.
15. Your export files will start downloading directly to the `immich` share on your Unraid server in the `Takeout` folder that we mapped to the Firefox container.

**NOTES:**
- The download speed may vary based on your internet connection and the size of your export. Be patient, especially if you have a large library. Grab a coffee or two while you wait! :coffee:
- Sometimes the download speed may be slower than expected as you may catched an overloaded Google Server. If you notice that the download is very slow, you can try pausing/aborting and resuming the download in the Firefox web UI to potentially improve the speed.

#### Step 2: Setting up Immich and it's dependencies with the optimal configuration for Unraid
Meanwhile while your export is downloading, you can set up Immich on your machine.
Instead of docker-compose, we'll be working with the Community Applications/Unraid Template method for installing Immich on Unraid.
But instead of using the default configuration, we'll be making some adjustments to optimize it for Unraid and our specific share setup.

We need four Services/Docker Templates
1. **PostgreSQL** database (which is a dependency for Immich), we'll use the one from SpaceInvaderOne's Repository in the CA.
2. **Valkey** (a redis fork) which is also a dependency for Immich, but you can use any redis container from the CA.
3. **The Immich application itself**, we'll use a "Custom" template based on @imagegenius docker-immich to set up your Immich container.
4. **PhotoMigrator** (a tool to help with the migration of photos from Google Takeout and other services to Immich), we'll use a "Custom" template based on @jaimetur https://github.com/jaimetur/PhotoMigrator docker image to set up the PhotoMigrator container.

##### Downloading Custom Templates
Before we can set up the Immich and PhotoMigrator containers, we need to download the custom templates for them. These templates are not available (yet) in the Community Applications, so we will be using "Custom" templates based on existing Docker images to set up these containers.

Let's grab the template using the terminal.
To open up the web-terminal for your Unraid server, click on the "Terminal" icon `>_` in the top right corner of your Unraid web interface.
Then, run the following command to download the Immich template to your Unraid server:

```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://github.com/rorar/unraid-templates/raw/refs/heads/main/templates/immich-performance.xml
```

Then run the following command to download the PhotoMigrator template to your Unraid server:

```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://github.com/rorar/unraid-templates/raw/refs/heads/main/templates/photomigrator.xml
```

**OPTIONAL/EXPERIMENTAL (see NOTE in PostgreSQL section below):** Then run the following command to download the PostgreSQL template to your Unraid server:

```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://github.com/rorar/unraid-templates/raw/refs/heads/main/templates/immich-vectorchord-db.xml
```


**NOTE:**
wget is a command-line utility for downloading files from the web. The `-P` flag specifies the directory where the downloaded file should be saved. In this case, we're saving the `immich-performance.xml`, `photomigrator.xml` and optional `immich-vectorchord-db.xml` template files to the `templates-user` directory of the Docker Manager plugin on Unraid.


##### PostgreSQL Templates
Choose between stability and latest features (choose one of the two options below based on your preference):
1. Stable and tested with Immich: `ghcr.io/immich-app/postgres:18-vectorchord0.5.3-pgvector0.8.1`
2. OPTIONAL: Latest version with potential new features but less tested with Immich: `tensorchord/vchord-postgres:pg18-v1.1.1` (This image has VectorChord 1.1.1 and pgvector 0.8.2 included)

**NOTE:**
You COULD use a newer PostgreSQL image with VectorCord 1.0.0 (See GitHub Issue [#23845](https://github.com/immich-app/immich/pull/23845) or even VectorChord 1.1.1 (See [this GitHub Comment](https://github.com/immich-app/immich/discussions/23830#discussioncomment-15956803)).
But the 0.5.3 version is more stable and has been tested more extensively with Immich, while the 1.0.0+ version is newer and may have some compatibility issues or bugs that haven't been fully resolved yet.
If you really want to use the latest version of VectorChord PostgreSQL, you can try it out using the custom template we downloaded earlier and see if it works well with your setup.

###### Official/Stable Immich PostgreSQL Template
The PostgreSQL template is available in the Community Applications BUT it is outdated, so you can simply
1. Go to the "Apps" tab in your Unraid web interface
2. Search for "PostgreSQL_Immich"
3. Click on "Install"
4. Change the settings/update the outdated entries to
   1. **Repository:** ghcr.io/immich-app/postgres:18-vectorchord0.5.3-pgvector0.8.1
   2. **POSTGRES_PASSWORD:** <PASSWORD_THAT_MATCHES_THE_IMMICH_DB_PASSWORD_VARIABLE>
   (Set a strong password for your PostgreSQL database. This is important for security, as it will protect your database from unauthorized access. Generate a secure one in the Unraid terminal: `openssl rand -base64 32 | tr -dc A-Za-z0-9 | head -c 32`)
   3. **POSTGRES_USER:** immichpguser
   4. **POSTGRES_DB:** immich
   5. **Database Storage Path (Appdata):** /mnt/user/appdata/PostgreSQL_Immich
   6. **PostgreSQL access port:** 5433
   (Change the access port to any port that is not already in use on your Unraid server. This is important to avoid port conflicts with other services running on your server.)
   7. Hit "Apply" to install the PostgreSQL container.

###### OPTIONAL/EXPERIMENTAL: VectorChord PostgreSQL Template
If you want to use the latest version of VectorChord, you can try it out using the custom template we downloaded earlier.
Once you have the template downloaded, you can
1. go to the "Docker" tab in your Unraid web interface,
2. click on "Add Container",
3. and then select the "immich-vectorchord-db" template
from the dropdown list of available templates to set up your immich-vectorchord-db container.

4. Change the settings/update the outdated entries to
   1. **POSTGRES_PASSWORD:** <PASSWORD_THAT_MATCHES_THE_IMMICH_DB_PASSWORD_VARIABLE>
   (Set a strong password for your PostgreSQL database. This is important for security, as it will protect your database from unauthorized access. Generate a secure one in the Unraid terminal: `openssl rand -base64 32 | tr -dc A-Za-z0-9 | head -c 32`)
   2. **POSTGRES_USER:** immichpguser
   3. **POSTGRES_DB:** immich
   4. **Database Storage Path (Appdata):** /mnt/user/appdata/PostgreSQL_Immich
   5. **PostgreSQL access port:** 5433
   (Change the access port to any port that is not already in use on your Unraid server. This is important to avoid port conflicts with other services running on your server.)
   6. Hit "Apply" to install the PostgreSQL container.


**NOTES:**
- If you really want to upgrade: See hints upgrading VectorChord version from 0.4.3 to 1.0.0 and above in [this comment](https://github.com/immich-app/immich/pull/23845#issuecomment-3566969928)


##### Immich Template
###### Download Immich Template
The custom template isn't in the Community Applications (yet), so we use a "Custom" template based on @imagegenius docker-immich to set up your Immich container.

Once you have the template downloaded, you can
- go to the "Docker" tab in your Unraid web interface,
- click on "Add Container",
- and then select the "immich-performance" template
from the dropdown list of available templates to set up your Immich container.

###### Change settings for machine-learning

### Google Takout Phase 3: PhotoMigrator
PhotoMigrator is a tool to help with the migration of photos from Google Takeout and other services to Immich. It can be used to automate the process of importing photos from your Google Takeout export into Immich, including handling metadata and organizing the photos in the correct structure for Immich.

Run through the setup process and start the container. Then, you can access the PhotoMigrator web UI to configure PhotoMigrator. The [PhotoMigrator documentation](http://192.168.178.24:6078/docs/view/help) provides detailed instructions on how to use the tool to migrate your photos from Google Takeout or any other supported photo service to Immich.

#### Quick Start Guide for PhotoMigrator: Import Google Takeout Photos to Immich
1. Open the PhotoMigrator web UI
2. Login with Default account - User:admin / Password: admin123
3. Configuration Panel > Feature Config > Immich Photos
4. Fill out
   1. IMMICH_URL
   Change this IP by the IP that contains the Immich server or by your valid Immich URL
   2. IMMICH_API_KEY_ADMIN
   Your ADMIN_API_KEY for Immich Photos (Your can create can API_KEY in your Account Settings-->API_KEY Keys. Grant ALL Access.
5.

## Cleanup
### Files
After you have successfully downloaded and extracted your photos from Google Takeout, you can clean up the Firefox container by deleting it and any temporary files in `/mnt/user/immich/Takeout/` that were created during the download process.
### API Keys
Revove your Immich API Key iin your Account Settings-->API_KEY Keys that you created for the PhotoMigrator in the Immich web UI to ensure that there are no security risks from having an unused API key lying around.

## Kudos and Credits
### This a polished guide from Starbuckstech @starbuck93
Many thanks for sharing your knowledge and experience with the community! :slightly_smiling_face:
Link: https://blog.starbuckstech.com/articles/how-to-install-and-optimize-immich-on-unraid-for-faster-timeline-loading/
Link Archive.org: https://web.archive.org/web/20260416192528/https://blog.starbuckstech.com/articles/how-to-install-and-optimize-immich-on-unraid-for-faster-timeline-loading/
Gist: https://gist.github.com/starbuck93/5ce522b007f67267869afbf13d071f40
### Immich Team
Immich is an incredible open-source project that has been developed and maintained by a dedicated team of developers. Immich has quickly become one of the most popular self-hosted photo and video management applications, and it's all thanks to the hard work and dedication of the Immich team. If you find Immich useful, consider supporting the project by donating or contributing to the codebase.
Link: https://immich.app/
### PhotoMigrator Team
PhotoMigrator is a fantastic tool that has been developed to help users migrate their photos from various services to Immich. The team behind PhotoMigrator has done an amazing job creating a user-friendly and efficient tool that simplifies the migration process for users. If you find PhotoMigrator useful, consider supporting the project by donating or contributing to the codebase.
Link: https://github.com/jaimetur/PhotoMigrator/
