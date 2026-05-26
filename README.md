[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Immich](https://img.shields.io/badge/Immich-v2.7.5-4250e4)](https://immich.app)
[![Unraid](https://img.shields.io/badge/Unraid-6.12+-e22d2d)](https://unraid.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)](https://www.postgresql.org)
[![VectorChord](https://img.shields.io/badge/VectorChord-0.5.3%20%7C%201.1.1-E6DB3D)](https://github.com/tensorchord/VectorChord)
[![Valkey](https://img.shields.io/badge/Valkey-9.1-d63f84)](https://valkey.io)

# Immich on Unraid — Performance Setup Guide

A step-by-step guide for an optimal setup of [Immich](https://immich.app) on [Unraid](https://unraid.net), including Google Takeout migration with [PhotoMigrator](https://github.com/jaimetur/PhotoMigrator).

**[Read the full documentation](https://rorar.github.io/immich-unraid-manual/)**

## What's covered

- **Performance-optimized storage layout** — SSD/NVMe cache for thumbnails and encoded video, HDD array for originals
- **Custom Docker network** — container-name resolution, no port exposure for internal services
- **GPU-accelerated transcoding & ML** — NVIDIA NVENC, Intel QSV, AMD VAAPI templates
- **Google Takeout migration** — export, download via Firefox container, extract, import with PhotoMigrator
- **Immich admin configuration** — image settings, hardware acceleration, mobile app setup

## Quick links

| Section | Description |
|---------|-------------|
| [Hardware & Prerequisites](https://rorar.github.io/immich-unraid-manual/hardware-and-prerequisites/) | Minimum specs, pre-requisites checklist |
| [Installation (Steps 1-10)](https://rorar.github.io/immich-unraid-manual/unraid-create-immich-shares/) | Shares, network, containers, configuration |
| [Google Takeout Migration](https://rorar.github.io/immich-unraid-manual/google-takeout-request-export/) | Export, download, extract, import |
| [FAQ](https://rorar.github.io/immich-unraid-manual/faq/) | Common questions answered |

## Contributing

Found an issue or want to improve the guide? [Open an issue](https://github.com/rorar/immich-unraid-manual/issues) or submit a pull request.

## Credits

This guide builds on the work of [@starbuck93](https://blog.starbuckstech.com/articles/how-to-install-and-optimize-immich-on-unraid-for-faster-timeline-loading/), the [Immich team](https://immich.app), and the [PhotoMigrator team](https://github.com/jaimetur/PhotoMigrator).

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
