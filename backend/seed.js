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
    const allClubs = [
      await Club.create({
        name: 'MAD',
        description: 'Management club of NIT Kurukshetra. Every event you see in campus is managed by us.',
        category: 'management',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student1._id, admin._id],
        contactEmail: 'glug@nitkkr.ac.in',
        socialLinks: { github: 'https://github.com/glugnitkkr', instagram: 'https://instagram.com/glug_nitkkr' },
        eventsHosted: 8
      }),

      await Club.create({
        name: 'TechnoByte',
        description: 'Technical club of NIT Kurukshetra. Organises Techspardha - Techfest of NIT KKR.',
        category: 'technical',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student1._id, admin._id],
        contactEmail: 'glug@nitkkr.ac.in',
        socialLinks: { github: 'https://github.com/glugnitkkr', instagram: 'https://instagram.com/glug_nitkkr' },
        eventsHosted: 8
      }),

      await Club.create({
        name: 'OCD',
        description: 'Coding club of NIT Kurukshetra. Promoting competitive programming, and awareness for ICPC across campus.',
        category: 'technical',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student1._id, admin._id],
        contactEmail: 'glug@nitkkr.ac.in',
        socialLinks: { github: 'https://github.com/glugnitkkr', instagram: 'https://instagram.com/glug_nitkkr' },
        eventsHosted: 8
      }),

      await Club.create({
        name: 'Spic Mcc',
        description: 'A cultural society at NIT Kurukshetra dedicated to promoting Indian classical music, dance, and heritage through enriching performances and workshops.',
        category: 'fine arts and culture',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'Anamika',
        description: 'The Hindi Literature Society of NIT Kurukshetra that encourages creative expression through poetry, storytelling, debates, and literary discussions in Hindi.',
        category: 'fine arts and culture',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'literary@nitkkr.ac.in',
        eventsHosted: 4
      }),

      await Club.create({
        name: 'Fine Arts & Modelling Club',
        description: 'An arts-focused club at NIT Kurukshetra that promotes creativity through sketching, painting, crafting, and modelling, providing a platform for artistic expression.',
        category: 'fine arts and culture',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'arts@nitkkr.ac.in',
        eventsHosted: 4
      }),

      await Club.create({
        name: 'LSD',
        description: 'The dance crew of NIT Kurukshetra.',
        category: 'Dance_Crew',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'SUC',
        description: 'They call it dance, we call it life.',
        category: 'Dance_Crew',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'NBC',
        description: 'The cultural heartbeat of NIT Kurukshetra. From classical performances to contemporary fusion, we celebrate art in every form at Confluence.',
        category: 'Dance_Crew',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'Freaks',
        description: 'The dramatics and theatre club of NIT Kurukshetra, focusing on stage plays, street theatre, and creative performances. It nurtures acting, direction, and storytelling skills through impactful productions.',
        category: 'dramatics',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'Ahwaan',
        description: 'A theatre and dramatics society at NIT Kurukshetra known for powerful stage performances, street plays, and socially relevant storytelling. It provides a platform for students to explore acting and creative expression.',
        category: 'dramatics',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'Swingers',
        description: 'A vibrant dramatics club of NIT Kurukshetra that brings stories to life through theatre, street plays, and stage performances. It encourages creativity, teamwork, and expressive storytelling.',
        category: 'dramatics',
        admin: clubAdmin2._id,
        members: [clubAdmin2._id, student2._id],
        contactEmail: 'culturals@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/confluence_nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'EMR',
        description: 'Building autonomous robots, drones, and embedded systems. Regular workshops on ROS, Arduino, and competing at national robotics competitions.',
        category: 'technical',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student2._id],
        contactEmail: 'robotics@nitkkr.ac.in',
        socialLinks: { github: 'https://github.com/robotics-nitkkr' },
        eventsHosted: 4
      }),

      await Club.create({
        name: 'ELAD',
        description: 'Poetry slams, open mics, debates, MUNs, and creative writing workshops. Express yourself through words at NIT Kurukshetra.',
        category: 'literary',
        admin: admin._id,
        members: [admin._id],
        contactEmail: 'literary@nitkkr.ac.in',
        eventsHosted: 3
      }),

      await Club.create({
        name: 'HLAD',
        description: 'Hindi Club of NIT Kurukshetra that promotes Hindi language and literature through poetry, debates, storytelling, dramatics, and cultural events. It provides a platform for students to express themselves and celebrate Indian linguistic heritage.',
        category: 'literary',
        admin: admin._id,
        members: [admin._id],
        contactEmail: 'literary@nitkkr.ac.in',
        eventsHosted: 3
      }),

      await Club.create({
        name: 'E-Cell',
        description: 'The Entrepreneurship Cell of NIT Kurukshetra. Startup mentorship, pitch competitions, speaker sessions, and building the next generation of entrepreneurs.',
        category: 'technical',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student1._id],
        contactEmail: 'ecell@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/ecell_nitkkr', linkedin: 'https://linkedin.com/company/ecell-nitkkr' },
        eventsHosted: 5
      }),

      await Club.create({
        name: 'I-Cell',
        description: 'The Innovation Cell of NIT Kurukshetra. Startup mentorship, pitch competitions, speaker sessions, and building the next generation of entrepreneurs.',
        category: 'technical',
        admin: clubAdmin1._id,
        members: [clubAdmin1._id, student1._id],
        contactEmail: 'icell@nitkkr.ac.in',
        socialLinks: { instagram: 'https://instagram.com/icell_nitkkr', linkedin: 'https://linkedin.com/company/ecell-nitkkr' },
        eventsHosted: 5
      }),
    ];

    // Approve all seeded clubs
    await Club.updateMany({}, { status: 'approved' });

    // Update club admins
    await User.findByIdAndUpdate(clubAdmin1._id, { managedClub: allClubs[0]._id });
    await User.findByIdAndUpdate(clubAdmin2._id, { managedClub: allClubs[1]._id });

    // Automatically derive clubsJoined for everyone
    const allUsers = [admin, student1, student2, clubAdmin1, clubAdmin2];
    for (const u of allUsers) {
      const userClubs = allClubs.filter(c => c.members.some(m => m.toString() === u._id.toString())).map(c => c._id);
      if (userClubs.length > 0) {
        await User.findByIdAndUpdate(u._id, { $addToSet: { clubsJoined: { $each: userClubs } } });
      }
    }

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
        club: allClubs[0]._id,
        tags: ['Techspardha', 'Tech Fest', 'Hackathon', 'Robotics', 'Coding'],
        category: 'fest',
        maxParticipants: 5000,
        attendees: 1200,
        isTrending: true,
        createdBy: clubAdmin1._id
      },
      {
        title: 'Hackshetra - 24 Hour Hackathon',
        description: 'A 24-hour hackathon where teams build innovative solutions. Open to all NIT KKR students. Mentorship from alumni at Google, Microsoft, and Amazon. Prizes worth ₹50,000!',
        date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        time: '10:00 AM',
        location: 'Auditorium (LHC)',
        coordinates: { lat: 29.9468, lng: 76.8175 },
        club: allClubs[0]._id,
        tags: ['Hackathon', 'Coding', 'Innovation', 'Prizes'],
        category: 'hackathon',
        maxParticipants: 200,
        attendees: 85,
        registeredUsers: [student1._id],
        isTrending: true,
        createdBy: clubAdmin1._id
      },
      {
        title: 'Coderun',
        description: 'Offline Coding Contest with live leaderboard.',
        date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        time: '02:00 PM',
        location: 'Computer Centre',
        coordinates: { lat: 29.9480, lng: 76.8190 },
        club: allClubs[0]._id,
        tags: ['CP', 'Technobyte'],
        category: 'contest',
        maxParticipants: 60,
        attendees: 42,
        registeredUsers: [student1._id, student2._id],
        createdBy: clubAdmin1._id
      },
      {
        title: 'Citius',
        description: 'NIT Kurukshetra\'s annual sports festival!',
        date: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
        time: '05:00 PM',
        location: 'Open Air Theatre (OAT)',
        coordinates: { lat: 29.9475, lng: 76.8195 },
        club: allClubs[0]._id,
        tags: ['Confluence', 'Cultural Fest', 'Dance', 'Music', 'Drama'],
        category: 'fest',
        maxParticipants: 3000,
        attendees: 600,
        isTrending: true,
        createdBy: clubAdmin2._id
      },
      {
        title: 'DJ Night',
        description: 'An enchanting evening.',
        date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        time: '06:30 PM',
        location: 'Open Air Theatre (OAT)',
        coordinates: { lat: 29.9475, lng: 76.8195 },
        club: allClubs[1]._id,
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
        club: allClubs[3]._id,
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
        club: allClubs[0]._id,
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
        club: allClubs[0]._id,
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
        club: allClubs[0]._id,
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
        club: allClubs[0]._id,
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
        club: allClubs[0]._id,
        tags: ['Yoga', 'Fitness', 'Wellness', 'Morning'],
        category: 'sports',
        maxParticipants: 80,
        attendees: 35,
        createdBy: admin._id
      }
    ]);

    // Update clubs with event references
    // const allClubs = [techClub, culturalClub, sportsClub, roboticsClub, literaryClub, ecellClub];
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
