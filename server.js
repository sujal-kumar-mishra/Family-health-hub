// server.js

const express = require('express');
const mysql = require('mysql2/promise');
// const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Kavya@2630', // Replace with your MySQL password
  database: 'healthcaremanagement',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Successfully connected to the database');
  connection.release();
});

// Middleware for handling errors
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// API Endpoints

// Get all family members
app.get('/api/familymember', async (req, res) => {
  try {
    const query = 'SELECT * FROM familymember';
    const [results, fields] = await pool.query(query);

    res.json(results);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'An error occurred while fetching family members' });
  }
});

// Get a specific family member
app.get('/api/familymember/:member_id', async (req, res) => {
  const { member_id } = req.params;

  try {
    const query = 'SELECT * FROM familymember WHERE member_id = ?';
    const [results, fields] = await pool.query(query, [member_id]);

    if (results.length === 0) {
      res.status(404).json({ error: 'Family member not found' });
    } else {
      res.json(results[0]);
    }
  } catch (error) {
    console.error('Error fetching family member:', error);
    res.status(500).json({ error: 'An error occurred while fetching the family member' });
  }
});

// Update a family member
app.put('/api/updatefamilymember', async (req, res) => {
  const { member_id, first_name, last_name, date_of_birth, gender, relationship } = req.body;

  try {
    const query = `
      UPDATE familymember 
      SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, relationship = ?
      WHERE member_id = ?
    `;
    const [result, fields] = await pool.query(query, [first_name, last_name, date_of_birth, gender, relationship, member_id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Family member not found' });
    } else {
      res.json({ message: 'Family member updated successfully' });
    }
  } catch (error) {
    console.error('Error updating family member:', error);
    res.status(500).json({ error: 'An error occurred while updating the family member' });
  }
});
// Update a health record
// Example: Define a PUT route to update a health record by record_id
app.put('/api/healthrecords/:record_id', async (req, res) => {
  const recordId = req.params.record_id;
  const { record_date, record_type, description } = req.body;

  try {
    const query = `
      UPDATE health_records 
      SET record_date = ?, record_type = ?, description = ?
      WHERE record_id = ?
    `;
    const [result, fields] = await pool.query(query, [record_date, record_type, description, recordId]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Health record not found' });
    } else {
      res.json({ message: 'Health record updated successfully' });
    }
  } catch (error) {
    console.error('Error updating health record:', error);
    res.status(500).json({ error: 'An error occurred while updating the health record' });
  }
});

// Example: Define a PUT route to update a health record by record_id
app.put('/api/familymember/:member_id', async (req, res) => {
  const member_id = req.params.member_id;
  const { first_name, last_name, date_of_birth, gender, relationship } = req.body;

  try {
    // Update the family member record in the database
    const query = `
      UPDATE familymember 
      SET first_name = ?, last_name = ?, date_of_birth = ?, gender = ?, relationship = ?
      WHERE member_id = ?
    `;
    const [result, fields] = await pool.query(query, [first_name, last_name, date_of_birth, gender, relationship, member_id]);

    // Check if the update affected any rows
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    // Fetch the updated family member record from the database
    const fetchQuery = 'SELECT * FROM familymember WHERE member_id = ?';
    const [updatedMember, _] = await pool.query(fetchQuery, [member_id]);

    // Respond with the updated family member record
    res.json({ message: 'Family member updated successfully', member: updatedMember[0] });
  } catch (error) {
    console.error('Error updating family member:', error);
    res.status(500).json({ error: 'An error occurred while updating the family member' });
  }
});

// Example: Define a PUT route to update a health record by record_id
app.put('/api/medications/:medication_id', async (req, res) => {
  const medication_id = req.params.medication_id; // Corrected parameter name
  const { medication_name, dosage, frequency } = req.body;

  console.log("Received data:", medication_name, dosage, frequency);

  try {
    // Perform database update using async/await
    const result = await pool.query(
      'UPDATE medications SET medication_name = ?, dosage = ?, frequency = ? WHERE medication_id = ?',
      [medication_name, dosage, frequency, medication_id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Medication record not found' });
    } else {
      res.json({ message: 'Medication record updated successfully' });
    }
  } catch (error) {
    console.error('Error updating medication record:', error);
    res.status(500).json({ error: 'An error occurred while updating the Medication record' });
  }
});



// Example: Define a PUT route to update a appointment record by record_id
app.put('/api/appointments/:appointment_id', async (req, res) => {
  const appointment_id = req.params.appointment_id; // Corrected parameter name
  const { appointment_date, provider_name, purpose } = req.body;

  console.log("Received data:", appointment_date, provider_name, purpose);

  try {
    // Perform database update using async/await
    const query = `
      UPDATE appointments 
      SET appointment_date = ?, provider_name = ?, purpose = ?
      WHERE appointment_id = ?
    `;
    const [result, fields] = await pool.query(query, [appointment_date, provider_name, purpose, appointment_id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Appointment record not found' });
    } else {
      res.json({ message: 'Appointment record updated successfully' });
    }
  } catch (error) {
    console.error('Error updating Appointment record:', error);
    res.status(500).json({ error: 'An error occurred while updating the Appointment record' });
  }
});



// app.put('/api/healthrecords/:record_id', (req, res) => {
//   const { record_id } = req.params;
//   const { record_date, record_type, description } = req.body;

//   console.log("Received record_id:", record_id);
//   console.log("Received record_date:", record_date);
//   console.log("Received record_type:", record_type);
//   console.log("Received description:", description);

//   // Your logic to update the health record based on received data

//   res.json({ message: 'Health record updated successfully' });
// });

// Add a new family member
app.post('/api/familymember', (req, res, next) => {
  const { first_name, last_name, date_of_birth, gender, relationship } = req.body;

  // Basic validation
  if (!first_name || !last_name || !date_of_birth || !gender) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO familymember 
    (first_name, last_name, date_of_birth, gender, relationship) 
    VALUES (?, ?, ?, ?, ?)
  `;
  pool.query(
    query,
    [first_name, last_name, date_of_birth, gender, relationship],
    (error, result) => {
      if (error) {
        console.error('Error adding family member:', error);
        res.status(500).json({ error: 'An error occurred while adding the family member' });
      } else {
        res.status(201).json({ message: 'Family member added successfully', id: result.insertId });
      }
    }
  );
});

// Get all health records
app.get('/api/healthrecords', async(req, res, next) => {
  const query = 'SELECT * FROM health_records';
  await pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching health records:', error);
      res.status(500).json({ error: 'An error occurred while fetching health records' });
    } else {
      res.json(results);
    }
  });
});

// Get health records for a specific family member
app.get('/api/healthrecords/:member_id', async (req, res) => {
  const { member_id } = req.params;

  try {
    const query = 'SELECT * FROM health_records WHERE member_id = ?';
    const [results, fields] = await pool.query(query, [member_id]);

    res.json(results);
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ error: 'An error occurred while fetching health records' });
  }
});

// Add a new health record
app.post('/api/healthrecord', (req, res, next) => {
  const { member_id, record_date, record_type, description } = req.body;

  // Basic validation
  if (!member_id || !record_date || !record_type) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO health_records 
    (member_id, record_date, record_type, description) 
    VALUES (?, ?, ?, ?)
  `;
  pool.query(
    query,
    [member_id, record_date, record_type, description],
    (error, result) => {
      if (error) {
        console.error('Error adding health record:', error);
        res.status(500).json({ error: 'An error occurred while adding the health record' });
      } else {
        res.status(201).json({ message: 'Health record added successfully', id: result.insertId });
      }
    }
  );
});

// Get all medications
app.get('/api/medications', (req, res, next) => {
  const query = 'SELECT * FROM medications';
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching medications:', error);
      res.status(500).json({ error: 'An error occurred while fetching medications' });
    } else {
      res.json(results);
    }
  });
});

