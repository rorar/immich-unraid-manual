# Step 2: Create Docker Network

All Immich containers need to communicate with each other by container name. We create a dedicated Docker network for this.

Quicklink to the Unraid terminal:

```
http://<your-unraid-ip>/Terminal
```

1. Open the Unraid web interface `http://<your-unraid-ip>`
2. Open the Unraid terminal (click the ![Terminal](assets/images/Unraid%20-%20Top%20Menu%20-%20Button%20Start%20Webterminal.png){: .inline-button } icon in the top right corner of the navigation bar)
3. Run the following command to create the network:
```bash
docker network create immich_internal
```
4. When setting up each container below, select `immich_internal` as the network in the template settings.

**Why a custom network?** Containers on the default `bridge` network communicate via host port mappings (NAT overhead). On a custom network, containers resolve each other by name directly — faster and more secure since database/cache ports don't need to be exposed to the host.
