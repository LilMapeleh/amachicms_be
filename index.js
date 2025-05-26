const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let waitingList = [];
let servingNow = [];

// Join queue
app.post('/api/join', (req, res) => {
  const { name, phone, partySize } = req.body;

  if (!name || !phone || !partySize) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  const customer = {
    id: Date.now().toString(),
    name,
    phone,
    partySize,
    timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }), // "14:55:02"

  };

  waitingList.push(customer);
  res.json({ message: 'Customer added to queue', customer });
});

// Get waiting list
app.get('/api/waiting-list', (req, res) => {
  const sortedList = waitingList.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  res.json(sortedList);
});

// Serve a customer
app.post('/api/serve/:id', (req, res) => {
  const { id } = req.params;
  const index = waitingList.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Customer not found' });
  }

  const customer = waitingList.splice(index, 1)[0];
  servingNow.push(customer);

  // Placeholder: Send WhatsApp notification here
  console.log(`WhatsApp: Notifying ${customer.phone} they are now being served`);

  res.json({ message: 'Customer moved to serving', customer });
});

// Get serving now list
app.get('/api/serving-now', (req, res) => {
  res.json(servingNow);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
