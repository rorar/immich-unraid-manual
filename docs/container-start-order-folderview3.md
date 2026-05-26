# Step 9: Container Start Order with FolderView3

Immich containers must start in the correct order. If the server starts before the database is ready, it will fail.

To manage this on Unraid, install **FolderView3** from Community Applications:
1. Go to **Apps** → search for **FolderView3** → Install
2. Go to the **Docker** tab
3. Scroll down and click ![Add Folder](assets/images/Unraid%20-%20Docker%20Tab%20-%20Button%20Add-Folder%20%28FolderView3%29.png){: .inline-button }
4. **Name:** `Immich`
5. **Icon (use the following URL):**
```
https://raw.githubusercontent.com/immich-app/immich/refs/heads/main/mobile/packages/ui/showcase/web/icons/apple-icon-180.png )
```
6. **Folder WebUI:** On
7. **WebUI URL:** `http://<your-unraid-ip>:2283` (this will be the URL of the Immich server container)
8. Edit `Preview` section to your liking (optional)
9. Drag all four Immich containers into in the **Correct start order and set the toogles next to them to "ON"**
  1. `immich-vectorchord-db` (PostgreSQL)
  2. `immich-valkey` (Valkey)
  3. `immich-machine-learning` (ML)
  4. `immich-server` (Server — depends on all above)
10. Click ![Submit](assets/images/Unraid%20-%20FolderView%203%20-%20Button%20Submit.png){: .inline-button } to save the folder configuration
11. Back in **Docker** tab, click on the Immich folder and if the Containers weren't running before, click ![Start](assets/images/Unraid%20-%20Docker%20Tab%20-%20Dropdown-Menu%20Dropdown-Context%20-%20Button%20Start.png){: .inline-button }
12. Optionally set Autostart to "ON" for the folder.

FolderView3 will now start Immich and its dependent containers in sequence when you click on the folder and hit "Start".
