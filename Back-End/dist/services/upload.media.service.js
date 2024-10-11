"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_blob_1 = require("@azure/storage-blob");
// // Load environment variables from .env file
// dotenv.config();
const BLOB_URL = process.env.BLOB_URL;
const CONTAINER_NAME = process.env.CONTAINER_NAME;
if (!BLOB_URL) {
    throw new Error("Azure Storage connection string is missing.");
}
if (!CONTAINER_NAME) {
    throw new Error("Container name is missing.");
}
// Initialize the BlobServiceClient and ContainerClient once, at the module level
const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(BLOB_URL);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);
// Function to upload a file to Azure Blob Storage
const uploadBlob = (filePath, blobName, metaData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // Upload the file
        yield blockBlobClient.uploadFile(filePath, {
            metadata: metaData, // Set the metadata
        });
        console.log(`Blob "${blobName}" uploaded successfully`);
        return `Blob "${blobName}" uploaded successfully`;
    }
    catch (error) {
        const errorMessage = error.message || "Unknown error occurred during blob upload";
        throw new Error("Error uploading blob: " + errorMessage);
    }
});
const retrieveBlob = (blobName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        // Get the blob's properties to check if it exists
        const blobProperties = yield blockBlobClient.getProperties();
        if (blobProperties) {
            console.log(`Blob "${blobName}" found. Retrieving...`);
            const downloadBlockBlobResponse = yield blockBlobClient.download(0); // Start downloading from the beginning
            const readableStream = downloadBlockBlobResponse.readableStreamBody; // This is a Readable Stream
            return readableStream; // Return the readable stream
        }
    }
    catch (error) {
        const errorMessage = error.message || "Unknown error occurred during blob retrieval";
        console.error("Error retrieving blob:", errorMessage);
        throw new Error("Error retrieving blob: " + errorMessage);
    }
    return null; // Return null if the blob does not exist
});
