# SheetsApi.js
## Description
The SheetsApi.js file is a layer between the UPLS system and its backend data storage. This file can be swapped out to accomodate other backends, as long as the replacement file has all the exact same function signatures for all functions called from outside this file. Since we have been requested to use Google Sheets as our database, this file encapsulates the functions initializing the google client, calling the google sheets api, and some helper methods for parsing the response of api calls.

## Setup
In order to use it successfully, the google api.js file should be imported before the SheetsApi.js and your own js file should be imported after that. Here is an example.
```
<script src="https://apis.google.com/js/api.js"></script>
<script src="SheetsApi.js"></script>
<script src="test.js"></script>
```
When using the SheetsApi to login, the login user should have the permission to read the target spreadsheet.

### Constructor for SheetsApi Object
SheetsApi (spreadSheetId, ApiKey, ClientId)
SpreadSheetId is the target spreadsheet id. This can be found in the url of the spreadsheet. The following shows the structure of the URL and where spreadSheetId can be found:

```
https://docs.google.com/spreadsheets/d/spreadsheetId/edit#gid=sheetId
```

The ApiKey and ClientId should be configured in the developer console of google. Instructions can be found on the following websites. The OAuth 2.0 client ID should be set for Web application when creating.
1. If not already done, enable the Google Sheets API and check the quota for your project at        https://console.developers.google.com/apis/api/sheets
2. Get access keys for your application. See https://developers.google.com/api-client-library/javascript/start/start-js#get-access-keys-for-your-application
3. For additional information on authentication, see https://developers.google.com/sheets/api/quickstart/js#step_2_set_up_the_sample
After successfully created the OAuth 2.0 client ID, please get into the client ID by clicking its name and add the http://localhost:your-port-here (ex: http://localhost:8000) into the authorized JavaScript origins.

## Functions
|Function name                 |Return type|Parameters                                      |Description   | 
|------------------------------|-----------|------------------------------------------------|--------------|
|handleClientLoad()	           |void       |N/A	                                            |This is the function to load the gapi. Should be called after created the SheetsApi instance.|
|handleSignInClick(event)	     |void	     |event (can be ignored)	                        |This is the function to handle the user’s sign in operation.|
|handleSignOutClick(event)	   |void	     |event (can be ignored)	                        |This is the function to handle the user’s sign out operation.|
|getSpreadsheetInfo()	         |Promise	   |N/A	                                            |This *private helper function* will return a promise for getting the information of the spreadsheet.|
|parseSpreadsheetInfo(response)|Object	   |response from getSpreadsheetInfo() 	            |This function will return an object containing the title of the spreadsheet and the sheets information in the spreadsheet.|
|getSheet(inputRange)	         |Promise	   |inputRange: string value specifying the required range of the sheet.|This *private helper function* returns a promise for getting the target sheet.|
|parseSheetValues(response)	   |String[][] |response from getSheet(inputRange)	            |This function parses the response from getSheet(inputRange) and returns a 2D array of values.|
|selectFromTableWhereConditions(response, returnCold, condtions, returnType)|String[][] or object[]|response: the response from getSheet.\nreturnCols: an array of the names of columns need to return, passing "*" will return all columns.\nconditions: an arrya of conditions. Each condition is an object with format: {header:"the name of a header", values:"the values to check for"}.\nreturnType: int 0 for an array of objects, 1 for a 2D array|This function takes the response from the getSheet and return the wanted type of values|
|filterByKeyword(values, keyword, columnIndex)|String[][]|values is the input 2D array. keyword is filter keyword. columnIndex is the specific index of column to be filtered if less than 0, then any column including the keyword will add the row to the result.|This function returns the 2D array after filtering the input array by the keyword.|
|batchAdd(inputRange, inputValues)|Promise	 |inputRange for this function, normally only the sheet name. inputValues is a 2D array of the values to be added.|This *private helper function* returns a promise for batch adding the values to a sheet.|
|parseBatchAdd(response)	    |int	       |response is the response from batchAdd(inputRange, inputValues)|This function parses the response from batchAdd(inputRange, inputValues) and returns the number of rows updated.|
|parseErrorMessage(reason)	  |String	     |reason is the error response from a promise.  	|This *private helper function* parses the error response and logs the error message to the console.error and returns the error message.|

The Promise can be used as following:
```
let sa = new SheetsApi("example", "example", "example");
sa.handleClientLoad();

function loadData() {
    sa.getSheet("student_info").then(response => {
        let result = sa.parseSheetValues(response);
        //codes of whatever you want to do with the result of response
    }, reason => {
        let message = sa.parseErrorMessage(reason);
        //codes of whatever you want to do with the error message
    });
}
```
The inputRange is in A1 notation. Valid ranges are:
•	Sheet1!A1:B2 refers to the first two cells in the top two rows of Sheet1.
•	Sheet1!A:A refers to all the cells in the first column of Sheet1.
•	Sheet1!1:2 refers to the all the cells in the first two rows of Sheet1.
•	Sheet1!A5:A refers to all the cells of the first column of Sheet 1, from row 5 onward.
•	A1:B2 refers to the first two cells in the top two rows of the first visible sheet.
•	Sheet1 refers to all the cells in Sheet1.
If the sheet name has spaces or starts with a bracket, surround the sheet name with single quotes ('), e.g. 'Sheet One'!A1:B2. For simplicity, it is safe to always surround the sheet name with single quotes.
