# HGS Cover Planner

A cover planner that runs straight from a shared OneDrive folder. It needs no internet connection and no server. Everything it saves stays in that folder.

## Setting it up (once)

1. Put `HGS_Cover_Planner.html` in a OneDrive folder and share the folder with your colleagues.
2. Each colleague opens the shared folder in OneDrive on the web and chooses **Add shortcut to My files**, so the folder syncs to their computer.
3. Open the planner from the synced folder in File Explorer, using **Microsoft Edge or Google Chrome**. Opening it from the OneDrive website won't work.
4. The first person goes to **Timetables → Shared data file → Create a data file** and saves `HGS Cover Planner data.json` in the same folder.
5. Everyone else goes to **Timetables → Shared data file → Open an existing data file** and picks that file.

After that, absences, cover, settings and uploaded timetables are shared. A colleague's changes appear within about 10 seconds. The browser may ask for permission to use the file again when you reopen the planner: choose **Allow on every visit** if it's offered.

## Good to know

- It works on Windows or Mac computers, not phones or tablets.
- If two people save within a few seconds of each other, the planner merges their changes. OneDrive can still occasionally make a conflict copy such as `HGS Cover Planner data-PCNAME.json`. If that happens, keep the main file and delete the copy.
- To update the planner, replace `HGS_Cover_Planner.html` in the folder with the new version. The data file stays as it is.
