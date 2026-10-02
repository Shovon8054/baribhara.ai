import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

// Load .env from both workspace root and backend folder
dotenv.config({ path: path.resolve(process.cwd(), "../.env") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer directly to Cloudinary using streaming.
 * @param fileBuffer The in-memory buffer of the uploaded file
 * @param folder Target folder in Cloudinary (e.g. 'baribhara/properties', 'baribhara/profiles')
 * @returns Promise resolving to Cloudinary UploadApiResponse
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "baribhara/properties"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary by its public ID.
 * @param publicId The public ID of the resource
 */
export const deleteFromCloudinary = async (publicId: string): Promise<any> => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete asset from Cloudinary:", error);
    return null;
  }
};

export default cloudinary;
