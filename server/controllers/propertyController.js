// controllers/propertyController.js
import db from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to parse images safely
const parseImages = (imagesField) => {
  if (!imagesField) return [];

  // If it's already an array, return it
  if (Array.isArray(imagesField)) return imagesField;

  // If it's a string, try to parse it
  if (typeof imagesField === "string") {
    try {
      // Try to parse as JSON
      return JSON.parse(imagesField);
    } catch (e) {
      // If parsing fails, it might be a single filename
      // Check if it looks like a filename (no brackets)
      if (!imagesField.startsWith("[") && !imagesField.endsWith("]")) {
        return [imagesField];
      }
      return [];
    }
  }

  return [];
};

// Helper function to get property with its rules
const getPropertyWithRules = async (propertyId, userId) => {
  const [properties] = await db.query(
    "SELECT * FROM properties WHERE id = ? AND user_id = ?",
    [propertyId, userId],
  );

  if (properties.length === 0) return null;

  const property = properties[0];
  property.images = parseImages(property.images);

  // Get rules for this property
  const [rules] = await db.query(
    "SELECT id, rule_name FROM property_rules WHERE property_id = ?",
    [propertyId],
  );

  property.rules = rules;

  return property;
};

// Get all properties for a user with their rules
export const getUserProperties = async (req, res) => {
  try {
    const [properties] = await db.query(
      "SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id],
    );

    // Parse images and get rules for each property
    const parsedProperties = await Promise.all(
      properties.map(async (property) => {
        const propertyWithRules = await getPropertyWithRules(
          property.id,
          req.user.id,
        );
        return propertyWithRules;
      }),
    );

    res.json({
      success: true,
      data: parsedProperties,
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching properties",
      error: error.message,
    });
  }
};

// Get single property by ID with its rules
export const getPropertyById = async (req, res) => {
  try {
    const property = await getPropertyWithRules(req.params.id, req.user.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching property",
      error: error.message,
    });
  }
};

// Create new property
export const createProperty = async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      max_persons,
      status,
      rules, // Optional: array of rule names to add immediately
    } = req.body;

    // Handle images from multer
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    // Always store as JSON string
    const imagesValue = images.length > 0 ? JSON.stringify(images) : null;

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const [result] = await connection.query(
        `INSERT INTO properties (
          user_id, address, city, state, zip_code,
          price, bedrooms, bathrooms, max_persons, images, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          address,
          city,
          state,
          zip_code,
          price,
          bedrooms || 1,
          bathrooms || 1,
          max_persons || 1,
          imagesValue,
          status || "available",
        ],
      );

      // If rules were provided, add them
      if (rules && Array.isArray(rules) && rules.length > 0) {
        for (const ruleName of rules) {
          await connection.query(
            "INSERT INTO property_rules (property_id, rule_name) VALUES (?, ?)",
            [result.insertId, ruleName],
          );
        }
      }

      await connection.commit();

      // Get the created property with its rules
      const property = await getPropertyWithRules(result.insertId, req.user.id);

      res.status(201).json({
        success: true,
        message: "Property created successfully",
        data: property,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error creating property:", error);
    res.status(500).json({
      success: false,
      message: "Error creating property",
      error: error.message,
    });
  }
};

// Update property
export const updateProperty = async (req, res) => {
  try {
    const {
      address,
      city,
      state,
      zip_code,
      price,
      bedrooms,
      bathrooms,
      max_persons,
      status,
    } = req.body;

    // Get existing property
    const [existing] = await db.query(
      "SELECT images FROM properties WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Handle images
    let existingImages = parseImages(existing[0].images);
    let newImages = [];

    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => file.filename);
    }

    const allImages = [...existingImages, ...newImages];
    // Always store as JSON string
    const imagesValue = allImages.length > 0 ? JSON.stringify(allImages) : null;

    await db.query(
      `UPDATE properties SET
        address = ?, city = ?, state = ?,
        zip_code = ?, price = ?, bedrooms = ?, bathrooms = ?,
        max_persons = ?, images = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND user_id = ?`,
      [
        address,
        city,
        state,
        zip_code,
        price,
        bedrooms,
        bathrooms,
        max_persons,
        imagesValue,
        status,
        req.params.id,
        req.user.id,
      ],
    );

    // Get updated property with rules
    const property = await getPropertyWithRules(req.params.id, req.user.id);

    res.json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({
      success: false,
      message: "Error updating property",
      error: error.message,
    });
  }
};

// Delete property
export const deleteProperty = async (req, res) => {
  try {
    const [property] = await db.query(
      "SELECT images FROM properties WHERE id = ? AND user_id = ?",
      [req.params.id, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Delete images from filesystem
    if (property[0].images) {
      const images = parseImages(property[0].images);
      images.forEach((image) => {
        const imagePath = path.join(__dirname, "../uploads", image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }

    await db.query("DELETE FROM properties WHERE id = ? AND user_id = ?", [
      req.params.id,
      req.user.id,
    ]);

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting property",
      error: error.message,
    });
  }
};

// Delete specific image from property
export const deletePropertyImage = async (req, res) => {
  try {
    const { propertyId, imageName } = req.params;

    const [property] = await db.query(
      "SELECT images FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const images = parseImages(property[0].images);
    const updatedImages = images.filter((img) => img !== imageName);

    // Delete from filesystem
    const imagePath = path.join(__dirname, "../uploads", imageName);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Always store as JSON string
    const imagesValue =
      updatedImages.length > 0 ? JSON.stringify(updatedImages) : null;

    await db.query("UPDATE properties SET images = ? WHERE id = ?", [
      imagesValue,
      propertyId,
    ]);

    res.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
};
