# arcgis-node

This sceript was made to made to automate the mapping of points into ArcGIS Online.

## Requirements

```js
const csv = require("csvtojson");
const request = require("request");
const colors = require("colors/safe");
require("dotenv").config();
```

There are 4 requirements inorder to run this script;
csvtojson - Converts the csv file into json
request - Handle http requests for Getting and Posting to the ArcGIS servers
colors - Makes the logging text in the console stand out (purely for aesthetics)
dotenv - Is for the enviroment variables 

## Defining client credentials using dotenv

Inside of our .env file there are two variables in the following format:
```
CLIENT_ID=********
CLIENT_SECRET=*******
```
These are stored in a separate file for security.

We call these variables with the following code:

```js
let client_id = process.env.CLIENT_ID;
let client_secret = process.env.CLIENT_SECRET;
```

## Token URL

In this section of the code we define the url to gain our access token.

We do this by using the credentials stored inside of the `.env` file:
```js
const url = `https://www.arcgis.com/saring/rest/oauth2/token?client_id=${client_id}&${client_secret}&grant_type=client_credentials`
```

### Getting the access token

Now we have the correct variables, we can move foward and get the access token to access the main ArcGIS page.

We first start by creating a new function
```js
function token() {
  console.log(colors.green("Getting access token...")); // Show that the script is doing something and isn't stuck
  request.get( // Start a get request to get the access token
    {
      url: url, // This is finding the url that we found defined in "Token URL"
      json: true, // Setting the response as json instead of html
      headers: { "User-Agent": "request" }
    },
    (err, res, data) => {
      if (err) {
        console.log("Error:", err); // Check for errors
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode); // If the status code is **not** 200 run this
      } else {
        console.log(colors.blue("Access token acquired, generating ArcGIS url...")); // Let the user know that the script is generating the correct url
        let token = data.access_token; // Define the access_token we got from the get request as "token"
        update(token); // Run the function named update whilst passing in the token variable 
      }
    }
  );
}
  ```
  
## Using the access token

In order to gain access to the page, we must have a valid access token. These access tokens are valid for 7200 seconds. This is not a lot of time so we regenerate a new token every time the script runs.

We need to make the url into a variable:
```js
let format = 'json';
let updateURL = `https://services.../addFeatures?f=${format}&token=${token}&features=${JSON.stringify(features)}`;
```
At the moment this link will not work because `features` will be undefined, to fix this we need to define features.

## Define features

We need to take the csv and turn it into a json format, to do this we will be using csvtojson as it is fast and reliable

```js
let csvFilePath = "data/SaltBins.csv" // This looks for SaltBins.csv in the /data folder

csv()
  .fromFile(csvFilePath)
  .then(features => {
    console.log(JSON.stringify(features)); // We run this to check if the parser has done it's job and parsed the csv to json correctly
    let format = 'json';
    let updateURL = `https://services.../addFeatures?f=${format}&token=${token}&features=${JSON.stringify(features)}`;
    
    request.post(
    {
      url: updateURL, // Gets the URL that we created for updating the service
      json: true
    },
    (error, res, body) => {
      if(error) {
        console.error(error);
        return; // Stop the script
      }
      console.log(colors.red(`statusCode: ${res.statusCode}`)); // view the status code of the request
      console.log(body); // View the body code of the request
    }
    )
  })
```

## Running

This script will **NOT** work if we don't put `token()` at the very bottom, this is what kickstarts the script.
