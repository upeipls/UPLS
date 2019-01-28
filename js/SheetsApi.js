function SheetsApi(inputSheetId, inputApiKey, inputClientId) {
    
    let sheetId = inputSheetId;
    let API_KEY = inputApiKey;
    let CLIENT_ID = inputClientId;
    
    /**
     * Below 5 functions are used for client initialization of the google sheet api
     * Need to configure the sheetId, API_KEY, and CLIENT_ID when creating the SheetsApi
     * object.
     */
    function updateSignInStatus(isSignedIn) {
        if (isSignedIn) {
            console.log("Ready to make api call.");
        } else {
            console.log("Need log in.");
        }
    }

    function initClient() {
        let SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

        gapi.client.init({
            'apiKey': API_KEY,
            'clientId': CLIENT_ID,
            'scope': SCOPE,
            'discoveryDocs': ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
        }).then(function () {
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
            updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function handleSignInClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignOutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * This method returns a promise for getting the information of the spreadsheet
     * @returns       a promise
     */
    function getSpreadsheetInfo() {
        let params = {
            spreadsheetId: sheetId
        };
        return gapi.client.sheets.spreadsheets.get(params);
    }

    /**
     * This method returns an object containing the title of the spreadsheet and
     * the sheets information in the spreadsheet
     * @param response the response of getSpreadsheetInfo()
     * @return an object
     */
    function parseSpreadsheetInfo(response) {
        let info = {
            title: response.result.properties.title,
            sheets: response.result.sheets
        }
        return info;
    }

    /**
     * This method returns a promise for getting the target sheet
     * @param inputRange the string specifying the range
     * @returns          a promise
     */
    function getSheet(inputRange) {
        let params = {
            spreadsheetId: sheetId,
            range: inputRange
        };
        return gapi.client.sheets.spreadsheets.values.get(params);
    }

    /**
     * This method returns a 2D array of values in the getSheet response
     * @param response the response of getSheet(inputRange)
     * @return a 2D array of values of target sheet
     */
    function parseSheetValues(response) {
        return response.result.values;
    }

    /**
     * Returns the 2D array after filtering the input array.
     * @param values  the input 2D array
     * @param keyword the searching keyword
     * @param columnIndex the specific index of column to be filtered
     *                    if less than 0, then any column includes the keyword
     *                    will add the row to the result.
     * @returns       a 2D array
     */
    function filterByKeyword(values, keyword, columnIndex) {
        let shouldStay = false;
        let rows = values.length;
        for (let i = 0; i < rows; i++) {
            shouldStay = false;
            if (columnIndex < 0) {
                for (let j = 0; j < values[i].length; j++) {
                    if (values[i][j].includes(keyword)) {
                        shouldStay = true;
                        break;
                    }
                }
            } else {
                if (values[i][columnIndex].includes(keyword)) {
                    shouldStay = true;
                }
            }
            if (!shouldStay) {
                values.splice(i, 1);
                rows--;
                i--;
            }
        }
        return values;
    }

    /**
     * Returns a promise for adding the inputValues to the sheet
     * @param inputRange   a string value of target sheet in the spreadsheet
     * @param inputValues a 2D array of the values to be added
     * @returns           a promise
     */
    function update(inputRange, inputValues) {
        let params = {
            spreadsheetId: sheetId,
            range: inputRange,
            valueInputOption: "USER_ENTERED",
            values: inputValues
        }
        return gapi.client.sheets.spreadsheets.values.update(params);
    }

    /**
     * This method returns the cells updated of batchAdd
     * @param response the response of update(inputRange, inputValues)
     * @return number of rows updated
     */
    function parseUpdate(response) {
        return response.result.updatedCells;
    }

    /**
     * Returns a promise for adding the inputValues to the sheet
     * @param inputRange   a string value of target sheet in the spreadsheet
     * @param inputValues a 2D array of the values to be added
     * @returns           a promise
     */
    function batchAdd(inputRange, inputValues) {
        let params = {
            spreadsheetId: sheetId,
            range: inputRange + "!A:A",
            majorDimension: "ROWS",
            valueInputOption: "USER_ENTERED",
            values: inputValues
        };
        return gapi.client.sheets.spreadsheets.values.append(params);
    }

    /**
     * This method returns the rows updated of batchAdd
     * @param response the response of batchAdd(inputRange, inputValues)
     * @return number of rows updated
     */
    function parseBatchAdd(response) {
        return response.result.updates.updatedRows;
    }

    /**
     * This function parses the error response and logs the error message
     * to the console.error and returns the error message. 
     * @param reason the error response of a promise
     */
    function parseErrorMessage(reason) {
        console.error('error: ' + reason.result.error.message);
        return reason.result.error.message;
    }

    return Object.freeze({
        handleSignInClick,
        handleSignOutClick,
        handleClientLoad,
        getSpreadsheetInfo,
        parseSpreadsheetInfo,
        getSheet,
        parseSheetValues,
        filterByKeyword,
        update,
        parseUpdate,
        batchAdd,
        parseBatchAdd,
        parseErrorMessage
    })
}