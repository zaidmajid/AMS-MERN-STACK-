const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Attendance = require('./StuAttendance'); // Adjusted import for StuAttendance

// Define the student schema
const studentSchema = new Schema({
  name: { type: String, required: true },
  rollNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  attendance: [{ type: Schema.Types.ObjectId, ref: 'Attendance' }], // Assuming Attendance is referenced by ObjectId
  leaveRequests: [{
    reason: String,
    requestedDate: { type: Date, default: Date.now }
  }]
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
