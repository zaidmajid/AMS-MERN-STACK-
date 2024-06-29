const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./middleware/authMiddleware');
const Employee = require('./models/Employee');
const Student = require('./models/Student');
const Attendance = require('./models/StuAttendance'); // Ensure correct path and filename

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://localhost:27017/employee', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Registration endpoint
app.post('/register', async (req, res) => {
  const { name, email, password, role, rollNumber } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser;

    if (role === 'admin') {
      newUser = new Employee({ name, email, password: hashedPassword });
    } else {
      newUser = new Student({ name, rollNumber, email, password: hashedPassword });
    }

    await newUser.save();
    res.status(200).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    if (role === 'admin') {
      user = await Employee.findOne({ email });
    } else {
      user = await Student.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user._id, role }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ success: true, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Fetch all attendance records endpoint
app.get('/api/attendance', async (req, res) => {
  const { date, rollNumber } = req.query;
  let filter = {};

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    filter.date = { $gte: start, $lte: end };
  }

  if (rollNumber) {
    filter.rollNumber = rollNumber;
  }

  try {
    const attendanceRecords = await Attendance.find(filter);
    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch attendance records for a specific student
app.get('/api/student/attendance', verifyToken, async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).populate('attendance');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.status(200).json(student.attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark attendance record endpoint
app.post('/markAttendance', async (req, res) => {
  const { rollNumber, isPresent } = req.body;

  try {
    // Check if the student has already marked attendance in the last 24 hours
    const lastAttendance = await Attendance.findOne({
      rollNumber,
      date: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within the last 24 hours
    });

    if (lastAttendance) {
      return res.status(400).json({ message: 'Cannot mark attendance more than once in 24 hours' });
    }

    const attendanceRecord = new Attendance({
      rollNumber,
      records: [{ isPresent }],
      date: new Date(),
    });

    await attendanceRecord.save();

    res.status(200).json({ message: 'Attendance marked successfully', attendanceRecord });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

// Request leave endpoint
app.post('/requestLeave', async (req, res) => {
  const { rollNumber, reason } = req.body;

  try {
    // Find the student by rollNumber
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Find or create the attendance record for the current date and student
    let attendanceRecord = await Attendance.findOneAndUpdate(
      { rollNumber, date: { $gte: new Date().setHours(0, 0, 0, 0) } },
      {
        $push: {
          records: {
            isLeave: true,
            leaveReason: reason,
          },
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Leave requested successfully' });
  } catch (err) {
    console.error('Error requesting leave:', err);
    res.status(500).json({ message: 'Failed to request leave' });
  }
});

// Delete attendance record endpoint
app.delete('/api/attendance/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await Attendance.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({ error: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    console.error('Error deleting attendance record:', err);
    res.status(500).json({ error: 'Failed to delete attendance record' });
  }
});

// Update admin profile endpoint
app.put('/updateProfile', verifyToken, upload.single('image'), async (req, res) => {
  const { name, email } = req.body;
  const updateData = { name, email };

  if (req.file) {
    updateData.image = req.file.path; // Include the image path if a new image is uploaded
  }

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.user.id, updateData, { new: true });

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully', updatedEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// Fetch all students endpoint
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}, 'name email rollNumber');
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch total count of students endpoint
app.get('/api/students/count', async (req, res) => {
  try {
    const count = await Student.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching student count:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
