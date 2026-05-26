# Frequently Asked Questions

## Q: Why not use the imagegenius docker image?
**A:** The [imagegenius docker image](https://hub.docker.com/r/imagegenius/immich) is a pre-built container that includes Immich and its dependencies. For example machine learning for AMD GPUs aren't supported in the imagegenius image. Using the approach covered in this guide, you'll also get updates faster using official Immich docker images.
Also: This guide provides a more tailored approach to setting up Immich on Unraid.

## Q: Can I use this guide to upgrade an existing Immich setup on Unraid?
**A:** This guide is intended for new setups of Immich on Unraid. Upgrading an existing setup requires significant changes and data migration. If you have an existing Immich setup, I recommend backing up your data, setting up a new instance of Immich following this guide, and then migrating your data from the old instance to the new one. Consult the Immich documentation and community for best practices on how to do this migration to ensure that you don't lose any data in the process.

## Q: What if I have a different GPU or want to use a different transcoding method?
**A:** The templates provided in this guide cover the most common GPU options (NVIDIA NVENC, Intel QSV, AMD VAAPI) as well as a CPU-only option. If you have a different GPU or want to use a different transcoding method, you can still use the CPU-only template for the server, but keep in mind that transcoding performance will be slower. Alternatively, you can try modifying one of the existing templates to work with your specific GPU or transcoding method, but this may require advanced knowledge of Docker and the specific requirements of your GPU.

## Q: Why have you chosen PATH living on the array inside `immich` share instead of cache for Firefox Downloads and processing?
**A:** *TL;DR:* This approach ensures that you have enough space for the entire Google Takeout export without running into issues with limited cache space.

The `immich` share on the array is used for storing the downloaded Google Takeout files because these files can be quite large and may exceed the capacity of the cache drive, especially if you have a large photo library. The array normally provides more storage space for these temporary files during the download and extraction process. Once the photos are imported into Immich, they will be processed and stored in the appropriate locations (e.g., thumbnails and generated files in `immich-gen` on cache, original photos in `immich` on array).

*However*, if you have a large cache drive and prefer to use it for the download and processing of the Google Takeout files, you can modify the path mapping for the Firefox container to point to a directory on the cache instead.

## Q: Can I use Docker Compose instead of individual containers?
**A:** While Docker Compose is a popular tool for managing multi-container applications, it is not natively supported in Unraid's Docker management system. This guide is designed to work with Unraid's native Docker management for better integration and ease of use. However, if you prefer using Docker Compose, you can set it up manually by creating a `docker-compose.yml` file (for example using @starbuck93 [Gist](https://gist.github.com/starbuck93/5ce522b007f67267869afbf13d071f40)) with the appropriate configuration for the Immich stack and running it in a terminal/using the Docker Compose Plugin on Unraid. Just keep in mind that this approach may require more manual management and troubleshooting compared to using Unraid's native Docker management.

## Q: Do I need to use the custom Docker network `immich_internal`?
**A:** It is best practice to use a custom Docker network for Immich to allow containers to communicate with each other by name and to avoid the overhead of the default `bridge` network. However, if you have a specific reason for not using a custom network, you can configure the containers to use the `bridge` network and set up host port mappings for communication. Just keep in mind that this may lead to slightly reduced performance and requires exposing database/cache ports to the host, which can be a security risk.

## Q: Do I need to set ports while using `immich_internal`?
**A:** No.
On a custom Docker network, containers communicate directly by container name and internal port. The database (5432), Valkey (6379), and machine learning (3003) containers do not need exposed ports - they are only accessed by the Immich server internally. Not exposing these ports is actually more secure since it prevents external access to your database and cache.
Only the Immich server needs a port mapping (2283) so you can access the web UI from your browser.
