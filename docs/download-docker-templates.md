# Step 4: Download Docker Templates

Quicklink to the Unraid terminal:

```
http://<your-unraid-ip>/webterminal/ttyd/
```

Open the Unraid web interface and open the terminal (click the ![Terminal](assets/images/Unraid%20-%20Top%20Menu%20-%20Button%20Start%20Webterminal.png){: .inline-button } icon in the top right corner of the navigation bar). Then download the templates you need.

> [!NOTE]
> `wget` downloads files from the web. The `-P` flag sets the download directory. Templates are saved to Unraid's Docker Manager template directory.

## PostgreSQL
Choose between stability and latest features:

| Option | Image | VectorChord | pgvector | Status |
|--------|-------|-------------|----------|--------|
| **Stable** | `ghcr.io/immich-app/postgres:18-vectorchord0.5.3-pgvector0.8.1` | 0.5.3 | 0.8.1 | Tested by Immich team |
| Experimental | `tensorchord/vchord-postgres:pg18-v1.1.1` | 1.1.1 | 0.8.2 | Latest, less tested |

> [!NOTE]
> You COULD use VectorChord 1.0.0+ (See [#23845](https://github.com/immich-app/immich/pull/23845)) or 1.1.1 (See [this discussion](https://github.com/immich-app/immich/discussions/23830#discussioncomment-15956803)). The 0.5.3 version is more stable and tested extensively with Immich. If you want to try the latest, use the experimental template.

### **PostgreSQL database by Immich** — RECOMMENDED (stable, tested by Immich team):
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-postgres-official.xml
```

### **PostgreSQL database by VectorChord** — EXPERIMENTAL (latest VectorChord 1.1.1, less tested with Immich):
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-vectorchord-db.xml
```

## **Valkey** (cache/message broker):
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-valkey.xml
```

## Machine Learning template (choose one based on your GPU):

### **CPU only** — no GPU acceleration:
*CPU inference is possible but will be much slower for tasks like face recognition and CLIP-based search. Only recommended if you have a powerful CPU and a small library. Will work but expect slower performance and high load on the CPU.*
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-machine-learning.xml
```

### **NVIDIA CUDA:**
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-machine-learning-cuda.xml
```

### **Intel OpenVINO:**
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-machine-learning-openvino.xml
```

### **AMD ROCm:**
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-machine-learning-rocm.xml
```

## Server template (choose one based on your GPU):
*These templates are for video transcoding. If you don't have a GPU or don't want to use it for transcoding, choose the CPU-only template.*

### **CPU only** — no GPU transcoding:
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-server.xml
```

### **Intel QSV / AMD VAAPI** — uses `/dev/dri`:
*You can also use your Intel iGPU ("inbuilt graphics card" in your CPU) for transcoding with Quick Sync Video (QSV) or your AMD GPU with VAAPI. Both use the same template since they both leverage `/dev/dri` for hardware acceleration.*
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-server-qsv-vaapi.xml
```

### **NVIDIA NVENC** — uses `--runtime=nvidia`:
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-server-nvenc.xml
```

## **PhotoMigrator** (for Google Takeout migration):
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/photomigrator.xml
```
