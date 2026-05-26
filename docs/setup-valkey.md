# Step 6: Valkey Setup

Valkey is a Redis-compatible cache used by Immich as a message broker.

Quicklink to add a new Docker container (paste into your browser while logged into Unraid):

```
http://<your-unraid-ip>/Docker/AddContainer
```

1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the `immich-valkey` template
3. Configure:
    - **Network:** `immich_internal`
    - All other defaults are fine
4. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.

That's it — Valkey needs no special configuration for Immich.

> [!NOTE]
> You don't need to set a port. See [FAQ](faq.md#q-do-i-need-to-set-ports-while-using-immich_internal).
