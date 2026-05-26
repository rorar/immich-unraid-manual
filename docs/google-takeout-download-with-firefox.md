# Google Takeout Phase 2 — Download via Firefox

Once you receive the email from Google Takeout with the download link, you can use a Firefox Docker container on Unraid to download the exported files directly to your Unraid server.

**Purpose:** This method is especially useful if you have a large library, slower download speed and to avoid downloading the files to your local machine first and moving it to Unraid.

Quicklink to search for Firefox in Community Applications:

```
http://<your-unraid-ip>/Apps?search=firefox+linuxserver
```

1. Go to the "Apps" tab in your Unraid web interface
2. Search for "Firefox" in the Community Applications.
3. Choose the Firefox container by LinuxServer.io and click "Install".
4. If you already have a Firefox container setup, choose to name the new container something like "firefox-takeout-export" to differentiate it from any other Firefox containers you may have.
5. During the installation process, scroll down and click on ![Add another Path, Port, Variable, Label or Device](assets/images/Unraid%20-%20Template%20general%20-%20Add%20another%20Path%20Port%20Variable%20Label%20or%20Device.png){: .inline-button }
6. To map the Download Path to the `immich` share, set the "Config Type" to `Path` (It's automatically pre-set)
   1. Name: `takeout-export`
   2. Container Path: `/config/Downloads`
   3. Host Path: `/mnt/user/immich/Takeout`
   4. Access Mode: `Read/Write`
   5. → Hit ![Save](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Save.png){: .inline-button } to add the path mapping
7. Hit ![Apply](assets/images/Unraid%20-%20Template%20general%20-%20Button%20Apply.png){: .inline-button } to start the installation of the Firefox container with the new path mapping.

![Firefox Template - Edit Configuration](assets/images/Unraid%20-%20Template%20Firefox%20-%20Edit%20Config%20-%20Add%20Path.png)

8.  Open the Firefox container's web UI
9.  You may be prompted with an SSL warning since the container is using a self-signed certificate. You can safely bypass this warning by clicking on "Advanced" and then "Accept the Risk and Continue" to proceed to the Firefox web UI.
10. Go to [https://mail.google.com/](https://mail.google.com/)
11. Sign in to the Google account associated with your Google Takeout export.
12. When prompted for giving Google/Alphabet your data, click "Deny All" (or similar)
13. Open the email from Google Takeout
14. Click on the download link(s) for your export.
15. Your export files will start downloading directly to the `immich` share on your Unraid server in the `Takeout` folder that we mapped to the Firefox container.

> [!NOTE]
> - The download speed may vary based on your internet connection and the size of your export. Be patient, especially if you have a large library. Grab a coffee or two while you wait! :coffee:
> - Sometimes the download speed may be slower than expected as you may have caught an overloaded Google Server. If you notice that the download is very slow, you can try pausing/aborting and resuming the download in the Firefox web UI to potentially improve the speed.
