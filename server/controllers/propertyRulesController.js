// controllers/propertyRulesController.js
import db from "../config/db.js";

// Get all rules for a property
export const getPropertyRules = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // First verify the property belongs to the user
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const [rules] = await db.query(
      "SELECT id, rule_name FROM property_rules WHERE property_id = ? ORDER BY id",
      [propertyId],
    );

    res.json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error("Error fetching property rules:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching property rules",
      error: error.message,
    });
  }
};

// Add a rule to a property
export const addPropertyRule = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rule_name } = req.body;

    if (!rule_name) {
      return res.status(400).json({
        success: false,
        message: "Rule name is required",
      });
    }

    // First verify the property belongs to the user
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const [result] = await db.query(
      "INSERT INTO property_rules (property_id, rule_name) VALUES (?, ?)",
      [propertyId, rule_name],
    );

    const [newRule] = await db.query(
      "SELECT id, rule_name FROM property_rules WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json({
      success: true,
      message: "Rule added successfully",
      data: newRule[0],
    });
  } catch (error) {
    console.error("Error adding property rule:", error);
    res.status(500).json({
      success: false,
      message: "Error adding property rule",
      error: error.message,
    });
  }
};

// Add multiple rules to a property
export const addMultiplePropertyRules = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { rules } = req.body; // Expecting array of rule names

    if (!rules || !Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Rules array is required",
      });
    }

    // First verify the property belongs to the user
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Start a transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      const insertedRules = [];

      for (const ruleName of rules) {
        const [result] = await connection.query(
          "INSERT INTO property_rules (property_id, rule_name) VALUES (?, ?)",
          [propertyId, ruleName],
        );

        insertedRules.push({
          id: result.insertId,
          rule_name: ruleName,
        });
      }

      await connection.commit();

      res.status(201).json({
        success: true,
        message: `${insertedRules.length} rules added successfully`,
        data: insertedRules,
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error adding multiple property rules:", error);
    res.status(500).json({
      success: false,
      message: "Error adding property rules",
      error: error.message,
    });
  }
};

// Update a specific rule
export const updatePropertyRule = async (req, res) => {
  try {
    const { propertyId, ruleId } = req.params;
    const { rule_name } = req.body;

    if (!rule_name) {
      return res.status(400).json({
        success: false,
        message: "Rule name is required",
      });
    }

    // Verify the property belongs to the user and the rule exists
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const [result] = await db.query(
      "UPDATE property_rules SET rule_name = ? WHERE id = ? AND property_id = ?",
      [rule_name, ruleId, propertyId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    const [updatedRule] = await db.query(
      "SELECT id, rule_name FROM property_rules WHERE id = ?",
      [ruleId],
    );

    res.json({
      success: true,
      message: "Rule updated successfully",
      data: updatedRule[0],
    });
  } catch (error) {
    console.error("Error updating property rule:", error);
    res.status(500).json({
      success: false,
      message: "Error updating property rule",
      error: error.message,
    });
  }
};

// Delete a specific rule
export const deletePropertyRule = async (req, res) => {
  try {
    const { propertyId, ruleId } = req.params;

    // Verify the property belongs to the user
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const [result] = await db.query(
      "DELETE FROM property_rules WHERE id = ? AND property_id = ?",
      [ruleId, propertyId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Rule not found",
      });
    }

    res.json({
      success: true,
      message: "Rule deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting property rule:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting property rule",
      error: error.message,
    });
  }
};

// Delete all rules for a property
export const deleteAllPropertyRules = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Verify the property belongs to the user
    const [property] = await db.query(
      "SELECT id FROM properties WHERE id = ? AND user_id = ?",
      [propertyId, req.user.id],
    );

    if (property.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    await db.query("DELETE FROM property_rules WHERE property_id = ?", [
      propertyId,
    ]);

    res.json({
      success: true,
      message: "All rules deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting all property rules:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting property rules",
      error: error.message,
    });
  }
};
