[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Immich](https://img.shields.io/badge/Immich-v2.7.5-4250e4)](https://immich.app)
[![Unraid](https://img.shields.io/badge/Unraid-6.12+-e22d2d)](https://unraid.net)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-336791)](https://www.postgresql.org)
[![VectorChord](https://img.shields.io/badge/VectorChord-0.5.3%20%7C%201.1.1-E6DB3D)](https://github.com/tensorchord/VectorChord)
[![Valkey](https://img.shields.io/badge/Valkey-9.1-d63f84)](https://valkey.io)

# Unraid Immich "Performance" Setup + Google Takeout Guide

## TL;DR:
### Immich Setup
We use a share living on the Cache (SSD/NVMe) for `encoded-video`, `profile` and `thumbs` - and a HDD share living on the Array for `backups`, `library` and `upload`. This setup allows us to leverage the speed of the Cache for frequently accessed data while utilizing the Array for long-term storage of original media files.
Plus we use a custom network for better performance and security, avoiding an overhead of the default `bridge` network.

### Google Takeout Guide
Also for the migration from Google Photos to Immich, we use Google Takeout to export our photos and videos, and then utilize a Firefox Docker container on Unraid to download the exported files directly to our Unraid server, avoiding the need to download them to a local machine first.
We'll be using PhotoMigrator to automate the process of importing photos from our Google Takeout export into Immich. PhotoMigrator takes care of handling metadata and organizing the photos in the correct structure for Immich.

## Note
If you're unsure about using Immich, you can try it out for free on [PixelUnion](https://pixelunion.eu) (non-sponsored).

Just a friendly recommendation to test Immich without setting it up yourself first. You can create a free account with 16GB included storage and upload a few photos to see how the interface works and if it meets your needs before going through the setup process on Unraid.

---

## Intended Use

> [!IMPORTANT]
> READ THROUGH BEFORE STARTING YOUR SETUP.

### In Scope:
This guide is intended for NEW setups of Immich on Unraid.

### Out of Scope:
Upgrading existing Immich setups as it *requires significant changes* to the existing setup and *data migration*.
If you have an existing Immich setup on Unraid and want to optimize it for better performance, I would recommend **backing up your data**, setting up a new instance of Immich following this guide and then migrating your data from the old instance to the new one.

*If you REALLY want to upgrade: Consult the Immich documentation and community for best practices on how to do this migration to ensure that you don't lose any data in the process. Happy learning!*

## What's inside this guide?

This guide covers an optimal Unraid-native setup of Immich (no Docker Compose) with performance optimization and optional Google Takeout migration.

> [!IMPORTANT]
> This guide is intended for users who want to run a *NEW instance of Immich* on Unraid and are looking for best practices to achieve optimal performance.

---

## Guide Overview

### Getting Started

| | Topic | Description |
|---|---|---|
| | [Hardware & Prerequisites](hardware-and-prerequisites.md) | Minimum specs, pre-requisites checklist, storage planning |
| | [Phase 1: Request Google Takeout Export](google-takeout-request-export.md) | Start your Google Photos export early (takes hours) |

### Installation

| | Step | Description |
|---|---|---|
| 1 | [Create Unraid Shares](unraid-create-immich-shares.md) | `immich` (HDD array) + `immich-gen` (SSD cache) shares |
| | [Phase 2: Download Takeout via Firefox](google-takeout-download-with-firefox.md) | Download exports directly to Unraid via Firefox container |
| 2 | [Create Docker Network](create-docker-network.md) | `immich_internal` network for container communication |
| 3 | [Choose GPU Platform](choose-gpu-platform.md) | Select templates for your GPU (NVIDIA/Intel/AMD/CPU) |
| 4 | [Download Docker Templates](download-docker-templates.md) | Download all Unraid container templates |
| 5 | [PostgreSQL Setup](setup-postgresql.md) | Database with VectorChord for vector search |
| 6 | [Valkey Setup](setup-valkey.md) | Redis-compatible cache/message broker |
| 7 | [Machine Learning Setup](setup-machine-learning.md) | Face recognition, CLIP search, OCR |
| 8 | [Immich Server Setup](setup-immich-server.md) | Main application — web UI, API, workers |
| 9 | [Container Start Order](container-start-order-folderview3.md) | FolderView3 for correct startup sequence |
| 10 | [Setup, Verify & Configure](immich-setup-verify-and-configure.md) | Admin settings, image/video config, mobile apps, GPU verification |

### Google Takeout Migration

| | Topic | Description |
|---|---|---|
| | [Phase 2.5: Extract tar Archives](google-takeout-extract-tar-archives.md) | Only if you chose `tar` format |
| | [Phase 3: Import with PhotoMigrator](google-takeout-import-with-photomigrator.md) | Automated import with metadata handling |

### After Setup

| | Topic | Description |
|---|---|---|
| | [Immich Power Tools](immich-power-tools.md) | Advanced library management (bulk ops, analytics) |
| | [Cleanup After Migration](cleanup-after-migration.md) | Remove temporary files, API keys, Firefox container |
| | [FAQ](faq.md) | Common questions answered |
