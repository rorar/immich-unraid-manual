# Step 7: Machine Learning Setup

The ML service handles face recognition, CLIP-based image search, and OCR. Models are downloaded on first use and cached (several GB).

1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the `immich-machine-learning` template matching your GPU (see [Step 3](choose-gpu-platform.md))
3. Configure:
    - **Network:** `immich_internal`
    - **Path: Model Cache:** `/mnt/user/appdata/immich/model-cache/` (default is fine as long as it points to a path with an SSD/NVMe for better performance)
4. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.

> [!NOTE]
> - The first startup will be slow as ML models are downloaded. This is normal.
> - You don't need to set a port. See [FAQ](faq.md#q-do-i-need-to-set-ports-while-using-immich_internal).
