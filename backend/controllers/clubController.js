const Club = require('../models/Club');
const User = require('../models/User');
const JoinRequest = require('../models/JoinRequest');

// @desc    Create club
// @route   POST /api/clubs
const createClub = async (req, res) => {
  try {
    const { name, description, logo, category, contactEmail, contactPhone, socialLinks } = req.body;
    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ message: 'Club already exists' });
    }
    const club = await Club.create({
      name,
      description,
      logo: logo || '',
      category,
      admin: req.user._id,
      contactEmail: contactEmail || '',
      contactPhone: contactPhone || '',
      socialLinks: socialLinks || {},
      members: [req.user._id]
    });

    await User.findByIdAndUpdate(req.user._id, {
      role: 'clubAdmin',
      managedClub: club._id,
      $push: { clubsJoined: club._id }
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
const getClubs = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const clubs = await Club.find(query)
      .populate('admin', 'name email')
      .sort({ eventsHosted: -1 });
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
const getClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('admin', 'name email')
      .populate('events')
      .populate('members', 'name email department');
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update club
// @route   PUT /api/clubs/:id
const updateClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    if (club.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request to join club (sends request to club admin)
// @route   POST /api/clubs/:id/join
const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if already a member
    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    // Check if there's already a pending request
    const existingRequest = await JoinRequest.findOne({
      user: req.user._id,
      club: req.params.id,
      status: 'pending'
    });
    if (existingRequest) {
      return res.status(400).json({ message: 'You already have a pending request for this club' });
    }

    // Create join request
    const joinRequest = await JoinRequest.create({
      user: req.user._id,
      club: req.params.id,
      message: req.body.message || ''
    });

    // Add notification to club admin
    await User.findByIdAndUpdate(club.admin, {
      $push: {
        notifications: {
          message: `${req.user.name} has requested to join ${club.name}`,
          read: false,
          createdAt: new Date()
        }
      }
    });

    res.status(201).json({ message: 'Join request sent successfully! Awaiting admin approval.', request: joinRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave club
// @route   DELETE /api/clubs/:id/join
const leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    club.members = club.members.filter(id => id.toString() !== req.user._id.toString());
    await club.save();
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { clubsJoined: club._id }
    });
    res.json({ message: 'Left club successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get join requests for a club (club admin only)
// @route   GET /api/clubs/:id/requests
const getJoinRequests = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Only club admin or super admin can view requests
    if (club.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status } = req.query;
    let query = { club: req.params.id };
    if (status) query.status = status;

    const requests = await JoinRequest.find(query)
      .populate('user', 'name email department yearOfStudy skills interests profilePicture')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve join request
// @route   PUT /api/clubs/:id/requests/:requestId/approve
const approveJoinRequest = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Only club admin or super admin can approve
    if (club.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const joinRequest = await JoinRequest.findById(req.params.requestId).populate('user', 'name');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found' });
    }
    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request has already been ${joinRequest.status}` });
    }

    // Update request status
    joinRequest.status = 'approved';
    joinRequest.reviewedBy = req.user._id;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save();

    // Add user to club members
    if (!club.members.includes(joinRequest.user._id)) {
      club.members.push(joinRequest.user._id);
      await club.save();
    }

    // Add club to user's joined clubs
    await User.findByIdAndUpdate(joinRequest.user._id, {
      $addToSet: { clubsJoined: club._id }
    });

    // Notify the user
    await User.findByIdAndUpdate(joinRequest.user._id, {
      $push: {
        notifications: {
          message: `Your request to join ${club.name} has been approved! 🎉`,
          read: false,
          createdAt: new Date()
        }
      }
    });

    res.json({ message: 'Join request approved successfully', request: joinRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject join request
// @route   PUT /api/clubs/:id/requests/:requestId/reject
const rejectJoinRequest = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Only club admin or super admin can reject
    if (club.admin.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const joinRequest = await JoinRequest.findById(req.params.requestId).populate('user', 'name');
    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found' });
    }
    if (joinRequest.status !== 'pending') {
      return res.status(400).json({ message: `Request has already been ${joinRequest.status}` });
    }

    // Update request status
    joinRequest.status = 'rejected';
    joinRequest.reviewedBy = req.user._id;
    joinRequest.reviewedAt = new Date();
    await joinRequest.save();

    // Notify the user
    await User.findByIdAndUpdate(joinRequest.user._id, {
      $push: {
        notifications: {
          message: `Your request to join ${club.name} was not approved.`,
          read: false,
          createdAt: new Date()
        }
      }
    });

    res.json({ message: 'Join request rejected', request: joinRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a pending join request (by the user)
// @route   DELETE /api/clubs/:id/requests
const cancelJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findOneAndDelete({
      user: req.user._id,
      club: req.params.id,
      status: 'pending'
    });
    if (!request) {
      return res.status(404).json({ message: 'No pending request found' });
    }
    res.json({ message: 'Join request cancelled' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user's join request status for a club
// @route   GET /api/clubs/:id/my-request
const getMyJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findOne({
      user: req.user._id,
      club: req.params.id
    }).sort({ createdAt: -1 });

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get club leaderboard (most active)
// @route   GET /api/clubs/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const clubs = await Club.find({ isActive: true })
      .select('name logo category eventsHosted members')
      .sort({ eventsHosted: -1 })
      .limit(10);
    const leaderboard = clubs.map((club, index) => ({
      rank: index + 1,
      _id: club._id,
      name: club.name,
      logo: club.logo,
      category: club.category,
      eventsHosted: club.eventsHosted,
      memberCount: club.members.length
    }));
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClub, getClubs, getClub, updateClub,
  joinClub, leaveClub, getLeaderboard,
  getJoinRequests, approveJoinRequest, rejectJoinRequest,
  cancelJoinRequest, getMyJoinRequest
};
