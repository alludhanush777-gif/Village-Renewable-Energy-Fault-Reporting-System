const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const AuditLog = require('./models/AuditLog');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Enterprise Auditing

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected: Sentinel Operational'))
  .catch(err => console.error('Database Connection Breach:', err));

const authRoutes = require('./routes/authRoutes');
const faultRoutes = require('./routes/faultRoutes');
const { startSimulator } = require('./services/iotSimulator');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/faults', faultRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Sentinel Core Online', version: '1.0.0' });
});

// Start IoT Simulator
startSimulator();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sentinel Command listening on port ${PORT}`));
