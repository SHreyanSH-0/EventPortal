const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, department, yearOfStudy } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }
    if (userExists && !userExists.isVerified) {
      await User.deleteOne({ _id: userExists._id });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await User.create({
      name,
      email,
      password,
      department: department || '',
      yearOfStudy: yearOfStudy || 1,
      verificationToken: hashedToken,
      verificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000)
    });

    const verifyUrl = `http://localhost:5173/verify/${rawToken}`;

    try {
      await sendEmail({
        to: user.email,
        subject: 'Verify your NIT-KKR Connect account',
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
            <h2 style="color:#4f46e5">Welcome, ${user.name}! 🎓</h2>
            <p>Thanks for signing up to <strong>NIT-KKR Connect</strong>. Please verify your email address by clicking the button below.</p>
            <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
            <p style="margin-top:24px;color:#6b7280;font-size:0.875rem">This link expires in <strong>1 hour</strong>. If you did not create this account, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (emailError) {
      console.error('EMAIL ERROR:', emailError.message);
      await User.deleteOne({ _id: user._id });
      return res.status(500).json({ message: emailError.message });
    }

    res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      yearOfStudy: user.yearOfStudy,
      interests: user.interests,
      skills: user.skills,
      profilePicture: user.profilePicture,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.verificationToken = hashedToken;
    user.verificationTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();

    const verifyUrl = `http://localhost:5173/verify/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Resend: Verify your NIT-KKR Connect account',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border-radius:12px;border:1px solid #e5e7eb">
          <h2 style="color:#4f46e5">Verify your email 🔗</h2>
          <p>Here is your new verification link for <strong>NIT-KKR Connect</strong>.</p>
          <a href="${verifyUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#4f46e5;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Verify Email</a>
          <p style="margin-top:24px;color:#6b7280;font-size:0.875rem">This link expires in <strong>1 hour</strong>.</p>
        </div>
      `
    });

    res.json({ message: 'Verification email resent. Please check your inbox.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('clubsJoined', 'name logo category')
      .populate('bookmarkedEvents', 'title date posterImage')
      .populate('eventsAttended', 'title date posterImage');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { name, department, yearOfStudy, skills, interests, profilePicture } = req.body;
    if (name) user.name = name;
    if (department) user.department = department;
    if (yearOfStudy) user.yearOfStudy = yearOfStudy;
    if (skills) user.skills = skills;
    if (interests) user.interests = interests;
    if (profilePicture) user.profilePicture = profilePicture;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, verifyEmail, login, resendVerification, getMe, updateProfile };
