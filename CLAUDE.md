# Work apps

## HGS Cover Planner (`HGS_Cover_Planner.html`)

A single-file page that runs offline (fonts and SheetJS are built in). Staff use it from a shared OneDrive folder, opened in Edge or Chrome. It is also published as the claude.ai artifact https://claude.ai/artifact/5eSjF1qadpewHqwudGmHVQ (pinned in the owner's sidebar) for previewing changes only, with no capabilities. After any change to the HTML, commit, push, and republish to that same URL. Then remind the owner to copy the new file into the OneDrive folder.

- **Timetables folder:** the page links the shared OneDrive timetables folder (`showDirectoryPicker`, handle kept in IndexedDB). It reads the master (the chosen spreadsheet, else the newest with "master" in its name) and treats every other spreadsheet as a department timetable, re-reading changed files every 30 s and on focus. Nothing parsed is stored. Linking the folder also creates/uses `HGS Cover Planner data.json` inside it.
- **Saved data:** a shared JSON data file chosen in the page (File System Access API), stored next to the planner in OneDrive. Every save re-reads the file and does a three-way merge per entry (absence, cover allocation, setting, uploaded timetable) against the last-synced hashes kept in localStorage. It also polls every 10 s. With no data file, it falls back to the browser's localStorage.
- **Locked periods:** `S.settings.locks['pid|slot'] = {cls, note, since, until}`: no cover needed for that weekly slot until unlocked. The lock pauses if the master puts a different class there. Shared through the data file like other settings.
- **No staff data in the repo:** the page ships with `const BUILTIN = null;`. The master is read from the linked folder (or uploaded in the page). Keep staff names out of the HTML, the repo and the artifact.
- **Built-in timetables (not used):** `cd tools && npm install && node build-timetables.js` builds `timetables/*.xlsx` into the `const BUILTIN = …` (master) and `const BUILTIN_DEPTS = …` (department) lines, using the page's own parser. Normally timetables are uploaded in the page and shared through the data file instead.
