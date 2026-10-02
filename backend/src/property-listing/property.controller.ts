import { Request, Response } from "express";
import propertyService from "./property.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const propertyController = {
  async createProperty(req: Request, res: Response) {
    try {
      // Upload images to Cloudinary
      const files = req.files as Express.Multer.File[];
      let images: string[] = [];

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) =>
          uploadToCloudinary(file.buffer, "baribhara/properties")
        );
        const uploadResults = await Promise.all(uploadPromises);
        images = uploadResults.map((result) => result.secure_url);
      }

      const {
        title,
        description,
        price,
        bedrooms,
        bathrooms,
        area,
        location,
        latitude,
        longitude,
        property_type,
        furnished,
        family_bachelor,
        parking,
        lift,
        pet_friendly,
        availability,
        amenities,
        nearby_facilities,
      } = req.body;

      // owner_id must come from the authenticated user
      const owner_id = (req as any).user?.id;
      if (!owner_id) {
        return res.status(401).json({ success: false, message: "Authentication required to create property" });
      }

      // Basic validation for numeric fields
      const priceNum = price !== undefined && price !== "" ? Number(price) : NaN;
      const bedroomsNum = bedrooms !== undefined && bedrooms !== "" ? Number(bedrooms) : NaN;
      const bathroomsNum = bathrooms !== undefined && bathrooms !== "" ? Number(bathrooms) : NaN;
      const areaNum = area !== undefined && area !== "" ? Number(area) : NaN;

      if (isNaN(priceNum) || isNaN(bedroomsNum) || isNaN(bathroomsNum) || isNaN(areaNum)) {
        return res.status(400).json({ success: false, message: "Invalid numeric values for price/bedrooms/bathrooms/area" });
      }

      const property = await propertyService.createProperty({
        title,
        description,
        price: priceNum,
        bedrooms: bedroomsNum,
        bathrooms: bathroomsNum,
        area: areaNum,
        location,
        latitude: latitude ? Number(latitude) : undefined,
        longitude: longitude ? Number(longitude) : undefined,
        property_type,
        furnished: furnished === "true",
        family_bachelor,
        parking: parking === "true",
        lift: lift === "true",
        pet_friendly: pet_friendly === "true",
        availability: availability === "true",

        amenities: amenities
          ? Array.isArray(amenities)
            ? amenities
            : amenities.split(",")
          : [],

        nearby_facilities: nearby_facilities
          ? Array.isArray(nearby_facilities)
            ? nearby_facilities
            : nearby_facilities.split(",")
          : [],

        images,
        owner_id,
      });

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      res.status(500).json({
        success: false,
        message,
      });
    }
  },
  async getAllProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.getAllProperties();

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(500).json({
      success: false,
      message,
    });
  }
},
  async deleteProperty(req: Request, res: Response) {
  try {
    const propertyId = req.params.id;
    if (!propertyId || Array.isArray(propertyId)) {
      return res.status(400).json({ success: false, message: "A valid property ID is required" });
    }

    const ownerId = (req as any).user.id;

    const property = await propertyService.deleteProperty(
      propertyId,
      ownerId
    );

    // Delete images from Cloudinary or local disk
    if (Array.isArray(property.images)) {
      for (const image of property.images) {
        if (typeof image === "string" && image.includes("cloudinary.com")) {
          // Extract public_id from Cloudinary URL: e.g. baribhara/properties/xyz
          const parts = image.split("/");
          const uploadIndex = parts.indexOf("upload");
          if (uploadIndex !== -1) {
            const pathParts = parts.slice(uploadIndex + 2); // skip upload and version e.g. v1234
            const filenameWithExt = pathParts.join("/");
            const publicId = filenameWithExt.substring(0, filenameWithExt.lastIndexOf("."));
            await deleteFromCloudinary(publicId);
          }
        } else if (typeof image === "string") {
          const imagePath = path.join(
            __dirname,
            "../uploads/properties",
            path.basename(image)
          );
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    res.status(400).json({
      success: false,
      message,
    });
  }
  },
  async searchProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.searchProperties(req.query);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong";

    res.status(500).json({
      success: false,
      message,
    });
  }
  }
};

export default propertyController;
