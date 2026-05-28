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
  const {
    customer_name,
    customer_email,
    subject,
    description,
    priority,
    assigned_to,
  } = req.body;

  const query = `
    INSERT INTO tickets 
    (customer_name, customer_email, subject, description, priority,assigned_to)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [customer_name, customer_email, subject, description, priority || "Medium", assigned_to || "Unassigned", ],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      const ticketId = generateTicketId(this.lastID);

      db.run(
        `UPDATE tickets SET ticket_id = ? WHERE id = ?`,
        [ticketId, this.lastID]
      );

      res.status(201).json({
        message: "Ticket created successfully",
        ticket_id: ticketId,
      });
    }
  );
});

/*
-----------------------------------
GET ALL TICKETS
GET /api/tickets
-----------------------------------
*/
router.get("/", (req, res) => {
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

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(rows);
  });
});

/*
-----------------------------------
GET SINGLE TICKET
GET /api/tickets/:ticket_id
-----------------------------------
*/
router.get("/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;

  db.get(
    `SELECT * FROM tickets WHERE ticket_id = ?`,
    [ticket_id],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      if (!row) {
        return res.status(404).json({
          message: "Ticket not found",
        });
      }

      res.json(row);
    }
  );
});

/*
-----------------------------------
UPDATE TICKET
PUT /api/tickets/:ticket_id
-----------------------------------
*/
router.put("/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;
  const { status, notes, assigned_to } = req.body;
  const indianTime = new Date().toLocaleString(
  "sv-SE",
  {
    timeZone: "Asia/Kolkata",
  }
  );

  const query = `
    UPDATE tickets
    SET status = ?,
        notes = ?,
        assigned_to = ?,
        updated_at = indianTime
    WHERE ticket_id = ?
  `;

  db.run(query, [status, notes, assigned_to, ticket_id], function (err) {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json({
      message: "Ticket updated successfully",
    });
  });
});
/*
-----------------------------------
DELETE TICKET
DELETE /api/tickets/:ticket_id
-----------------------------------
*/

router.delete("/:ticket_id", (req, res) => {
  const { ticket_id } = req.params;

  db.run(
    `DELETE FROM tickets WHERE ticket_id = ?`,
    [ticket_id],
    function (err) {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      res.json({
        message: "Ticket deleted successfully",
      });
    }
  );
});
module.exports = router;