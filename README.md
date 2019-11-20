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
      url: url, // This is finding the url that we found defined in [Token url](https://github.com/Kalum1/arcgis-node/blob/master/README.md#token-url)
      json: true,
      headers: { "User-Agent": "request" }
    },
    (err, res, data) => {
      if (err) {
        console.log("Error:", err);
      } else if (res.statusCode !== 200) {
        console.log("Status:", res.statusCode);
      } else {
        console.log(
          colors.blue("Access token acquired, generating ArcGIS url...")
        );
        let token = data.access_token;
        update(token);
      }
    }
  );
}
  ```
