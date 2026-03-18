const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Club = require('./models/Club');
const Event = require('./models/Event');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Club.deleteMany({});
    await Event.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin NIT KKR',
      email: 'admin@nitkkr.ac.in',
      password: 'admin123',
      role: 'admin',
      department: 'Computer Engineering',
      yearOfStudy: 4,
      interests: ['AI', 'Coding', 'Hackathon', 'Techspardha'],
      skills: ['JavaScript', 'Python', 'React'],
      isVerified: true,
    });

    // Create student users
    const student1 = await User.create({
      name: 'Aarav Sharma',
      email: 'aarav@nitkkr.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Computer Engineering',
      yearOfStudy: 2,
      interests: ['AI', 'Machine Learning', 'Coding'],
      skills: ['Python', 'TensorFlow'],
      isVerified: true,
    });

    const student2 = await User.create({
      name: 'Priya Patel',
      email: 'priya@nitkkr.ac.in',
      password: 'student123',
      role: 'student',
      department: 'Electronics & Communication',
      yearOfStudy: 3,
      interests: ['Robotics', 'IoT', 'Workshop'],
      skills: ['Arduino', 'C++'],
      isVerified: true,
    });

    // Create club admins
    const clubAdmin1 = await User.create({
      name: 'Rahul Verma',
      email: 'rahul@nitkkr.ac.in',
      password: 'student123',
      role: 'clubAdmin',
      department: 'Computer Engineering',
      yearOfStudy: 3,
      interests: ['Coding', 'Hackathon', 'AI'],
      isVerified: true,
    });

    const clubAdmin2 = await User.create({
      name: 'Sneha Gupta',
      email: 'sneha@nitkkr.ac.in',
      password: 'student123',
      role: 'clubAdmin',
      department: 'Humanities & Social Sciences',
      yearOfStudy: 2,
      interests: ['Dance', 'Music', 'Drama'],
      isVerified: true,
    });

    // Create NIT KKR clubs
    const techClub = await Club.create({
      name: 'TechnoByte',
      description: 'GNU/Linux Users Group of NIT Kurukshetra. Promoting open-source culture, competitive programming, and innovative tech projects across campus.',
      category: 'technical',
      admin: clubAdmin1._id,
      members: [clubAdmin1._id, student1._id, admin._id],
      contactEmail: 'glug@nitkkr.ac.in',
      socialLinks: { github: 'https://github.com/glugnitkkr', instagram: 'https://instagram.com/glug_nitkkr' },
      eventsHosted: 8
    });

    const culturalClub = await Club.create({
      name: 'Rhythm & Blues NIT KKR',
      description: 'The cultural heartbeat of NIT Kurukshetra. From classical performances to contemporary fusion, we celebrate art in every form at Confluence.',
      category: 'cultural',
      admin: clubAdmin2._id,
      members: [clubAdmin2._id, student2._id],
      contactEmail: 'culturals@nitkkr.ac.in',
      socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
      eventsHosted: 5
    });

    const sportsClub = await Club.create({
      name: 'Sports Council NIT KKR',
      description: 'Organizing inter-NIT tournaments, Sportotsav, fitness drives, and all sporting events at NIT Kurukshetra. Play hard, win harder!',
      category: 'sports',
      admin: admin._id,
      members: [admin._id, student1._id, student2._id],
      contactEmail: 'sports@nitkkr.ac.in',
      eventsHosted: 6
    });

    const roboticsClub = await Club.create({
      name: 'Robotics Club NIT KKR',
      description: 'Building autonomous robots, drones, and embedded systems. Regular workshops on ROS, Arduino, and competing at national robotics competitions.',
      category: 'technical',
      admin: clubAdmin1._id,
      members: [clubAdmin1._id, student2._id],
      contactEmail: 'robotics@nitkkr.ac.in',
      socialLinks: { github: 'https://github.com/robotics-nitkkr' },
      eventsHosted: 4
    });

    const literaryClub = await Club.create({
      name: 'The Literary Society NIT KKR',
      description: 'Poetry slams, open mics, debates, MUNs, and creative writing workshops. Express yourself through words at NIT Kurukshetra.',
      category: 'literary',
      admin: admin._id,
      members: [admin._id],
      contactEmail: 'literary@nitkkr.ac.in',
      eventsHosted: 3
    });

    const ecellClub = await Club.create({
      name: 'E-Cell NIT KKR',
      description: 'The Entrepreneurship Cell of NIT Kurukshetra. Startup mentorship, pitch competitions, speaker sessions, and building the next generation of entrepreneurs.',
      category: 'technical',
      admin: clubAdmin1._id,
      members: [clubAdmin1._id, student1._id],
      contactEmail: 'ecell@nitkkr.ac.in',
      socialLinks: { instagram: 'https://instagram.com/ecell_nitkkr', linkedin: 'https://linkedin.com/company/ecell-nitkkr' },
      eventsHosted: 5
    });

    // Update club admins
    await User.findByIdAndUpdate(clubAdmin1._id, { managedClub: techClub._id });
    await User.findByIdAndUpdate(clubAdmin2._id, { managedClub: culturalClub._id });

    // Create events at NIT Kurukshetra locations
    const now = new Date();
    const events = await Event.insertMany([
      {
        title: 'Techspardha 2026 - Annual Tech Fest',
        description: 'The flagship technical festival of NIT Kurukshetra! 3 days of hackathons, robotics, coding competitions, guest lectures, and exhibitions. Prizes worth ₹10,00,000!',
        date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        time: '09:00 AM',
        location: 'Techspardha Ground',
        coordinates: { lat: 29.9495, lng: 76.8195 },
        club: techClub._id,
        tags: ['Techspardha', 'Tech Fest', 'Hackathon', 'Robotics', 'Coding'],
        category: 'fest',
        maxParticipants: 5000,
        attendees: 1200,
        isTrending: true,
        createdBy: clubAdmin1._id
      },
      {
        title: 'HackNITKKR - 36 Hour Hackathon',
        description: 'A 36-hour hackathon where teams build innovative solutions. Open to all NIT KKR students. Mentorship from alumni at Google, Microsoft, and Amazon. Prizes worth ₹50,000!',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Auditorium (LHC)',
        coordinates: { lat: 29.9468, lng: 76.8175 },
        club: techClub._id,
        tags: ['Hackathon', 'Coding', 'Innovation', 'Prizes'],
        category: 'hackathon',
        maxParticipants: 200,
        attendees: 85,
        registeredUsers: [student1._id],
        isTrending: true,
        createdBy: clubAdmin1._id
      },
      {
        title: 'AI/ML Workshop - Hands-on with PyTorch',
        description: 'Hands-on workshop on building deep learning models using PyTorch. From CNNs to Transformers, build your own model from scratch. Bring your laptops!',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        time: '02:00 PM',
        location: 'Computer Centre',
        coordinates: { lat: 29.9480, lng: 76.8190 },
        club: techClub._id,
        tags: ['AI', 'Machine Learning', 'PyTorch', 'Workshop', 'Deep Learning'],
        category: 'workshop',
        maxParticipants: 60,
        attendees: 42,
        registeredUsers: [student1._id, student2._id],
        createdBy: clubAdmin1._id
      },
      {
        title: 'Confluence 2026 - Cultural Night',
        description: 'NIT Kurukshetra\'s annual cultural festival! Classical dance, western dance, band performances, fashion show, and stand-up comedy. Guest artist: Prateek Kuhad (TBC).',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        time: '05:00 PM',
        location: 'Open Air Theatre (OAT)',
        coordinates: { lat: 29.9475, lng: 76.8195 },
        club: culturalClub._id,
        tags: ['Confluence', 'Cultural Fest', 'Dance', 'Music', 'Drama'],
        category: 'fest',
        maxParticipants: 3000,
        attendees: 600,
        isTrending: true,
        createdBy: clubAdmin2._id
      },
      {
        title: 'Classical Dance Night',
        description: 'An enchanting evening of Bharatanatyam, Kathak, and contemporary fusion by the dance club. Special guest performance.',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        time: '06:30 PM',
        location: 'Open Air Theatre (OAT)',
        coordinates: { lat: 29.9475, lng: 76.8195 },
        club: culturalClub._id,
        tags: ['Dance', 'Classical', 'Cultural', 'Performance'],
        category: 'cultural',
        maxParticipants: 500,
        attendees: 180,
        createdBy: clubAdmin2._id
      },
      {
        title: 'Sportotsav - Inter-NIT Cricket Tournament',
        description: 'The annual inter-NIT T20 cricket tournament. 16 NITs battling for the championship. Come support NIT Kurukshetra\'s team!',
        date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
        time: '08:00 AM',
        location: 'Cricket Ground',
        coordinates: { lat: 29.9515, lng: 76.8160 },
        club: sportsClub._id,
        tags: ['Cricket', 'Sportotsav', 'Inter-NIT', 'Tournament'],
        category: 'sports',
        maxParticipants: 300,
        attendees: 120,
        createdBy: admin._id
      },
      {
        title: 'RoboWars - Combat Robotics',
        description: 'Design and build your combat robot! Categories: Lightweight (5kg), Middleweight (15kg). Arena battles with a live audience. Registration closes in 3 days.',
        date: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Central Workshop',
        coordinates: { lat: 29.9460, lng: 76.8185 },
        club: roboticsClub._id,
        tags: ['Robotics', 'RoboWars', 'Engineering', 'Competition'],
        category: 'technical',
        maxParticipants: 50,
        attendees: 30,
        createdBy: clubAdmin1._id
      },
      {
        title: 'Poetry Slam - Open Mic Night',
        description: 'Express yourself through words. Themes: College Life, Revolution, and Nostalgia. Best poet wins books and merch!',
        date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        time: '07:00 PM',
        location: 'SAC (Student Activity Centre)',
        coordinates: { lat: 29.9482, lng: 76.8168 },
        club: literaryClub._id,
        tags: ['Poetry', 'Open Mic', 'Literature', 'Creative Writing'],
        category: 'cultural',
        maxParticipants: 100,
        attendees: 45,
        createdBy: admin._id
      },
      {
        title: 'Web Dev Bootcamp - MERN Stack',
        description: '3-day intensive bootcamp. Learn MongoDB, Express, React, and Node.js from scratch. Build a full-stack project. By GLUG NIT KKR.',
        date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Lecture Hall Complex (LHC)',
        coordinates: { lat: 29.9472, lng: 76.8180 },
        club: techClub._id,
        tags: ['Web Development', 'React', 'Node.js', 'MERN', 'Bootcamp'],
        category: 'workshop',
        maxParticipants: 80,
        attendees: 72,
        isTrending: true,
        createdBy: clubAdmin1._id
      },
      {
        title: 'Startup Pitch Night - E-Cell',
        description: 'Got a startup idea? Pitch it to a panel of VCs and NIT KKR alumni entrepreneurs. Top 3 ideas win seed funding up to ₹2,00,000. Powered by E-Cell NIT KKR.',
        date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        time: '11:00 AM',
        location: 'Auditorium (LHC)',
        coordinates: { lat: 29.9468, lng: 76.8175 },
        club: ecellClub._id,
        tags: ['Startup', 'Entrepreneurship', 'Pitch', 'E-Cell', 'Funding'],
        category: 'seminar',
        maxParticipants: 150,
        attendees: 65,
        createdBy: clubAdmin1._id
      },
      {
        title: 'Morning Yoga & Fitness Drive',
        description: 'Start your day with yoga and guided meditation at the sports complex. Open to all students and faculty. Mats provided.',
        date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        time: '06:00 AM',
        location: 'Sports Complex',
        coordinates: { lat: 29.9510, lng: 76.8170 },
        club: sportsClub._id,
        tags: ['Yoga', 'Fitness', 'Wellness', 'Morning'],
        category: 'sports',
        maxParticipants: 80,
        attendees: 35,
        createdBy: admin._id
      },
      {
        title: 'Linux Install Fest',
        description: 'GLUG\'s signature event! Free Linux installation, troubleshooting, and a crash course on terminal, Git, and open-source contribution. Beginners welcome!',
        date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        time: '03:00 PM',
        location: 'Computer Centre',
        coordinates: { lat: 29.9480, lng: 76.8190 },
        club: techClub._id,
        tags: ['Linux', 'Open Source', 'Git', 'GLUG', 'Beginner Friendly'],
        category: 'workshop',
        maxParticipants: 100,
        attendees: 55,
        createdBy: clubAdmin1._id
      }
    ]);

    // Update clubs with event references
    const allClubs = [techClub, culturalClub, sportsClub, roboticsClub, literaryClub, ecellClub];
    for (const club of allClubs) {
      const clubEvents = events.filter(e => e.club.toString() === club._id.toString());
      await Club.findByIdAndUpdate(club._id, { events: clubEvents.map(e => e._id) });
    }

    console.log('✅ Database seeded successfully for NIT Kurukshetra!');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('  Admin:      admin@nitkkr.ac.in / admin123');
    console.log('  Club Admin: rahul@nitkkr.ac.in / student123');
    console.log('  Student:    aarav@nitkkr.ac.in / student123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
