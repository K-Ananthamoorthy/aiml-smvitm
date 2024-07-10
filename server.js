const express = require('express');
const app = express();
const path = require('path');

// Load environment variables from a .env file
require('dotenv').config();

app.use(express.static(path.join(__dirname, 'public')));

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// Route to serve the Firebase configuration securely
app.get('/auth-config', (req, res) => {
  res.json(firebaseConfig);
});

app.get('/1', (req ,res) => {
  res.sendFile(path.join(__dirname, 'public/ml-lab/1.html'));
})

app.get('/2', (req ,res) => {
  res.sendFile(path.join(__dirname, 'public/ml-lab/2.html'));
})

app.get('/3', (req ,res) => {
  res.sendFile(path.join(__dirname, 'public/ml-lab/3.html'));
})

// Serve your static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