// Get medications for a specific family member
app.get('/api/medications/:member_id', async (req, res) => {
  const { member_id } = req.params;
  const query = 'SELECT * FROM medications WHERE member_id = ?';

  try {
    const [results, fields] = await pool.query(query, [member_id]);

    if (results.length === 0) {
      res.status(404).json({ error: 'No medications found for this member' });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ error: 'An error occurred while fetching medications' });
  }
});


// Add a new medication
app.post('/api/medication', (req, res, next) => {
  const { member_id, medication_name, dosage, frequency, start_date, end_date } = req.body;

  // Basic validation
  if (!member_id || !medication_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO medications 
    (member_id, medication_name, dosage, frequency, start_date, end_date) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  pool.query(
    query,
    [member_id, medication_name, dosage, frequency, start_date, end_date],
    (error, result) => {
      if (error) {
        console.error('Error adding medication:', error);
        res.status(500).json({ error: 'An error occurred while adding the medication' });
      } else {
        res.status(201).json({ message: 'Medication added successfully', id: result.insertId });
      }
    }
  );
});

// Get all appointments
app.get('/api/appointments', (req, res, next) => {
  const query = 'SELECT * FROM appointments';
  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ error: 'An error occurred while fetching appointments' });
    } else {
      res.json(results);
    }
  });
});

// Get appointments for a specific family member
app.get('/api/appointments/:member_id', async (req, res) => {
  const { member_id } = req.params;
  const query = 'SELECT * FROM appointments WHERE member_id = ?';

  try {
    const [results, fields] = await pool.query(query, [member_id]);

    if (results.length === 0) {
      res.status(404).json({ error: 'No appointments found for this member' });
    } else {
      res.json(results);
    }
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'An error occurred while fetching appointments' });
  }
});


// Add a new appointment
app.post('/api/appointment', (req, res, next) => {
  const { member_id, appointment_date, appointment_time, doctor_name, purpose } = req.body;

  // Basic validation
  if (!member_id || !appointment_date || !appointment_time || !doctor_name) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = `
    INSERT INTO appointments 
    (member_id, appointment_date, appointment_time, doctor_name, purpose) 
    VALUES (?, ?, ?, ?, ?)
  `;
  pool.query(
    query,
    [member_id, appointment_date, appointment_time, doctor_name, purpose],
    (error, result) => {
      if (error) {
        console.error('Error adding appointment:', error);
        res.status(500).json({ error: 'An error occurred while adding the appointment' });
      } else {
        res.status(201).json({ message: 'Appointment added successfully', id: result.insertId });
      }
    }
  );
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
