# arcgis-node

This script was made to made to automate the mapping of points into ArcGIS Online.

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

# Overview
```js
const csv = require("csvtojson"); // To convert csv to json
const request = require("request"); // For http requests
const colors = require("colors/safe"); // Console logging colors
require("dotenv").config(); // Config file

let client_id = process.env.CLIENT_ID; // Save the client id from the environment file
let client_secret = process.env.CLIENT_SECRET; // Save the client secret from the environment file

const url = `https://www.arcgis.com/sharing/rest/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`; // Create the url that will be used to gain access to the access token, using the client id and secret

function token() { // Define a function for ease 
  console.log(colors.green("Getting access token...")); // Show that the script is doing something and isn't stuck
  request.get( // Start a GET request
  {
    url: url, // Define where the GET request should point to (url = const url...)
    json: true, // Set the response to json instead of html (default)
    header: { "User-Agent": "request" }
  },
  (err, res, data) => {
    if (err) {
      console.log("Error:", err); // Log if error
    } else if (res.statusCode !== 200) {
      console.log("Status:", res.statusCode); // Log if the status code isn't 200 (OK)
    } else {
      console.log(colors.blue("Access token acquired, generating ArcGIS url...")); // Show that the script has made progress
      let token = data.access_token; // Save the access token inside a variable named token 
      update(token); // Run a function named update, passing in the value of token
    }
  }
  );
}

function update(token) { // Start running the new function once the token has finished generating, also grabbing the value of "token" 
  let csvFilePath = "data/SaltBins.csv"; // Define the path for the csv file
  csv() // Call the csv to json converter 
    .fromFile(csvFilePath) // Give the converter the correct file path to convert
    .then(features => { // Once it's finished converting, name the variable "features"
      console.log(JSON.stringify(features)); // print the variable out so we know that it's working
      // Change replaces when I create the regex
      let format = "json"; // Define format that we want to response to be in
      let updateURL = `https://services9.arcgis.com/2YYldcvahRdcVBRi/arcgis/rest/services/Salt_Bins/FeatureServer/0/addFeatures?f=${format}&token=${token}&features=${JSON.stringify(features)}`; // Generate the endpoint using the format (json), token and features (json output)
      request.post( // Start a get request
        {
          url: updateURL, // Define where the POST request should post to
          json: true // Set the view response to json
        },
        (error, res, body) => {
          if (error) {
            console.error(error); // Log if there's an error
            return; // Stop the script if there's an error
          }
          console.log(colors.red(`statusCode: ${res.statusCode}`)); // Send the status code
          console.log(body); // Show the output of the entire body of the web page
        }
      );
    });
}

token(); // Start the script
```
