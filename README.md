# Intro
The University Personal Librarian System (UPLS) is a CRM (Customer Relationship Management) like piece of software built for the University of Prince Edward Island. Robertson Library librarians will use this software to record student interactions as well as submit and update student information as needed. See the [UPLS Wiki](/upeipls/UPLS/wiki) for more information.

---
# Dependencies
## Python 3
Windows: https://www.python.org/downloads/windows

Linux: https://www.python.org/downloads/source/

Mac: https://www.python.org/downloads/mac-osx/

## The latest version of Chrome/Edge/Safari (For HTML5 support)
Chrome: https://www.google.com/chrome/

Microsoft Edge: https://www.microsoft.com/en-ca/windows/microsoft-edge

Mac Safari: https://support.apple.com/downloads/safari

## Git (optional)
Windows: https://git-scm.com/download/win

---
# Installation
## `Python`(Windows):
1.  Visit above page for your operating system
2.  Click the top link for the latest release
3.  Scroll down page until you see "Windows x86-64 executable installer"
4.  Save file and install to local drive
---
## `Python`(Linux)
1.  Clone the repository (instructions further down) to a local drive
2.  Navigate to the Python(Linux) folder
3.  In the command line type "make" and press enter
4.  In command line type sudo make install and press enter
5.  Once complete, close command line

## `Python`(Mac)
1.  Navigate to Python(Mac) link
2.  Under "Python 3.7.2" select the correct installer for your MacOS version
3.  Download and install to a local drive

## `Chrome`:
1.  Visit the above page
2.  Click the Download button and Accept and Install
3.  Save to your local drive and open the downloaded file

## `Microsoft Edge`: (Most likely you will not need to install this)
1.  Visit the above page
2.  Download and install to the local drive

## `Mac Safari`:
1.  Scroll down to "Safari: get latest version" and click download
2.  Download and install to a local drive

## `UPLS`:

#### `Via GitHub`:
1.  Navigate with your favourite(default) browser to https://github.com/upeipls/UPLS
2.  Click the green "Clone or Download" button on the right side of the page
3.  Click download zip
4.  Unzip file to a local drive

#### `Via Command Line`:
1.  Open your command line prompt and navigate to the folder you wish to install to
2.  Type "git clone https://github.com/upeipls/UPLS"
3.  Once complete, close the command line

# Usage
## To Start
When all installation steps are complete, you must start a local server in the UPLS directory that was created in the UPLS installation.
1. Open the command prompt (or terminal) and go to your local UPLS directory: `cd your/path/to/UPLS/`
2. Start the a local server with python3: `python3 -m http.server` This command's default port is 8000. Later, when you wish to exit the program and stop the server, you can either close the window in which you entered this command, or press control+C in the window to send an interupt to stop the process.
3. Now you can access the webpages in the UPLS directory by opening your web browser and going to http://localhost:8000/
### Notes: 
1. When starting the script for the first time, you may receive a dialog window asking for allowance to run the script. You may select yes here, you may or may not need to select yes each time you run the script.
2. It may also be useful to add the script to your desktop as a shortcut. To do this, follow the documentation below for your operating system.
***Windows:*** https://windowstechies.com/the-complete-guide-for-creating-shortcuts-in-windows-10/  

***Mac:*** https://www.laptopmag.com/articles/macos-desktop-shortcuts

# Troubleshooting
Please ensure the following when using the Personal Librarian Project:
1. Be signed into any Gmail account.
2. Ensure that the GMAIL account has an API key for the Google sheets enabled.
3. Make sure that the input sheet ID used in the sheets.api file is the sheet ID that contains the database of student information.
4. As the program relies on making Google API calls via an internet connection, it is advised that this be used on a stable high speed connection.
5. Enable Javacript console to see any error messages related to the Google API calls. (Ex: No Google login information logs an error message in the console asking for user to log into a Google Account.)

## Errors
You may receive errors while using this software, to view any errors that may occur you may check the console of your browser. To open the console use the following shortcut for your browser.
### Firefox
***Windows:*** `Ctrl + Shit + k`

***Mac:*** `Cmd + Opt + k`

### Chrome
***Windows:*** `Ctrl + Shift + j`

***Mac:*** `Ctrl + Opt + j`

### Internet Explorer
***Windows:*** `Ctrl + Shift + k`

***Mac:*** `Ctrl + Opt + k`

### Types
***GAPI:*** 
Receiving this error (in the console) indicates there is an issue with the Google API
1. Make sure you are logged in to the correct account
2. Make sure your credentials are valid in the SheetsAPI.js file

***Python:***
An error may occur when running the python server script (or typing the command manually) stating the port is already in use.
1. You may avoid this issue by typing a number after the command in your operating system command prompt: `python3 -m http.server 8001`
2. If no number is used, the default port is 8000
# Maintenance


