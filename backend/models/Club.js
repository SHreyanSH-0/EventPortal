const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a club name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  logo: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['technical', 'management', 'fine arts and culture', 'Dance_Crew', 'Music_Crew', 'Drama_Crew', 'cultural', 'dramatics', 'photography', 'robotics', 'ai', 'coding', 'hackathon', 'techspardha', 'techfest', 'tech', 'contest', 'sports', 'literary', 'social', 'other'],
    required: true
  },
  events: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactEmail: {
    type: String,
    default: ''
  },
  contactPhone: {
    type: String,
    default: ''
  },
  socialLinks: {
    website: { type: String, default: '' },
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' }
  },
  eventsHosted: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Club', clubSchema);
