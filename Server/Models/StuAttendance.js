const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the attendance schema
const attendanceSchema = new Schema({
  rollNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  records: [{
    isPresent: { type: Boolean, required: true },
    isLeave: { type: Boolean, default: false },
    leaveReason: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

// Create the Attendance model
const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
