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


