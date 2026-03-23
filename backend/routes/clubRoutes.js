const express = require('express');
const router = express.Router();
const {
  createClub, getClubs, getPendingClubs, approveClub, rejectClub, getClub, updateClub,
  joinClub, leaveClub, getLeaderboard,
  getJoinRequests, approveJoinRequest, rejectJoinRequest,
  cancelJoinRequest, getMyJoinRequest, getMyPendingClubs
} = require('../controllers/clubController');
const { protect, clubAdmin, admin } = require('../middleware/auth');

router.get('/leaderboard', getLeaderboard);
router.get('/pending', protect, admin, getPendingClubs);
router.get('/my-pending', protect, getMyPendingClubs);
router.get('/', getClubs);
router.get('/:id', getClub);

router.post('/', protect, createClub);
router.put('/:id', protect, clubAdmin, updateClub);
router.put('/:id/approve', protect, admin, approveClub);
router.put('/:id/reject', protect, admin, rejectClub);

// Join/Leave
router.post('/:id/join', protect, joinClub);
router.delete('/:id/join', protect, leaveClub);

// Join requests management
router.get('/:id/my-request', protect, getMyJoinRequest);
router.get('/:id/requests', protect, clubAdmin, getJoinRequests);
router.put('/:id/requests/:requestId/approve', protect, clubAdmin, approveJoinRequest);
router.put('/:id/requests/:requestId/reject', protect, clubAdmin, rejectJoinRequest);
router.delete('/:id/requests', protect, cancelJoinRequest);

module.exports = router;
