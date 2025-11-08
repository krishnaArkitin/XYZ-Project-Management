require('dotenv').config(); // Load .env from current directory
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Conversation = require('../models/Conversation');
const Meeting = require('../models/Meeting');
const bcrypt = require('bcryptjs'); // For hashing mock passwords

connectDB();

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Project.deleteMany();
    await Conversation.deleteMany();
    await Meeting.deleteMany();

    console.log('Existing data cleared.');

    // Create users
    const clientPassword = await bcrypt.hash('password123', 10);
    const adminPassword = await bcrypt.hash('admin123', 10);
    const vendorPassword = await bcrypt.hash('vendor123', 10);

    const users = await User.insertMany([
      { name: 'John Doe', email: 'john.doe@example.com', password: clientPassword, role: 'Client', avatarUrl: 'https://picsum.photos/seed/client/200' },
      { name: 'Admin User', email: 'admin@xyz.com', password: adminPassword, role: 'Admin', avatarUrl: 'https://picsum.photos/seed/admin/200' },
      { name: 'Innovate Solutions', email: 'contact@innovate.com', password: vendorPassword, role: 'Vendor', avatarUrl: 'https://picsum.photos/seed/vendor/200' },
      { name: 'Client Two', email: 'client2@example.com', password: clientPassword, role: 'Client', avatarUrl: 'https://picsum.photos/seed/client2/200' },
      { name: 'Vendor Two', email: 'vendor2@solutions.com', password: vendorPassword, role: 'Vendor', avatarUrl: 'https://picsum.photos/seed/vendor2/200' },
    ]);

    const client1 = users.find(u => u.email === 'john.doe@example.com');
    const admin1 = users.find(u => u.email === 'admin@xyz.com');
    const vendor1 = users.find(u => u.email === 'contact@innovate.com');
    const client2 = users.find(u => u.email === 'client2@example.com');
    const vendor2 = users.find(u => u.email === 'vendor2@solutions.com');

    console.log('Users seeded.');

    // Create projects
    const projects = await Project.insertMany([
      {
        title: 'New IoT Device',
        category: 'IoT',
        description: 'A new smart home device.',
        status: 'In Progress',
        clientId: client1._id,
        vendorId: vendor1._id,
        expectedTimeline: '3 Months',
        budget: '$50,000 - $75,000',
        files: [{ name: 'Requirements_v2.pdf', url: '#' }, { name: 'Initial_Sketches.zip', url: '#' }],
        timeline: [
          { date: '2024-07-01', title: 'Project Kick-off', description: 'Initial meeting held with all stakeholders.', author: admin1.name },
          { date: '2024-07-15', title: 'Hardware Design Approved', description: 'Designs were finalized and approved.', author: admin1.name },
          { date: '2024-07-25', title: 'Firmware Development Started', description: 'Development has commenced.', author: vendor1.name },
        ],
      },
      {
        title: 'Website Redesign',
        category: 'IT',
        description: 'Complete overhaul of the company website.',
        status: 'Quotation',
        clientId: client1._id,
        expectedTimeline: '2 Months',
        budget: '$20,000',
        timeline: [
          { date: '2024-07-20', title: 'Project Request Received', description: 'Client submitted project details.', author: client1.name },
        ],
        files: [],
      },
      {
        title: 'Manufacturing Process Optimization',
        category: 'Manufacturing',
        description: 'Streamline the production line.',
        status: 'Completed',
        clientId: client2._id,
        vendorId: vendor2._id,
        expectedTimeline: '6 Months',
        budget: '$120,000',
        timeline: [],
        files: [],
      },
      {
        id: '4',
        title: 'Mobile App Development',
        category: 'IT',
        description: 'New app for customer engagement.',
        status: 'Approved',
        clientId: client1._id,
        vendorId: vendor1._id,
        expectedTimeline: '4 Months',
        budget: '$45,000',
        timeline: [],
        files: []
      },
      {
        id: '5',
        title: 'Data Analytics Platform',
        category: 'IT',
        description: 'Build a new BI dashboard.',
        status: 'Requested',
        clientId: client1._id,
        expectedTimeline: '5 Months',
        budget: '$60,000',
        timeline: [],
        files: []
      },
      {
        id: '6',
        title: 'Cloud Infrastructure Migration',
        category: 'IT',
        description: 'Migrate on-premise servers to AWS.',
        status: 'InProgress',
        clientId: client2._id,
        vendorId: vendor1._id,
        expectedTimeline: '2 Months',
        budget: '$30,000',
        timeline: [],
        files: [],
      }
    ]);

    const iotProject = projects.find(p => p.title === 'New IoT Device');
    const websiteProject = projects.find(p => p.title === 'Website Redesign');
    const mobileAppProject = projects.find(p => p.title === 'Mobile App Development');

    console.log('Projects seeded.');

    // Create conversations
    await Conversation.insertMany([
      {
        projectId: iotProject._id,
        participants: [client1._id, admin1._id, vendor1._id],
        messages: [
          { sender: client1._id, text: 'Hi, I have a question about the latest milestone.' },
          { sender: admin1._id, text: 'Sure, happy to help. What\'s on your mind?' },
          { sender: client1._id, text: 'Are we on track to meet the deadline for the firmware module?' },
          { sender: vendor1._id, text: 'Yes, we are making good progress. Expect a demo by end of week.' },
        ],
      },
      {
        projectId: websiteProject._id,
        participants: [client1._id, admin1._id],
        messages: [
          { sender: client1._id, text: 'Any updates on the design concepts for the website?' },
          { sender: admin1._id, text: 'We are compiling some ideas and will share them soon.' },
        ],
      },
      {
        projectId: mobileAppProject._id,
        participants: [client1._id, vendor1._id],
        messages: [
          { sender: vendor1._id, text: 'The latest build is ready for testing.' },
          { sender: client1._id, text: 'Great! I will review it shortly.' },
        ],
      },
    ]);
    console.log('Conversations seeded.');

    // Create meetings
    await Meeting.insertMany([
      {
        title: 'Project Kick-off: IoT Device',
        date: '2024-08-01',
        time: '10:00 AM',
        participants: [client1._id, admin1._id],
        status: 'Confirmed',
        creator: admin1._id,
      },
      {
        title: 'Design Review: Website Redesign',
        date: '2024-08-03',
        time: '02:00 PM',
        participants: [client1._id, admin1._id, vendor1._id],
        status: 'Pending',
        creator: client1._id,
      },
    ]);
    console.log('Meetings seeded.');


    console.log('Database seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();