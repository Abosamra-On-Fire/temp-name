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
// tests/unit/services/blobService.test.ts
const storage_blob_1 = require("@azure/storage-blob");
const stream_1 = require("stream");
const media_service_1 = require("../../../services/media.service"); // Adjust the import path as necessary
// Mocking the Azure Storage Blob client
jest.mock("@azure/storage-blob");
const mockBlobServiceClient = {
    getContainerClient: jest.fn(),
};
const mockContainerClient = {
    getBlockBlobClient: jest.fn(),
};
const mockBlockBlobClient = {
    uploadFile: jest.fn(),
    download: jest.fn(),
    getProperties: jest.fn(),
};
// Setup the mocked implementations before each test
beforeEach(() => {
    storage_blob_1.BlobServiceClient.fromConnectionString.mockReturnValue(mockBlobServiceClient);
    mockBlobServiceClient.getContainerClient.mockReturnValue(mockContainerClient);
    mockContainerClient.getBlockBlobClient.mockReturnValue(mockBlockBlobClient);
});
describe("Blob Service", () => {
    describe("uploadBlob", () => {
        it("should upload blob successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            mockBlockBlobClient.uploadFile.mockResolvedValueOnce({}); // Simulate successful upload
            const filePath = "path/to/file.txt";
            const blobName = "file.txt";
            const metaData = { key: "value" };
            const result = yield (0, media_service_1.uploadBlob)(filePath, blobName, metaData);
            expect(mockBlockBlobClient.uploadFile).toHaveBeenCalledWith(filePath, {
                metadata: metaData,
            });
            expect(result).toBe(`Blob "${blobName}" uploaded successfully`);
        }));
        it("should throw an error if upload fails", () => __awaiter(void 0, void 0, void 0, function* () {
            mockBlockBlobClient.uploadFile.mockRejectedValueOnce(new Error("Upload failed"));
            const filePath = "path/to/file.txt";
            const blobName = "file.txt";
            const metaData = { key: "value" };
            yield expect((0, media_service_1.uploadBlob)(filePath, blobName, metaData)).rejects.toThrow("Error uploading blob: Upload failed");
        }));
    });
    describe("retrieveBlob", () => {
        it("should retrieve blob successfully", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockReadableStream = new stream_1.Readable();
            mockBlockBlobClient.getProperties.mockResolvedValueOnce({}); // Simulate properties retrieval
            mockBlockBlobClient.download.mockResolvedValueOnce({
                readableStreamBody: mockReadableStream,
            });
            const blobName = "file.txt";
            const result = yield (0, media_service_1.retrieveBlob)(blobName);
            expect(mockBlockBlobClient.getProperties).toHaveBeenCalled();
            expect(mockBlockBlobClient.download).toHaveBeenCalledWith(0);
            expect(result).toBe(mockReadableStream);
        }));
        it("should return null if blob does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
            mockBlockBlobClient.getProperties.mockRejectedValueOnce(new Error("Blob not found"));
            const blobName = "non-existing-file.txt";
            const result = yield (0, media_service_1.retrieveBlob)(blobName);
            expect(result).toBeNull();
        }));
        it("should throw an error if retrieval fails", () => __awaiter(void 0, void 0, void 0, function* () {
            mockBlockBlobClient.getProperties.mockResolvedValueOnce({}); // Simulate properties retrieval
            mockBlockBlobClient.download.mockRejectedValueOnce(new Error("Download failed"));
            const blobName = "file.txt";
            yield expect((0, media_service_1.retrieveBlob)(blobName)).rejects.toThrow("Error retrieving blob: Download failed");
        }));
    });
});
