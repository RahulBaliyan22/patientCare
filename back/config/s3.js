require("dotenv").config();
const AWS = require("aws-sdk");

function initializeS3() {
    return new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
}

module.exports = initializeS3;
