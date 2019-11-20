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
