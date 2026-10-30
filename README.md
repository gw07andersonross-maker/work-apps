# HGS Cover Planner

A cover planner that runs straight from the shared OneDrive folder that holds the timetables. It needs no internet connection and no server, and no staff data is built in. It reads the master and department timetables from the folder and saves plans to a data file there.

## Setting it up (once per computer)

1. Put `HGS_Cover_Planner.html` in the shared OneDrive timetables folder, or anywhere you like.
2. Make sure the shared folder syncs to the computer. If it was shared with you, open it on the OneDrive website and choose **Add shortcut to My files**. In File Explorer, right-click the folder and choose **Always keep on this device**.
3. Open the planner from File Explorer in **Microsoft Edge or Google Chrome**. Opening it from the OneDrive website won't work.
4. Click **Link the timetables folder**, pick the shared folder, and allow the planner to view and save files there.

That's it. The planner:

- uses the spreadsheet with "master" in its name as the master. You can choose a different one on the Timetables tab.
- checks every other spreadsheet in the folder as a department timetable.
- picks up changes within about 30 seconds of a spreadsheet being saved in Excel.
- saves absences and cover to `HGS Cover Planner data.json` in the same folder, so everyone who links the folder sees the same plans.

When you reopen the planner, the browser may ask for permission again. Choose **Allow on every visit** if it's offered, or click **Reconnect**.

## Good to know

- It works on Windows or Mac computers, not phones or tablets.
- Changes to a spreadsheet appear once they are saved and OneDrive has synced them.
- OneDrive can occasionally make a conflict copy of the data file, such as `HGS Cover Planner data-PCNAME.json`. If that happens, keep the main file and delete the copy.
- To update the planner, replace `HGS_Cover_Planner.html` with the new version. The data file and timetables stay as they are.
