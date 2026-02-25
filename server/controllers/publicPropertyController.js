// controllers/publicPropertyController.js
import db from "../config/db.js";

// Helper function to parse images safely
const parseImages = (imagesField) => {
  if (!imagesField) return [];
  if (Array.isArray(imagesField)) return imagesField;
  if (typeof imagesField === "string") {
    try {
      return JSON.parse(imagesField);
    } catch (e) {
      if (!imagesField.startsWith("[") && !imagesField.endsWith("]")) {
        return [imagesField];
      }
      return [];
    }
  }
  return [];
};

// Get all available properties (public)
export const searchProperties = async (req, res) => {
  try {
    let query = `
      SELECT p.*, 
             GROUP_CONCAT(pr.rule_name) as rules
      FROM properties p
      LEFT JOIN property_rules pr ON p.id = pr.property_id
      WHERE p.status = 'available'
    `;

    const queryParams = [];

    // Add search filters if provided
    if (req.query.search) {
      query += ` AND (p.address LIKE ? OR p.city LIKE ? OR p.state LIKE ?)`;
      const searchTerm = `%${req.query.search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (req.query.city) {
      query += ` AND p.city = ?`;
      queryParams.push(req.query.city);
    }

    if (req.query.minPrice) {
      query += ` AND p.price >= ?`;
      queryParams.push(req.query.minPrice);
    }

    if (req.query.maxPrice) {
      query += ` AND p.price <= ?`;
      queryParams.push(req.query.maxPrice);
    }

    if (req.query.bedrooms) {
      query += ` AND p.bedrooms >= ?`;
      queryParams.push(req.query.bedrooms);
    }

    if (req.query.maxPersons) {
      query += ` AND p.max_persons >= ?`;
      queryParams.push(req.query.maxPersons);
    }

    query += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    const [properties] = await db.query(query, queryParams);

    // Parse images and rules for each property
    const parsedProperties = properties.map((property) => {
      const images = parseImages(property.images);

      // Parse rules from GROUP_CONCAT
      const rules = property.rules ? property.rules.split(",") : [];

      return {
        ...property,
        images,
        rules: rules.map((rule) => ({ rule_name: rule })),
      };
    });

    res.json({
      success: true,
      data: parsedProperties,
    });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({
      success: false,
      message: "Error searching properties",
      error: error.message,
    });
  }
};

// Get single property by ID (public)
export const getPublicPropertyById = async (req, res) => {
  try {
    const [properties] = await db.query(
      `SELECT p.*, 
              GROUP_CONCAT(pr.rule_name) as rules
       FROM properties p
       LEFT JOIN property_rules pr ON p.id = pr.property_id
       WHERE p.id = ? AND p.status = 'available'
       GROUP BY p.id`,
      [req.params.id],
    );

    if (properties.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const property = properties[0];
    property.images = parseImages(property.images);

    // Parse rules from GROUP_CONCAT
    property.rules = property.rules
      ? property.rules.split(",").map((rule) => ({ rule_name: rule }))
      : [];

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

// Get all unique cities (public)
export const getCities = async (req, res) => {
  try {
    const [cities] = await db.query(
      "SELECT DISTINCT city FROM properties WHERE status = 'available' ORDER BY city",
    );

    res.json({
      success: true,
      data: cities.map((c) => c.city),
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cities",
      error: error.message,
    });
  }
};
