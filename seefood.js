require("dotenv").config();

// Imports the Google Cloud client library
const vision = require("@google-cloud/vision");
// Creates a client
const client = new vision.ImageAnnotatorClient();
const regex = /hot.?dog/gi;

const SeeFood = img => {
  let request = {
    image: {
      source: {
        imageUri: `${img}`
      }
    },
    imageContext: {
      webDetectionParams: {
        includeGeoResults: true
      }
    }
  };
  return client.webDetection(request).then(results => {
    const webDetection = results[0].webDetection;
    const result = [];
    if (webDetection.bestGuessLabels.length) {
      webDetection.bestGuessLabels.forEach(label => {
        if (!regex.test(label.label)) {
          result.push(
            `Not Hot Dog!\n I see a ${
              webDetection.webEntities[0].description
            }\n or maybe it's a ${label.label}`
          );
        } else {
          result.push("Hot Dog!");
        }
      });
    }
    return result[0];
  });
};

module.exports = SeeFood;
