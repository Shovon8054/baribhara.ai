"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const property_service_1 = __importDefault(require("./property.service"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const propertyController = {
    async createProperty(req, res) {
        try {
            // Uploaded images
            const files = req.files;
            const images = files
                ? files.map((file) => `/uploads/properties/${file.filename}`)
                : [];
            const { title, description, price, bedrooms, bathrooms, area, location, latitude, longitude, property_type, furnished, family_bachelor, parking, lift, pet_friendly, availability, amenities, nearby_facilities, } = req.body;
            // owner_id must come from the authenticated user
            const owner_id = req.user?.id;
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
            const property = await property_service_1.default.createProperty({
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(500).json({
                success: false,
                message,
            });
        }
    },
    async getAllProperties(req, res) {
        try {
            const properties = await property_service_1.default.getAllProperties();
            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties,
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(500).json({
                success: false,
                message,
            });
        }
    },
    async deleteProperty(req, res) {
        try {
            const propertyId = req.params.id;
            if (!propertyId || Array.isArray(propertyId)) {
                return res.status(400).json({ success: false, message: "A valid property ID is required" });
            }
            const ownerId = req.user.id;
            const property = await property_service_1.default.deleteProperty(propertyId, ownerId);
            // Delete images from uploads folder
            for (const image of property.images) {
                const imagePath = path_1.default.join(__dirname, "../uploads/properties", path_1.default.basename(image));
                if (fs_1.default.existsSync(imagePath)) {
                    fs_1.default.unlinkSync(imagePath);
                }
            }
            res.status(200).json({
                success: true,
                message: "Property deleted successfully",
            });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Something went wrong";
            res.status(400).json({
                success: false,
                message,
            });
        }
    },
    async searchProperties(req, res) {
        try {
            const properties = await property_service_1.default.searchProperties(req.query);
            res.status(200).json({
                success: true,
                count: properties.length,
                data: properties,
            });
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Something went wrong";
            res.status(500).json({
                success: false,
                message,
            });
        }
    }
};
exports.default = propertyController;
