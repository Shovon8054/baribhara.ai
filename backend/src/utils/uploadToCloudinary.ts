import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export interface UploadOptions {
  folder?: string;
  type?: "upload" | "authenticated" | "private";
  resourceType?: "auto" | "image" | "raw";
}

/**
 * Uploads a document buffer to Cloudinary with private/authenticated access type.
 * Specifically designed for sensitive documents like NID PDFs.
 *
 * @param fileBuffer The in-memory file buffer (e.g. from Multer)
 * @param folder Target Cloudinary directory (default: 'baribhara/identity-verification')
 * @returns Promise resolving to Cloudinary UploadApiResponse
 */
export const uploadNidPdfToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "baribhara/identity-verification"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
        type: "authenticated", // Ensures file is NOT publicly accessible
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new Error(
              `Cloudinary storage error: ${error?.message || "Failed to upload document"}`
            )
          );
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Generic upload utility for Cloudinary.
 * @param fileBuffer The in-memory buffer of the uploaded file
 * @param folder Target folder in Cloudinary
 * @param options Additional Cloudinary upload parameters
 */
export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "baribhara/verifications",
  options: UploadOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: options.resourceType || "auto",
        type: options.type || "upload",
      },
      (error, result) => {
        if (error || !result) {
          return reject(
            new Error(
              `Cloudinary storage error: ${error?.message || "Failed to upload file"}`
            )
          );
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Generates a signed, expiring URL to view an authenticated/private document.
 * Only intended for backend use (e.g., admin document review).
 *
 * @param publicId The public ID of the authenticated document
 * @param expiresInSeconds Duration in seconds for which the URL remains valid (default: 3600 = 1 hour)
 */
export const getSignedVerificationDocUrl = (
  publicId: string,
  expiresInSeconds: number = 3600
): string => {
  const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const cleanPublicId = publicId.replace(/\.pdf$/, "");
  return cloudinary.utils.private_download_url(cleanPublicId, "pdf", {
    resource_type: "image",
    type: "authenticated",
    expires_at: expiresAt,
  });
};

/**
 * Deletes an asset from Cloudinary by its public ID.
 * @param publicId The public ID of the resource
 * @param type The delivery type ('authenticated' or 'upload')
 */
export const deleteFromCloudinary = async (
  publicId: string,
  type: "upload" | "authenticated" = "authenticated"
): Promise<any> => {
  try {
    return await cloudinary.uploader.destroy(publicId, { type });
  } catch (error) {
    console.error("Failed to delete asset from Cloudinary:", error);
    return null;
  }
};

export default {
  uploadNidPdfToCloudinary,
  uploadToCloudinary,
  getSignedVerificationDocUrl,
  deleteFromCloudinary,
};
