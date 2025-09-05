const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Add this line
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend connected!' });
});

// Get all service providers - ADD THIS NEW ROUTE
app.get('/api/services', async (req, res) => {
  try {
    const { search, category } = req.query; // Get search parameters
    
    let query = `
      SELECT 
        sp.id,
        sp.business_name, 
        sp.owner_name, 
        sp.instagram_handle, 
        sp.price_range,
        sp.description,
        sp.phone,
        sp.address,
        c.name as category 
      FROM service_providers sp 
      JOIN categories c ON sp.category_id = c.id
      WHERE sp.is_active = true
    `;
    
    const queryParams = [];
    let paramCount = 1;
    
    // Add search filter if provided
    if (search) {
      query += ` AND (sp.business_name ILIKE $${paramCount} OR sp.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }
    
    // Add category filter if provided
    if (category) {
      query += ` AND c.name ILIKE $${paramCount}`;
      queryParams.push(`%${category}%`);
      paramCount++;
    }
    
    query += ` ORDER BY sp.business_name`;
    
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});