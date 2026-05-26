# Step 5: PostgreSQL Setup

1. Go to the ![Docker](assets/images/Unraid%20-%20Tab%20Docker.png){: .inline-button } tab → ![Add Container](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add%20Container.png){: .inline-button }
2. Select the template you downloaded (`immich-postgres-official` or `immich-vectorchord-db`)
3. Configure:
    - **Network:** `immich_internal`
    - **POSTGRES_PASSWORD:** Set a strong password! Generate one in the terminal:

        ```bash
        openssl rand -base64 32 | tr -dc A-Za-z0-9 | head -c 32
        ```

    - **POSTGRES_USER:** `postgres`
    - **POSTGRES_DB:** `immich`
4. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the container.

> [!WARNING]
> Remember/copy your `POSTGRES_PASSWORD` — you'll need the exact same value in the `immich-server` configuration.

> [!NOTE]
> - If upgrading from VectorChord 0.4.3 to 1.0.0+: See [this comment](https://github.com/immich-app/immich/pull/23845#issuecomment-3566969928).
> - You don't need to set a port. See [FAQ](faq.md#q-do-i-need-to-set-ports-while-using-immich_internal).
