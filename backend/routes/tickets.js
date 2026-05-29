const express = require("express");
const router = express.Router();
const db = require("../db");

// Generate Ticket ID
function generateTicketId(id) {
  return `TKT-${String(id).padStart(3, "0")}`;
}

/*
-----------------------------------
CREATE TICKET
POST /api/tickets
-----------------------------------
*/
router.post("/", (req, res) => {
  try {
    const {
      customer_name,
      customer_email,
      subject,
      description,
      priority,
      assigned_to,
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO tickets 
      (customer_name, customer_email, subject, description, priority, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      customer_name,
      customer_email,
      subject,
      description,
      priority || "Medium",
      assigned_to || "Unassigned"
    );

    const ticketId = generateTicketId(result.lastInsertRowid);

    db.prepare(`
      UPDATE tickets 
      SET ticket_id = ? 
      WHERE id = ?
    `).run(ticketId, result.lastInsertRowid);

    res.status(201).json({
      message: "Ticket created successfully",
      ticket_id: ticketId,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
-----------------------------------
GET ALL TICKETS
GET /api/tickets
-----------------------------------
*/
router.get("/", (req, res) => {
  try {
    const { status, search } = req.query;

    let query = `SELECT * FROM tickets WHERE 1=1`;
    let params = [];

    if (status) {
      query += ` AND status = ?`;
      params.push(status);
    }

    if (search) {
      query += `
        AND (
          customer_name LIKE ?
          OR customer_email LIKE ?
          OR subject LIKE ?
          OR description LIKE ?
          OR ticket_id LIKE ?
        )
      `;

      const searchTerm = `%${search}%`;

      params.push(
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm
      );
    }

    query += ` ORDER BY created_at DESC`;

    const rows = db.prepare(query).all(...params);

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
-----------------------------------
GET SINGLE TICKET
GET /api/tickets/:ticket_id
-----------------------------------
*/
router.get("/:ticket_id", (req, res) => {
  try {
    const { ticket_id } = req.params;

    const row = db.prepare(`
      SELECT * FROM tickets 
      WHERE ticket_id = ?
    `).get(ticket_id);

    if (!row) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json(row);

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
-----------------------------------
UPDATE TICKET
PUT /api/tickets/:ticket_id
-----------------------------------
*/
router.put("/:ticket_id", (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status, notes, assigned_to } = req.body;

    const indianTime = new Date().toLocaleString("sv-SE", {
      timeZone: "Asia/Kolkata",
    });

    db.prepare(`
      UPDATE tickets
      SET status = ?,
          notes = ?,
          assigned_to = ?,
          updated_at = ?
      WHERE ticket_id = ?
    `).run(
      status,
      notes,
      assigned_to,
      indianTime,
      ticket_id
    );

    res.json({
      message: "Ticket updated successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/*
-----------------------------------
DELETE TICKET
DELETE /api/tickets/:ticket_id
-----------------------------------
*/
router.delete("/:ticket_id", (req, res) => {
  try {
    const { ticket_id } = req.params;

    db.prepare(`
      DELETE FROM tickets 
      WHERE ticket_id = ?
    `).run(ticket_id);

    res.json({
      message: "Ticket deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;