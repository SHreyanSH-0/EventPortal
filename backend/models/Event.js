const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add an event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  date: {
    type: Date,
    required: [true, 'Please add a date']
  },
  endDate: {
    type: Date
  },
  time: {
    type: String,
    required: [true, 'Please add event time']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  coordinates: {
    lat: { type: Number, default: 28.6139 },
    lng: { type: Number, default: 77.2090 }
  },
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Club',
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    enum: ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'hackathon', 'fest', 'contest', 'other'],
    required: true
  },
  posterImage: {
    type: String,
    default: ''
  },
  registrationLink: {
    type: String,
    default: ''
  },
  maxParticipants: {
    type: Number,
    default: 100
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  interestedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendees: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  qrCode: {
    type: String,
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.date > new Date();
});

// Update trending status based on registrations
eventSchema.methods.updateTrending = function() {
  this.isTrending = this.registeredUsers.length > 10;
  return this.save();
};

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
