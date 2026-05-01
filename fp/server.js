const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/event_management';
const ADMIN_CREDENTIALS = { name: 'geethu', id: '200721', password: '2123' };
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'geethu-admin-token-2123';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'fp.html')));

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  event: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(error => {
  console.error('MongoDB connection error:', error.message);
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, event } = req.body;
    if (!name || !email || !event) {
      return res.status(400).json({ error: 'Name, email, and event are required.' });
    }

    const student = new Student({ name, email, event });
    await student.save();

    res.status(201).json({ message: 'Student registered successfully.', student });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'This email is already registered.' });
    }
    console.error(error);
    res.status(500).json({ error: 'Unable to register student.' });
  }
});

app.post('/api/admin/login', (req, res) => {
  const { id, password } = req.body;
  if (id === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
    return res.json({ token: ADMIN_TOKEN, name: ADMIN_CREDENTIALS.name });
  }
  res.status(401).json({ error: 'Invalid admin credentials.' });
});

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }
  next();
}

app.get('/api/students', verifyAdmin, async (req, res) => {
  try {
    const students = await Student.find().sort({ registeredAt: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch registered students.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fp.html', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
