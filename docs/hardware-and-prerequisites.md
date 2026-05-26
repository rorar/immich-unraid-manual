# Hardware Recommendations and Pre-requisites

## Hardware Recommendations

| Component     | Minimum      | Recommended                                                                  | Large Libraries (500K+ assets) |
|---------------|--------------|------------------------------------------------------------------------------|--------------------------------|
| RAM           | 4 GB         | 8 GB                                                                         | 32-64 GB                       |
| CPU           | 2 cores      | 4 cores                                                                      | 8+ cores (modern AMD/Intel)    |
| OS Storage    | 50 GB SSD    | 100 GB NVMe                                                                  | 250 GB+ NVMe                   |
| Media Storage | Variable     | NVMe/SSD for DB, `encoded-video`, `profile` and `thumbs`                     | SSD for DB + HDD for media     |
| GPU/iGPU      | Not required | Intel 7th Gen. with Quick Sync, NVIDIA Gen. Pascal+, AMD Gen. Polaris+       | RTX 3060/4060 12GB             |

## Pre-requisites
- If you want to migrate from Google Photos to Immich:
  - Google Account with photos stored in Google Photos
  - Up to an day of patience for the Google Takeout *export and download process* (depending on the size of your library, it can take a while)
- 2 hours of time to set up and configure everything (depending on your familiarity with Unraid and Docker, it may take more or less time)
- Unraid Server with Docker support
- Unraid Community Applications plugin installed
- FolderView 3 plugin installed (for managing container start order)
- Basic understanding of Unraid and Docker
  - Knowledge how to add a Docker Container to a (custom) docker network
  - Very basic Terminal/Command Line knowledge for Unraid
- A SSD/NVMe drive for Cache (can be your Unraid Cache drive)
  - 7-10GB for the Immich machine learning container to store ML models and cache

- Triple the space of your Google Photos library available on your Unraid server for the migration process.
  Example: 100GB of Google Takeout Photos * 3 = 300GB
  -> 100GB for the compressed files, 100GB for the extracted files, 100GB for the final library after migration.

> [!TIP]
> Not required but a sanity check - If you want to opt-out of Google Photos (=destroy your Google Photos library) and start with Immich, make sure to have healthy disks. It *might* be a good idea
> 1. to have an offsite backup and
> 2. run a SMART test on your disks and check the health status
>
> before you start uploading your photos to Immich to avoid any potential data loss due to disk failure during the upload process.
