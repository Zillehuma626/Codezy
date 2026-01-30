import mongoose from 'mongoose';

const InstitutionSchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
    unique: true, // INST_123
    index: true
  },

  type: {
    type: String,
    enum: ['institution', 'individual'],
    required: true
  },

  name: {
    type: String,
    required: true
  },

  adminEmail: {
    type: String,
    required: true
  },
  
  password: {
    type: String,
    required: true,
    select: false
  },
  contactPhone: String,

  subscription: {
    plan: {
      type: String, // free, pro, enterprise
      default: 'free'
    },
    status: {
      type: String, // active, cancelled, trial
      default: 'active'
    },
    startedAt: Date,
    expiresAt: Date
  },

  limits: {
    maxStudents: Number,
    maxTeachers: Number,
    maxCourses: Number
  },

  metadata: {
    country: String,
    timezone: String,
    industry: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
const Institution = mongoose.model('Institution', InstitutionSchema);
export default Institution;