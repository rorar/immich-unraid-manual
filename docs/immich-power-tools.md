# Immich Power Tools
[Immich Power Tools](https://github.com/immich-power-tools/immich-power-tools) is an unofficial client for advanced library management. It connects to both the Immich API and directly to the PostgreSQL database for operations that aren't available in the standard Immich UI.

**Features:**
- Bulk people/face management with smart merge
- Location enrichment for assets missing geolocation
- Album discovery (suggests albums from your library)
- Library analytics (EXIF data, temporal distribution)
- Natural language search (optional, requires AI provider)
- Bulk date adjustment for fixing timestamps

**Setup:**

Download the template:
```bash
wget -P /boot/config/plugins/dockerMan/templates-user/ https://raw.githubusercontent.com/rorar/unraid-templates/main/templates/immich-power-tools.xml
```

1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the `immich-power-tools` template
3. Configure:
   - **Network:** `immich_internal` (pre-configured)
   - **IMMICH_URL:** `http://immich-server:2283` (pre-configured)
   - **IMMICH_API_KEY:** Paste your Immich API key (with ALL permissions)
   - **DB_HOST:** `immich-vectorchord-db` (pre-configured, must match your DB container name)
   - **DB_PASSWORD:** The same password you set for PostgreSQL in [Step 5](setup-postgresql.md)
4. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.
5. Access Power Tools at `http://<your-unraid-ip>:3000`

**Optional:** For natural language search, configure AI provider settings under Advanced (supports OpenAI, Ollama, and other OpenAI-compatible APIs).

**Note:** Add this container to your `Immich` folder in FolderView3 after the `immich-server` container.
