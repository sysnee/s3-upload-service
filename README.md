# S3 File Upload Service

## Usage

### Running the Server

To start the service, run:

\`\`\`bash
npm run start
\`\`\`

This will start the service on the default port (usually 3000). You can adjust the port and other configurations in the \`src/main.ts\` or as part of your environment variables.

### API Endpoints

#### POST \`/upload\`

Uploads a file to the specified S3 bucket.

- **URL**: \`/upload\`
- **Method**: \`POST\`
- **Headers**: \`Content-Type: multipart/form-data\`
- **Body**:

| Parameter         | Type        | Description                       |
|-------------------|-------------|-----------------------------------|
| \`file\`            | \`File\`      | The file to be uploaded           |
| \`accessKeyId\`     | \`string\`    | AWS access key ID                 |
| \`secretAccessKey\` | \`string\`    | AWS secret access key             |
| \`region\`          | \`string\`    | AWS region (e.g., \`us-east-1\`)    |
| \`bucketName\`      | \`string\`    | S3 bucket name                    |
| \`fileName\`        | \`string\`    | Name for the file in the bucket   |

### Frontend Usage Example

You can use the following code snippet in your front-end (or any Node.js client) to upload a file to the service:

\`\`\`javascript
const axios = require('axios');
const { createReadStream, unlinkSync } = require('fs');
const FormData = require('form-data');

const formData = new FormData();

const fileStream = createReadStream('/path/to/your/file');
formData.append('file', fileStream);

formData.append('accessKeyId', 'YOUR_ACCESS_KEY_ID'); 
formData.append('secretAccessKey', 'YOUR_SECRET_ACCESS_KEY'); 
formData.append('region', 'YOUR_REGION'); 
formData.append('bucketName', 'YOUR_BUCKET_NAME'); 
formData.append('fileName', 'desired-filename-in-s3');

axios.post('http://localhost:3000/upload', formData, {
  headers: formData.getHeaders(),
})
.then(response => {
  console.log('File uploaded successfully:', response.data.url);
  unlinkSync('/path/to/your/file'); // Remove the local file if needed
})
.catch(error => {
  console.error('Error uploading file:', error.message);
});
\`\`\`

### Response

If the file is successfully uploaded, the response will be:

\`\`\`json
{
  \"message\": \"File uploaded successfully\",
  \"url\": \"https://bucket-name.s3.amazonaws.com/your-file-name\"
}
\`\`\`

### Error Handling

In case of an error (e.g., missing parameters, AWS credentials issue), the service will respond with a 400 status code and an error message.

### Example Errors:

- **400 Bad Request**: Missing AWS credentials or bucket name
- **400 Bad Request**: File is missing
