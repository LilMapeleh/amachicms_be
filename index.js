const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// In-memory queue
let queue = [
    // Sample initial data (optional, for testing)
    // { id: uuidv4(), name: "Sivalingam", partySize: 2, joinedAt: new Date(Date.now() - 5 * 60000), phoneNumber: "123" },
    // { id: uuidv4(), name: "Maya Haris", partySize: 4, joinedAt: new Date(Date.now() - 4 * 60000), phoneNumber: "456" },
];

// --- API Endpoints ---

// GET current queue
app.get('/api/queue', (req, res) => {
    // Sort by oldest first
    const sortedQueue = [...queue].sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
    res.json(sortedQueue);
});

// POST to join queue
app.post('/api/queue', (req, res) => {
    const { name, phoneNumber, partySize } = req.body;

    if (!name || !phoneNumber || !partySize) {
        return res.status(400).json({ message: 'Name, phone number, and party size are required.' });
    }
    if (isNaN(parseInt(partySize)) || parseInt(partySize) <= 0) {
        return res.status(400).json({ message: 'Party size must be a positive number.' });
    }

    const newEntry = {
        id: uuidv4(),
        name,
        phoneNumber,
        partySize: parseInt(partySize),
        joinedAt: new Date()
    };
    queue.push(newEntry);
    console.log('Added to queue:', newEntry);
    res.status(201).json(newEntry);
});

// DELETE to serve (remove) from queue
app.delete('/api/queue/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = queue.length;
    queue = queue.filter(entry => entry.id !== id);

    if (queue.length < initialLength) {
        console.log('Served and removed from queue, ID:', id);
        res.status(200).json({ message: 'Successfully served and removed from queue.' });
    } else {
        res.status(404).json({ message: 'Entry not found in queue.' });
    }
});

// REMOVE THIS DUPLICATE
/*
app.get('/api/queue', (req, res) => {
    // Sort by oldest first (based on when they joined)
    const sortedQueue = [...queue].sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
    res.json(sortedQueue); // Send the sorted queue back as a JSON response
});
*/

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});





