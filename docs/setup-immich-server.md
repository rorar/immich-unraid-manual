# Step 8: Immich Server Setup

The main application — web UI, API, and background workers.

1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the `immich-server` template matching your GPU (see [Step 3](choose-gpu-platform.md))
3. Configure:
    - **Network:** `immich_internal`
    - **DB_HOSTNAME:** `immich-vectorchord-db` (must match the database container name)
    - **DB_PASSWORD:** The exact same password you set in [Step 5](setup-postgresql.md)
    - **REDIS_HOSTNAME:** `immich-valkey` (must match the Valkey container name)
    - All HDD/SSD storage paths should already point to the correct shares (`/mnt/user/immich/` and `/mnt/user/immich-gen/`)
4. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.

Access Immich at `http://<your-unraid-ip>:2283` and create your admin account.
