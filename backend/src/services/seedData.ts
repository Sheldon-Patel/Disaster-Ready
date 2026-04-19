import DisasterModule from '../models/DisasterModule';
import Badge from '../models/Badge';
import EmergencyContact from '../models/EmergencyContact';
import User from '../models/User';

export const seedEarthquakeModule = async () => {
  try {
    // Check if earthquake module already exists
    const existingModule = await DisasterModule.findOne({
      title: 'Earthquake Preparedness'
    });

    if (existingModule) {
      console.log('Earthquake module already exists');
      return existingModule;
    }

    const earthquakeModule = await DisasterModule.create({
      title: 'Earthquake Preparedness',
      description: 'Learn essential earthquake safety measures, preparedness strategies, and emergency response procedures specifically designed for India region.',
      type: 'earthquake',
      difficulty: 'beginner',
      content: {
        introduction: `India, located in a seismically active region, is prone to earthquakes. The state lies in seismic zones II to IV, with areas near the Himalayan foothills facing higher risk. Understanding earthquake preparedness is crucial for students, teachers, and families in India to ensure safety during seismic events.`,

        keyPoints: [
          'India is located in seismic zones II to IV, making earthquake preparedness essential',
          'Most injuries during earthquakes are caused by falling objects, not the ground shaking itself',
          'The "Drop, Cover, and Hold On" technique is the internationally recommended response during earthquakes',
          'Having an emergency kit and family communication plan is vital for post-earthquake survival',
          'Schools and homes should have clearly marked safe spots and evacuation routes'
        ],

        preventionMeasures: [
          'Secure heavy furniture and appliances to walls using safety straps',
          'Keep emergency kits in accessible locations with water, food, first aid supplies, and flashlights',
          'Create and practice a family emergency plan with meeting points',
          'Learn the location of gas, water, and electricity shut-offs in your building',
          'Ensure buildings follow earthquake-resistant construction guidelines',
          'Participate in regular earthquake drills at school and home',
          'Keep important documents in waterproof containers'
        ],

        afterDisaster: [
          'Check yourself and others for injuries — do not move seriously injured persons unless in immediate danger',
          'Expect aftershocks — stay alert and be ready to drop and cover again',
          'Do not re-enter damaged buildings until authorities declare them safe',
          'Turn off gas, water, and electricity if you suspect damage or leaks',
          'Check for structural damage such as cracks in walls, ceilings, or foundation before returning home',
          'Document all damage with photos for insurance and government relief claims',
          'Listen to emergency broadcasts for official updates and road conditions',
          'Help neighbors, especially the elderly and disabled, to evacuate or access medical care'
        ],

        images: [
          '/images/india-seismic-map.jpg',
          '/images/drop-cover-hold.jpg',
          '/images/emergency-kit.jpg'
        ],

        videos: [
          {
            id: 'eq_intro',
            title: 'Understanding Earthquakes',
            description: 'Learn about seismic zones and earthquake basics',
            url: 'https://drive.google.com/file/d/1IvvzBzqFJREmavk76DJDf_o9RGCFCKGV/preview',
            thumbnail: '/images/thumbnails/earthquake-intro.jpg',
            duration: 180,
            section: 'introduction'
          },
          {
            id: 'eq_prep',
            title: 'Earthquake Preparedness',
            description: 'Demonstration of proper earthquake preparedness',
            url: 'https://drive.google.com/file/d/1fN26W_g5PFbRhIQsJkyKZyq2t_-Vw6zD/preview',
            thumbnail: '/images/thumbnails/drop-cover-hold.jpg',
            duration: 120,
            section: 'preventionMeasures'
          }
        ]
      },

      quiz: {
        passingScore: 70,
        timeLimit: 15,
        questions: [
          {
            id: 'eq_q1',
            question: 'What seismic zones does India fall into?',
            options: [
              'Zones I to III',
              'Zones II to IV',
              'Zones III to V',
              'Zone IV only'
            ],
            correctAnswer: 1,
            explanation: 'India is located in seismic zones II to IV, with areas near the Himalayan foothills in higher risk zones.',
            points: 10
          },
          {
            id: 'eq_q2',
            question: 'What is the correct earthquake response technique?',
            options: [
              'Run outside immediately',
              'Stand in a doorway',
              'Drop, Cover, and Hold On',
              'Hide under stairs'
            ],
            correctAnswer: 2,
            explanation: 'Drop, Cover, and Hold On is the internationally recommended technique for earthquake safety.',
            points: 15
          },
          {
            id: 'eq_q3',
            question: 'During an earthquake, what causes most injuries?',
            options: [
              'Ground shaking',
              'Building collapse',
              'Falling objects',
              'Panic running'
            ],
            correctAnswer: 2,
            explanation: 'Most earthquake injuries are caused by falling objects like furniture, fixtures, and debris.',
            points: 10
          },
          {
            id: 'eq_q4',
            question: 'What should you do immediately after an earthquake stops?',
            options: [
              'Run outside as fast as possible',
              'Check for injuries and hazards',
              'Turn on all electrical appliances',
              'Call everyone you know'
            ],
            correctAnswer: 1,
            explanation: 'After an earthquake, first check for injuries and immediate hazards before taking any other action.',
            points: 15
          },
          {
            id: 'eq_q5',
            question: 'Which districts in India are at higher earthquake risk?',
            options: [
              'Southern districts only',
              'Central districts only',
              'Northern districts near Himalayas',
              'All districts have equal risk'
            ],
            correctAnswer: 2,
            explanation: 'Northern districts of India near the Himalayan foothills are at higher seismic risk due to their proximity to active fault lines.',
            points: 10
          },
          {
            id: 'eq_q6',
            question: 'What should an emergency kit contain?',
            options: [
              'Only water and food',
              'Water, food, first aid, flashlight, radio',
              'Just a flashlight',
              'Only important documents'
            ],
            correctAnswer: 1,
            explanation: 'A comprehensive emergency kit should include water, food, first aid supplies, flashlight, battery radio, and other essential items.',
            points: 15
          },
          {
            id: 'eq_q7',
            question: 'If you are in bed during an earthquake, what should you do?',
            options: [
              'Jump out immediately',
              'Stay in bed and cover head with pillow',
              'Run to the bathroom',
              'Hide under the bed'
            ],
            correctAnswer: 1,
            explanation: 'If in bed during an earthquake, stay there and protect your head with a pillow as beds provide some protection.',
            points: 10
          },
          {
            id: 'eq_q8',
            question: 'How often should schools conduct earthquake drills?',
            options: [
              'Once a year',
              'Only when earthquakes are predicted',
              'Regularly throughout the year',
              'Never - they cause panic'
            ],
            correctAnswer: 2,
            explanation: 'Regular earthquake drills throughout the year help students and staff develop muscle memory for proper response.',
            points: 15
          },
          {
            id: 'eq_q9',
            question: 'What is the "Triangle of Life" theory?',
            options: [
              'A geometric way to build houses',
              'A safety technique to find void spaces near solid objects',
              'A type of emergency kit',
              'A method to measure earthquake magnitude'
            ],
            correctAnswer: 1,
            explanation: 'The Triangle of Life suggests finding void spaces near solid objects where a "triangle" might form during a collapse, though "Drop, Cover, and Hold On" remains the standard recommendation.',
            points: 10
          },
          {
            id: 'eq_q10',
            question: 'Which of these should NOT be used during an earthquake?',
            options: ['Stairs', 'Elevators', 'Whistles', 'Flashlights'],
            correctAnswer: 1,
            explanation: 'Never use elevators during an earthquake as power may fail, trapping you inside.',
            points: 10
          },
          {
            id: 'eq_q11',
            question: 'If you are outdoors during an earthquake, where is the safest place to be?',
            options: [
              'Under a tree',
              'Near a tall building',
              'In an open area away from buildings and power lines',
              'Under a bridge'
            ],
            correctAnswer: 2,
            explanation: 'Open areas are safest as they minimize the risk of being hit by falling debris, glass, or power lines.',
            points: 15
          },
          {
            id: 'eq_q12',
            question: 'What does "Drop" mean in the safety technique?',
            options: [
              'Drop your belongings',
              'Drop to your hands and knees',
              'Drop to a lying position',
              'Drop items from your hands'
            ],
            correctAnswer: 1,
            explanation: '"Drop" means getting to your hands and knees to prevent being knocked over and to stay mobile.',
            points: 10
          },
          {
            id: 'eq_q13',
            question: 'What should you do if you are in a vehicle during an earthquake?',
            options: [
              'Speed up to get home',
              'Stop in a clear area and stay inside the vehicle',
              'Jump out and run',
              'Stop under an overpass'
            ],
            correctAnswer: 1,
            explanation: 'Pull over to a clear area away from buildings, trees, and overpasses, and stay inside until the shaking stops.',
            points: 15
          },
          {
            id: 'eq_q14',
            question: 'Why is it important to have a whistle in your emergency kit?',
            options: [
              'To keep children entertained',
              'To signal for help if you are trapped',
              'To scare away animals',
              'To communicate with neighbors'
            ],
            correctAnswer: 1,
            explanation: 'A whistle is a very effective way to signal rescuers if you are trapped, requiring less energy and oxygen than shouting.',
            points: 10
          },
          {
            id: 'eq_q15',
            question: 'Which government body in India provides earthquake alerts and information?',
            options: [
              'Indian Railways',
              'National Disaster Management Authority (NDMA)',
              'Finance Ministry',
              'Sports Authority'
            ],
            correctAnswer: 1,
            explanation: 'The NDMA is the apex body for disaster management in India, providing guidelines and alerts for earthquakes.',
            points: 10
          }
        ]
      }
    });

    console.log('✅ Earthquake preparedness module created successfully');
    return earthquakeModule;

  } catch (error) {
    console.error('Error creating earthquake module:', error);
    throw error;
  }
};

export const seedBadges = async () => {
  try {
    console.log('🏆 Seeding gamification badges...');

    const badges = [
      {
        name: 'First Steps',
        description: 'Complete your first disaster preparedness module',
        icon: '🎯',
        criteria: 'Complete 1 module',
        points: 50,
        rarity: 'common'
      },
      {
        name: 'Knowledge Seeker',
        description: 'Complete 3 disaster preparedness modules',
        icon: '📚',
        criteria: 'Complete 3 modules',
        points: 150,
        rarity: 'common'
      },
      {
        name: 'Disaster Expert',
        description: 'Complete 5 disaster preparedness modules',
        icon: '🛡️',
        criteria: 'Complete 5 modules',
        points: 300,
        rarity: 'rare'
      },
      {
        name: 'Perfect Score',
        description: 'Achieve a perfect 100% score on any quiz',
        icon: '⭐',
        criteria: 'Score 100% on a quiz',
        points: 200,
        rarity: 'rare'
      },
      {
        name: 'Consistent Learner',
        description: 'Maintain 85%+ average across 3+ modules',
        icon: '📈',
        criteria: 'Average 85%+ on 3+ modules',
        points: 250,
        rarity: 'epic'
      },
      {
        name: 'Speed Learner',
        description: 'Complete a module in under 10 minutes',
        icon: '⚡',
        criteria: 'Complete module in <10 minutes',
        points: 100,
        rarity: 'common'
      },
      {
        name: 'Master',
        description: 'Earn 500+ points with 90%+ average',
        icon: '👑',
        criteria: '500+ points, 90%+ average',
        points: 500,
        rarity: 'epic'
      },
      {
        name: 'Champion',
        description: 'Reach 1000 total points',
        icon: '🏆',
        criteria: 'Earn 1000+ points',
        points: 1000,
        rarity: 'legendary'
      }
    ];

    for (const badgeData of badges) {
      const existingBadge = await Badge.findOne({ name: badgeData.name });
      if (!existingBadge) {
        await Badge.create(badgeData);
        console.log(`✅ Badge created: ${badgeData.name}`);
      }
    }

    console.log('✅ All badges seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
  }
};

export const seedEmergencyContacts = async () => {
  try {
    console.log('📦 Seeding emergency contacts for India districts...');

    const emergencyContacts = [
      // Ludhiana District
      { name: 'Ludhiana Police Control Room', designation: 'Control Room Officer', phone: '9876543210', email: 'control@ludhianapolice.gov.in', district: 'Ludhiana', type: 'police' },
      { name: 'Ludhiana Fire Station', designation: 'Fire Officer', phone: '9876543211', district: 'Ludhiana', type: 'fire' },
      { name: 'CMC Hospital Emergency', designation: 'Emergency Doctor', phone: '9876543212', district: 'Ludhiana', type: 'medical' },
      { name: 'District Collector Office', designation: 'Disaster Management Officer', phone: '9876543213', district: 'Ludhiana', type: 'disaster_management' },

      // Amritsar District
      { name: 'Amritsar Police HQ', designation: 'Senior Superintendent', phone: '9876543220', district: 'Amritsar', type: 'police' },
      { name: 'Amritsar Fire Department', designation: 'Chief Fire Officer', phone: '9876543221', district: 'Amritsar', type: 'fire' },
      { name: 'AIIMS Bathinda Emergency', designation: 'Emergency Coordinator', phone: '9876543222', district: 'Amritsar', type: 'medical' },
      { name: 'Amritsar DC Office', designation: 'ADC Emergency', phone: '9876543223', district: 'Amritsar', type: 'disaster_management' },

      // Jalandhar District
      { name: 'Jalandhar City Police', designation: 'DSP Control', phone: '9876543230', district: 'Jalandhar', type: 'police' },
      { name: 'Jalandhar Fire Station', designation: 'Station Officer', phone: '9876543231', district: 'Jalandhar', type: 'fire' },
      { name: 'Jalandhar Civil Hospital', designation: 'Medical Superintendent', phone: '9876543232', district: 'Jalandhar', type: 'medical' },

      // Patiala District
      { name: 'Patiala Police Control', designation: 'Control Room', phone: '9876543240', district: 'Patiala', type: 'police' },
      { name: 'Patiala Fire Services', designation: 'Fire Controller', phone: '9876543241', district: 'Patiala', type: 'fire' },
      { name: 'Government Medical College', designation: 'Emergency Ward', phone: '9876543242', district: 'Patiala', type: 'medical' },

      // Bathinda District
      { name: 'Bathinda Police Station', designation: 'SHO', phone: '9876543250', district: 'Bathinda', type: 'police' },
      { name: 'Bathinda Fire Station', designation: 'Fire Officer', phone: '9876543251', district: 'Bathinda', type: 'fire' },
      { name: 'Bathinda District Hospital', designation: 'Emergency Doctor', phone: '9876543252', district: 'Bathinda', type: 'medical' },

      // Mohali District
      { name: 'Mohali Police Control', designation: 'Control Officer', phone: '9876543260', district: 'Mohali', type: 'police' },
      { name: 'Mohali Fire Department', designation: 'Fire Commander', phone: '9876543261', district: 'Mohali', type: 'fire' },
      { name: 'PGI Chandigarh Emergency', designation: 'Emergency Services', phone: '9876543262', district: 'Mohali', type: 'medical' },
      { name: 'Mohali Disaster Management', designation: 'DM Officer', phone: '9876543263', district: 'Mohali', type: 'disaster_management' },

      // School Admin Contacts
      { name: 'India School Education Board', designation: 'Emergency Coordinator', phone: '9876543270', email: 'emergency@pseb.ac.in', district: 'Mohali', type: 'school_admin' },
      { name: 'District Education Officer Ludhiana', designation: 'DEO', phone: '9876543271', district: 'Ludhiana', type: 'school_admin' },
      { name: 'District Education Officer Amritsar', designation: 'DEO', phone: '9876543272', district: 'Amritsar', type: 'school_admin' }
    ];

    for (const contactData of emergencyContacts) {
      const existingContact = await EmergencyContact.findOne({
        phone: contactData.phone
      });

      if (!existingContact) {
        await EmergencyContact.create(contactData);
        console.log(`✅ Emergency contact created: ${contactData.name}`);
      }
    }

    console.log('✅ All emergency contacts seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding emergency contacts:', error);
  }
};

export const seedDemoUsers = async () => {
  try {
    console.log('👥 Seeding admin user...');

    const demoUsers = [
      {
        name: 'Admin',
        email: 'admin@disasterready.in',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
        school: 'Disaster Ready HQ',
        profile: {
          district: 'Mumbai',
          emergencyContact: '9876543211'
        }
      },
      {
        name: 'Sheldon Patel',
        email: 'sheldonpatel98@gmail.com',
        password: 'sheldon@123',
        role: 'student',
        phone: '9876543212',
        school: 'Demo School',
        points: 100,
        profile: {
          district: 'Demo District',
          emergencyContact: '9876543213'
        }
      }
    ];

    for (const userData of demoUsers) {
      const existingUser = await User.findOne({ email: userData.email });
      if (!existingUser) {
        await User.create(userData);
        console.log(`✅ Created: ${userData.name} (${userData.email})`);
      } else {
        console.log(`ℹ️  Already exists: ${userData.email}`);
      }
    }

    console.log('✅ Admin user seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding admin user:', error);
  }
};

export const seedFloodModule = async () => {
  try {
    const existingModule = await DisasterModule.findOne({
      title: 'Flood Safety'
    });

    if (existingModule) {
      console.log('Flood module already exists');
      return existingModule;
    }

    const floodModule = await DisasterModule.create({
      title: 'Flood Safety',
      description: 'Learn flood safety measures, preparation strategies, and emergency response procedures for India\'s monsoon and river flood risks.',
      type: 'flood',
      difficulty: 'beginner',
      content: {
        introduction: 'India experiences seasonal flooding due to monsoon rains and river overflow, particularly from the Sutlej, Beas, and Ravi rivers. Understanding flood safety is crucial for all residents, especially in flood-prone areas.',

        keyPoints: [
          'India\'s major rivers can cause flooding during monsoon season (July-September)',
          'Flash floods can occur within minutes, while river floods develop over hours or days',
          'Just 6 inches of fast-moving water can knock you down; 12 inches can carry away a vehicle',
          'Avoid walking or driving through flooded areas - "Turn Around, Don\'t Drown"',
          'Have an evacuation plan and emergency kit ready before flood season'
        ],

        preventionMeasures: [
          'Know your area\'s flood risk and evacuation routes',
          'Keep emergency supplies in a waterproof container',
          'Install sump pumps and backup power in flood-prone areas',
          'Create a family communication plan with out-of-area contacts',
          'Sign up for local weather and flood alerts',
          'Practice evacuation procedures with family and school',
          'Keep important documents in waterproof containers'
        ],

        afterDisaster: [
          'Wait for official all-clear before returning home — floodwaters may still be dangerous',
          'Do not walk or drive through floodwater — just 15 cm can knock down an adult',
          'Document all flood damage with photos and videos for insurance claims',
          'Discard food that has come into contact with floodwater — it is unsafe to eat',
          'Clean and disinfect all surfaces that floodwater touched to prevent disease spread',
          'Have your home inspected for structural damage, electrical hazards, and gas leaks before re-entering',
          'Boil water until authorities confirm the tap supply is safe to drink',
          'Report any downed power lines or broken gas pipes to emergency services immediately'
        ],

        images: [
          '/images/india-flood-map.jpg',
          '/images/flood-safety-signs.jpg',
          '/images/flood-evacuation.jpg'
        ],

        videos: [
          {
            id: 'flood_intro',
            title: 'Understanding Floods',
            description: 'Learn about monsoon patterns and flood risks',
            url: 'https://drive.google.com/file/d/1a8Si7dBIIxomcfXVKr_iK4ISdOMzy2Fn/preview',
            thumbnail: '/images/thumbnails/flood-intro.jpg',
            duration: 200,
            section: 'introduction'
          },
          {
            id: 'flood_prep',
            title: 'Flood Preparedness',
            description: 'Step-by-step preparation procedures for floods',
            url: 'https://drive.google.com/file/d/1BsUjVvMWc3EGOzh8fSDs-GvzYcvhfZmH/preview',
            thumbnail: '/images/thumbnails/flood-evacuation.jpg',
            duration: 180,
            section: 'preventionMeasures'
          }
        ]
      },

      quiz: {
        passingScore: 70,
        timeLimit: 12,
        questions: [
          {
            id: 'flood_q1',
            question: 'How much fast-moving water can knock down an adult?',
            options: ['2 inches', '6 inches', '12 inches', '18 inches'],
            correctAnswer: 1,
            explanation: '6 inches of fast-moving water can knock down an adult.',
            points: 10
          },
          {
            id: 'flood_q2',
            question: 'What should you do if trapped in a car during a flood?',
            options: ['Stay in the car', 'Try to drive through', 'Abandon the car and move to higher ground', 'Wait for rescue'],
            correctAnswer: 2,
            explanation: 'Abandon the car and move to higher ground immediately.',
            points: 15
          },
          {
            id: 'flood_q3',
            question: 'What is a Flash Flood?',
            options: [
              'A flood that lasts for weeks',
              'A rapid flooding of low-lying areas in less than six hours',
              'A flood caused by melting snow',
              'A flood that only happens at night'
            ],
            correctAnswer: 1,
            explanation: 'Flash floods are rapid flooding incidents that can occur within minutes or hours of heavy rainfall.',
            points: 10
          },
          {
            id: 'flood_q4',
            question: 'Which of these is a safe source of drinking water during a flood?',
            options: [
              'Flood water',
              'Tap water without boiling',
              'Bottled water or boiled water',
              'Water from a well'
            ],
            correctAnswer: 2,
            explanation: 'Flood waters are often contaminated. Only drink bottled water or water that has been properly boiled/treated.',
            points: 15
          },
          {
            id: 'flood_q5',
            question: 'What should you do with electrical appliances before a flood hits?',
            options: [
              'Leave them plugged in',
              'Unplug and move them to higher ground if possible',
              'Turn them on to keep them warm',
              'Put them in the basement'
            ],
            correctAnswer: 1,
            explanation: 'Unplugging and elevating appliances prevents electrical hazards and damage.',
            points: 10
          },
          {
            id: 'flood_q6',
            question: 'Why is it dangerous to walk through flood water?',
            options: [
              'You might get wet',
              'Hazards like open drains, snakes, and electric wires may be hidden',
              'It makes your clothes dirty',
              'Traffic might be slow'
            ],
            correctAnswer: 1,
            explanation: 'Flood waters can hide dangerous debris, open manholes, displaced animals, and downed power lines.',
            points: 15
          },
          {
            id: 'flood_q7',
            question: 'What is the "Turn Around, Don\'t Drown" rule?',
            options: [
              'Swim against the current',
              'Never drive or walk through flood waters',
              'Rotate your car if caught in water',
              'Wait for the water to turn'
            ],
            correctAnswer: 1,
            explanation: 'This rule emphasizes that you should never enter flood waters, as they are often deeper and stronger than they look.',
            points: 15
          },
          {
            id: 'flood_q8',
            question: 'Where should you go if flood waters start rising while you are indoors?',
            options: [
              'To the basement',
              'To the highest floor or roof',
              'Under the bed',
              'Into the kitchen'
            ],
            correctAnswer: 1,
            explanation: 'Move to the highest point in the building to stay above the rising water.',
            points: 15
          },
          {
            id: 'flood_q9',
            question: 'What should you do if you come into contact with flood water?',
            options: [
              'Nothing, it is just water',
              'Wash with soap and clean water as soon as possible',
              'Wait for it to dry',
              'Apply oil'
            ],
            correctAnswer: 1,
            explanation: 'Flood water is often contaminated with sewage and chemicals. Washing helps prevent skin infections and illness.',
            points: 10
          },
          {
            id: 'flood_q10',
            question: 'What is a "Flood Watch"?',
            options: [
              'A flood is happening right now',
              'Conditions are favorable for flooding in the area',
              'A flood has passed',
              'A search for flood victims'
            ],
            correctAnswer: 1,
            explanation: 'A watch means you should stay alert as flooding is possible.',
            points: 10
          },
          {
            id: 'flood_q11',
            question: 'Which season in India poses the highest flood risk?',
            options: ['Winter', 'Summer', 'Monsoon (July-Sept)', 'Spring'],
            correctAnswer: 2,
            explanation: 'The monsoon season brings heavy rains that lead to river overflow and flash floods across India.',
            points: 10
          },
          {
            id: 'flood_q12',
            question: 'How much water can float most cars?',
            options: ['6 inches', '1 foot (12 inches)', '2 feet', '5 feet'],
            correctAnswer: 1,
            explanation: 'Just 12 inches of rushing water can float many cars; 2 feet can carry away most vehicles.',
            points: 15
          },
          {
            id: 'flood_q13',
            question: 'What is the best way to prevent water-borne diseases after a flood?',
            options: [
              'Wear a mask',
              'Drink only purified or boiled water',
              'Stay indoors',
              'Eat more vegetables'
            ],
            correctAnswer: 1,
            explanation: 'Contaminated water is the primary cause of post-flood diseases like cholera and typhoid.',
            points: 15
          },
          {
            id: 'flood_q14',
            question: 'What should you do if you see a downed power line in flood water?',
            options: [
              'Call 101 and stay far away',
              'Try to move it with a stick',
              'Walk around it carefully',
              'Ignore it'
            ],
            correctAnswer: 0,
            explanation: 'Water conducts electricity. Stay far away from power lines in water and report it to authorities.',
            points: 15
          },
          {
            id: 'flood_q15',
            question: 'What belongs in a flood emergency kit?',
            options: [
              'Television and speakers',
              'Waterproof bags, flashlight, radio, first aid, and clean water',
              'Heavy blankets and winter coats',
              'Garden tools'
            ],
            correctAnswer: 1,
            explanation: 'Essential items for a flood kit prioritize communication, light, first aid, and dry storage for documents.',
            points: 10
          }
        ]
      }
    });

    console.log('✅ Flood preparedness module created successfully');
    return floodModule;

  } catch (error) {
    console.error('Error creating flood module:', error);
    throw error;
  }
};

export const seedFireModule = async () => {
  try {
    const existingModule = await DisasterModule.findOne({
      title: 'Fire Safety'
    });

    if (existingModule) {
      console.log('Fire module already exists');
      return existingModule;
    }

    const fireModule = await DisasterModule.create({
      title: 'Fire Safety',
      description: 'Comprehensive fire safety education covering prevention, evacuation, and emergency response for schools and homes.',
      type: 'fire',
      difficulty: 'beginner',
      content: {
        introduction: 'Fire safety is crucial for protecting lives and property. Understanding fire prevention, detection, and evacuation can save lives during fire emergencies.',

        keyPoints: [
          'Most fire-related deaths are caused by smoke inhalation, not burns',
          'You may have as little as 2 minutes to escape a house fire',
          'Smoke rises, so stay low to the ground during evacuation',
          'Never re-enter a burning building for any reason',
          'Have working smoke detectors and check batteries regularly'
        ],

        preventionMeasures: [
          'Install smoke detectors in every room and test monthly',
          'Create and practice a fire escape plan with two exits from each room',
          'Keep fire extinguishers in key areas and know how to use them',
          'Store flammable materials safely away from heat sources',
          'Maintain electrical systems and avoid overloading circuits',
          'Never leave cooking unattended',
          'Establish a family meeting point outside the home'
        ],

        afterDisaster: [
          'Do NOT re-enter a burned building until fire department confirms it is safe',
          'Call your insurer and document all damage with photos before starting cleanup',
          'Be aware of hidden hotspots — fires can reignite hours after being extinguished',
          'Wear an N95 mask and gloves when entering fire-damaged areas due to toxic ash and debris',
          'Discard all food, beverages, and medicines exposed to heat, smoke, or soot',
          'Have electrical, gas, and plumbing inspected before reconnecting utilities',
          'Contact the local municipality for information on debris removal assistance',
          'Seek mental health support — fire trauma can have lasting psychological effects'
        ],

        images: [
          '/images/fire-escape-plan.jpg',
          '/images/smoke-detector.jpg',
          '/images/stop-drop-roll.jpg'
        ],

        videos: [
          {
            id: 'fire_prevention',
            title: 'Fire Prevention in Schools and Homes',
            description: 'Learn how to prevent fires before they start',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnail: '/images/thumbnails/fire-prevention.jpg',
            duration: 240,
            section: 'preventionMeasures'
          },
          {
            id: 'fire_evacuation',
            title: 'School Fire Evacuation Procedures',
            description: 'Safe and orderly evacuation during fire emergencies',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            thumbnail: '/images/thumbnails/fire-evacuation.jpg',
            duration: 200,
            section: 'duringDisaster'
          },
          {
            id: 'stop_drop_roll',
            title: 'Stop, Drop, and Roll Technique',
            description: 'What to do if your clothes catch fire',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            thumbnail: '/images/thumbnails/stop-drop-roll.jpg',
            duration: 90,
            section: 'duringDisaster'
          }
        ]
      },

      quiz: {
        passingScore: 75,
        timeLimit: 15,
        questions: [
          {
            id: 'fire_q1',
            question: 'How much time might you have to escape a house fire?',
            options: ['30 seconds', '2 minutes', '5 minutes', '10 minutes'],
            correctAnswer: 1,
            explanation: 'You may have as little as 2 minutes to escape a house fire.',
            points: 10
          },
          {
            id: 'fire_q2',
            question: 'What should you do if your clothes catch fire?',
            options: ['Run for help', 'Stop, Drop, and Roll', 'Pour water on yourself', 'Remove clothing quickly'],
            correctAnswer: 1,
            explanation: 'Stop, Drop, and Roll to smother the flames.',
            points: 15
          },
          {
            id: 'fire_q3',
            question: 'What is the most common cause of fire-related deaths?',
            options: ['Burns', 'Smoke inhalation', 'Falling debris', 'Panic'],
            correctAnswer: 1,
            explanation: 'Most fire victims die from breathing in toxic smoke and gases, not from actual burns.',
            points: 10
          },
          {
            id: 'fire_q4',
            question: 'Why should you stay low to the ground in a smoke-filled room?',
            options: [
              'Because you can crawl faster',
              'To avoid being seen',
              'Smoke and heat rise, leaving cleaner air near the floor',
              'To find your way better'
            ],
            correctAnswer: 2,
            explanation: 'Cleaner, breathable air is found closer to the floor because smoke and toxic gases are warmer than air and rise.',
            points: 15
          },
          {
            id: 'fire_q5',
            question: 'What should you do before opening a door during a fire?',
            options: [
              'Check for smoke under the door',
              'Touch the door or handle with the back of your hand to check for heat',
              'Lock the door',
              'Shout for help'
            ],
            correctAnswer: 1,
            explanation: 'If the door or handle is hot, fire is on the other side. Do not open it.',
            points: 15
          },
          {
            id: 'fire_q6',
            question: 'How often should smoke alarm batteries be tested?',
            options: ['Once a year', 'Once a month', 'Every 5 years', 'Only when they beep'],
            correctAnswer: 1,
            explanation: 'Testing smoke alarms monthly ensures they are working correctly in case of an actual emergency.',
            points: 10
          },
          {
            id: 'fire_q7',
            question: 'What does the "P" in the PASS method for using a fire extinguisher stand for?',
            options: ['Push the button', 'Pull the pin', 'Point at the fire', 'Press the handle'],
            correctAnswer: 1,
            explanation: 'The PASS method stands for Pull the pin, Aim at the base, Squeeze the handle, and Sweep from side to side.',
            points: 15
          },
          {
            id: 'fire_q8',
            question: 'What is a fire assembly point?',
            options: [
              'A place where firefighters meet',
              'Where fire trucks are parked',
              'A safe designated area outside where everyone gathers after evacuation',
              'The place where the fire started'
            ],
            correctAnswer: 2,
            explanation: 'An assembly point allows everyone to be accounted for after an evacuation.',
            points: 10
          },
          {
            id: 'fire_q9',
            question: 'What should you NOT use to put out a grease fire on a stove?',
            options: ['A metal lid', 'Baking soda', 'Water', 'A fire blanket'],
            correctAnswer: 2,
            explanation: 'Never use water on a grease fire as it causes the oil to splatter and spread the fire instantly.',
            points: 15
          },
          {
            id: 'fire_q10',
            question: 'What is the correct way to crawl in a smoky room?',
            options: [
              'On your stomach',
              'On your hands and knees with head low',
              'Running while stooped over',
              'Walking normally'
            ],
            correctAnswer: 1,
            explanation: 'Crawling on hands and knees keeps you under the hottest smoke and gives you better balance.',
            points: 10
          },
          {
            id: 'fire_q11',
            question: 'If you are trapped in a room during a fire, what is the best way to signal for help?',
            options: [
              'Hide in a closet',
              'Open a window and wave a bright cloth or use a flashlight',
              'Keep the door open',
              'Shout until you lose your voice'
            ],
            correctAnswer: 1,
            explanation: 'Signaling from a window helps rescuers locate you without entering every room.',
            points: 15
          },
          {
            id: 'fire_q12',
            question: 'What should you do if your primary exit is blocked by fire?',
            options: [
              'Wait for help',
              'Use your designated secondary exit (e.g., another door or window)',
              'Try to run through the flames',
              'Call 101 and wait'
            ],
            correctAnswer: 1,
            explanation: 'Always have two ways out of every room in your fire escape plan.',
            points: 15
          },
          {
            id: 'fire_q13',
            question: 'Why should you never use an elevator during a fire?',
            options: [
              'It is too slow',
              'It might get stuck if the power fails',
              'Smoke can enter the elevator shaft',
              'Both B and C'
            ],
            correctAnswer: 3,
            explanation: 'Elevators can become traps if power is lost, and shafts can fill with smoke quickly.',
            points: 10
          },
          {
            id: 'fire_q14',
            question: 'What is the number for Fire Emergency services in India?',
            options: ['100', '101', '102', '108'],
            correctAnswer: 1,
            explanation: '101 is the standard emergency number for Fire services in India.',
            points: 10
          },
          {
            id: 'fire_q15',
            question: 'Once you have safely evacuated a burning building, what should you do?',
            options: [
              'Go back for your phone',
              'Wait at the assembly point and stay OUT',
              'Go to a friend\'s house',
              'Try to help put out the fire'
            ],
            correctAnswer: 1,
            explanation: 'Never re-enter a burning building. Wait for professional firefighters to handle the situation.',
            points: 15
          }
        ]
      }
    });

    console.log('✅ Fire safety module created successfully');
    return fireModule;

  } catch (error) {
    console.error('Error creating fire module:', error);
    throw error;
  }
};

export const clearExistingModules = async () => {
  try {
    console.log('🗑️  Clearing existing modules...');
    await DisasterModule.deleteMany({});
    console.log('✅ Existing modules cleared');
  } catch (error) {
    console.error('❌ Error clearing modules:', error);
  }
};

export const seedCycloneModule = async () => {
  try {
    const existingModule = await DisasterModule.findOne({
      title: 'Cyclone Preparedness'
    });

    if (existingModule) {
      console.log('Cyclone module already exists');
      return existingModule;
    }

    const cycloneModule = await DisasterModule.create({
      title: 'Cyclone Preparedness',
      description: 'Learn about cyclone safety, preparation strategies, and emergency response procedures for severe weather events affecting India.',
      type: 'cyclone',
      difficulty: 'intermediate',
      content: {
        introduction: 'While India is not directly on the coast, it can be affected by severe cyclonic weather systems that bring heavy rains, strong winds, and flooding. Understanding cyclone preparedness helps protect lives and property.',

        keyPoints: [
          'Cyclonic storms can bring winds over 100 km/h and torrential rains to India',
          'Storm surge is not a concern, but heavy rainfall and flooding are major risks',
          'Power outages and communication disruptions are common during cyclones',
          'Mobile homes and temporary structures are particularly vulnerable',
          'Advance warning systems give 48-72 hours notice for preparation'
        ],

        preventionMeasures: [
          'Monitor weather forecasts and cyclone tracking during monsoon season',
          'Secure outdoor furniture, signs, and loose objects that could become projectiles',
          'Trim trees and remove dead branches near buildings',
          'Install storm shutters or board up windows with plywood',
          'Stock up on emergency supplies including water, food, medications, and batteries',
          'Charge all electronic devices and have backup power sources',
          'Know your evacuation zone and routes to higher ground'
        ],

        duringDisaster: [],
        afterDisaster: [
          'Stay inside until local authorities confirm it is safe to go outside',
          'Watch for downed power lines, damaged buildings, and fallen trees before venturing out',
          'Check for gas leaks — open windows and evacuate if you smell gas, then call emergency services',
          'Document all damage thoroughly with photos for insurance and disaster relief claims',
          'Do not use tap water until authorities confirm it is safe — pipes may be contaminated',
          'Assist in community cleanup efforts using protective equipment like gloves and boots',
          'Report any missing persons to local authorities or NDRF teams immediately',
          'Check on neighbors, especially elderly persons who may need assistance'
        ],

        images: [
          '/images/cyclone-tracking.jpg',
          '/images/storm-damage.jpg',
          '/images/emergency-supplies.jpg'
        ],

        videos: [
          {
            id: 'cyclone_intro',
            title: 'Understanding Cyclonic Weather',
            description: 'How cyclonic systems affect areas and weather',
            url: 'https://drive.google.com/file/d/1C8dkIjyEAdoK5nvhwlwSOpTGCXrODQoj/preview',
            thumbnail: '/images/thumbnails/cyclone-intro.jpg',
            duration: 220,
            section: 'introduction'
          },
          {
            id: 'cyclone_prep',
            title: 'Cyclone Preparedness',
            description: 'Steps to secure your property before a storm hits',
            url: 'https://drive.google.com/file/d/1GmGuZyH4qx6E9qUFxc0lZDDSACa8LaLR/preview',
            thumbnail: '/images/thumbnails/storm-prep.jpg',
            duration: 180,
            section: 'preventionMeasures'
          }
        ]
      },

      quiz: {
        passingScore: 75,
        timeLimit: 15,
        questions: [
          {
            id: 'cyclone_q1',
            question: 'What is the primary danger from cyclonic weather in India?',
            options: ['Storm surge', 'Heavy rainfall and flooding', 'Tornadoes', 'Hail'],
            correctAnswer: 1,
            explanation: 'India\'s main risk from cyclonic weather is heavy rainfall leading to flooding.',
            points: 15
          },
          {
            id: 'cyclone_q2',
            question: 'When should you evacuate during a cyclone warning?',
            options: ['During the storm', 'After the storm passes', 'Before dangerous conditions arrive', 'Never evacuate'],
            correctAnswer: 2,
            explanation: 'Evacuation should be completed before dangerous weather conditions arrive.',
            points: 15
          },
          {
            id: 'cyclone_q3',
            question: 'What should you do if you go outside during the eye of a cyclone?',
            options: ['It is safe to stay outside during the eye', 'Return indoors immediately — the back wall of the storm will arrive soon', 'Call emergency services', 'Start cleanup operations'],
            correctAnswer: 1,
            explanation: 'The eye of a cyclone brings a brief calm, but the back wall of the storm arrives soon after with renewed destructive winds.',
            points: 15
          },
          {
            id: 'cyclone_q4',
            question: 'How much advance warning can cyclone tracking systems provide?',
            options: ['1-6 hours', '12-24 hours', '48-72 hours', 'More than a week'],
            correctAnswer: 2,
            explanation: 'Modern cyclone tracking systems can typically provide 48-72 hours of advance warning, giving residents time to prepare or evacuate.',
            points: 10
          },
          {
            id: 'cyclone_q5',
            question: 'What is the safest room to shelter in during a cyclone?',
            options: ['A room with windows to monitor the storm', 'The largest room in the house', 'A small interior room on the lowest floor', 'The garage'],
            correctAnswer: 2,
            explanation: 'A small interior room on the lowest floor away from windows provides the best protection from cyclone winds and flying debris.',
            points: 15
          },
          {
            id: 'cyclone_q6',
            question: 'Why should you boil water after a cyclone?',
            options: ['To make it taste better', 'Water supplies may be contaminated', 'Authority rules require it', 'To kill mosquitoes'],
            correctAnswer: 1,
            explanation: 'Cyclones can contaminate water supplies with sewage, debris, and bacteria. Authorities may issue boil-water advisories for safety.',
            points: 10
          },
          {
            id: 'cyclone_q7',
            question: 'Which month range is India most at risk from severe cyclonic weather?',
            options: ['January to March', 'April to June', 'July to September (Monsoon)', 'October to December'],
            correctAnswer: 2,
            explanation: 'India\'s monsoon season (July-September) brings heavy rains and cyclonic weather systems that pose the greatest risk.',
            points: 10
          },
          {
            id: 'cyclone_q8',
            question: 'What should you do with outdoor furniture and loose objects before a cyclone?',
            options: ['Leave them outside as usual', 'Secure or bring them indoors to prevent them becoming projectiles', 'Move them away from the house', 'Tie them to trees'],
            correctAnswer: 1,
            explanation: 'Loose outdoor objects can become deadly projectiles in cyclone-force winds. Secure or bring them inside before the storm arrives.',
            points: 10
          },
          {
            id: 'cyclone_q9',
            question: 'What is a "Cyclone Watch"?',
            options: [
              'A cyclone has been sighted',
              'Conditions are favorable for a cyclone within 48 hours',
              'The cyclone has passed',
              'A search for storm victims'
            ],
            correctAnswer: 1,
            explanation: 'A watch means you should stay alert as a cyclone is possible in your area.',
            points: 10
          },
          {
            id: 'cyclone_q10',
            question: 'What should you do if you are caught outdoors during a cyclone?',
            options: [
              'Hide under a tree',
              'Seek shelter in a sturdy building immediately',
              'Run as fast as you can',
              'Stay in an open field'
            ],
            correctAnswer: 1,
            explanation: 'A sturdy building is the only safe place during a cyclone. Avoid trees or temporary structures.',
            points: 15
          },
          {
            id: 'cyclone_q11',
            question: 'Why should you keep your emergency radio on during a cyclone?',
            options: [
              'To listen to music',
              'To receive official updates and safety instructions',
              'To signal your location',
              'To keep the battery from dying'
            ],
            correctAnswer: 1,
            explanation: 'Official channels provide the most accurate and timely information during a storm.',
            points: 10
          },
          {
            id: 'cyclone_q12',
            question: 'What is the "Eyewall" of a cyclone?',
            options: [
              'The calm center',
              'The ring of most intense winds and rain surrounding the center',
              'The outermost clouds',
              'A wall built to stop the storm'
            ],
            correctAnswer: 1,
            explanation: ' The eyewall contains the strongest winds and heaviest rain in a cyclonic system.',
            points: 15
          },
          {
            id: 'cyclone_q13',
            question: 'What should you do after the "eye" passes?',
            options: [
              'Go outside and start cleaning',
              'Stay inside - the second half of the storm will arrive soon',
              'Call your friends',
              'Open all windows'
            ],
            correctAnswer: 1,
            explanation: 'The other side of the eyewall follows the calm eye with equally destructive force.',
            points: 15
          },
          {
            id: 'cyclone_q14',
            question: 'How can you protect your windows if you don\'t have storm shutters?',
            options: [
              'Tape them with an "X"',
              'Board them up with plywood',
              'Leave them wide open',
              'Cover them with curtains only'
            ],
            correctAnswer: 1,
            explanation: 'Plywood boarding is an effective way to protect windows from flying debris. Taping does not prevent breakage.',
            points: 10
          },
          {
            id: 'cyclone_q15',
            question: 'Which areas in India are generally NOT at risk from cyclonic wind damage?',
            options: [
              'Indo-Gangetic plains',
              'Eastern coastal states',
              'Western coastal states',
              'Deep interior southern regions'
            ],
            correctAnswer: 3,
            explanation: 'While most of India can be affected by weather systems, deep interior regions are less likely to experience the full force of cyclonic winds compared to coastal and northern plains.',
            points: 10
          }
        ]
      }
    });

    console.log('✅ Cyclone preparedness module created successfully');
    return cycloneModule;

  } catch (error) {
    console.error('Error creating cyclone module:', error);
    throw error;
  }
};

export const seedHeatwaveModule = async () => {
  try {
    const existingModule = await DisasterModule.findOne({
      title: 'Heatwave Safety'
    });

    if (existingModule) {
      console.log('Heatwave module already exists');
      return existingModule;
    }

    const heatwaveModule = await DisasterModule.create({
      title: 'Heatwave Safety',
      description: 'Learn how to stay safe during extreme heat conditions common in India during summer months (April-June).',
      type: 'heatwave',
      difficulty: 'beginner',
      content: {
        introduction: 'India experiences severe heatwaves with temperatures often exceeding 45°C (113°F) during summer. Extreme heat can cause serious health problems and even death. Knowing how to stay cool and recognize heat-related illnesses is essential.',

        keyPoints: [
          'India temperatures can reach 48°C (118°F) during peak summer months',
          'Heat-related illnesses include heat exhaustion, heat cramps, and heat stroke',
          'Children, elderly, and people with chronic conditions are most vulnerable',
          'Even healthy adults can suffer from heat-related problems during extreme heat',
          'Most heat-related deaths are preventable with proper precautions'
        ],

        preventionMeasures: [
          'Stay indoors during hottest parts of day (10 AM - 4 PM)',
          'Drink plenty of water throughout the day, even if not thirsty',
          'Wear loose-fitting, light-colored, lightweight clothing',
          'Use fans, air conditioning, or visit public cooling centers',
          'Never leave children or pets in parked vehicles',
          'Schedule outdoor activities for early morning or evening',
          'Take frequent breaks in shade if you must be outside'
        ],

        duringDisaster: [
          'Move to the coolest room in your home or a public cooling center',
          'Drink cool water regularly - avoid alcohol and caffeine',
          'Take cool showers or baths to lower body temperature',
          'Use damp towels on neck, wrists, and ankles to cool down',
          'Limit outdoor activities and stay in shade when possible',
          'Watch for signs of heat exhaustion: dizziness, nausea, headache',
          'Call for medical help if someone shows signs of heat stroke'
        ],

        afterDisaster: [],

        images: [
          '/images/heatwave-safety.jpg',
          '/images/cooling-techniques.jpg',
          '/images/heat-illness-signs.jpg'
        ],

        videos: [
          {
            id: 'heatwave_intro',
            title: 'Understanding Heatwaves',
            description: 'Essential tips for understanding extreme heat conditions',
            url: 'https://drive.google.com/file/d/1QGe2bFnWePhZQXbDfhHqMy5QJHPbNbze/preview',
            thumbnail: '/images/thumbnails/heat-illness.jpg',
            duration: 160,
            section: 'introduction'
          },
          {
            id: 'heatwave_prep',
            title: 'Heatwave Preparedness',
            description: 'Essential tips for surviving extreme heat',
            url: 'https://drive.google.com/file/d/1BmMcW5zFAQZRY798cEFslB2_ZuD0GzZv/preview',
            thumbnail: '/images/thumbnails/heat-safety.jpg',
            duration: 190,
            section: 'preventionMeasures'
          }
        ]
      },

      quiz: {
        passingScore: 70,
        timeLimit: 12,
        questions: [
          {
            id: 'heat_q1',
            question: 'What temperature can India reach during peak summer?',
            options: ['40°C', '45°C', '48°C', '50°C'],
            correctAnswer: 2,
            explanation: 'India can reach temperatures of 48°C (118°F) during peak summer.',
            points: 10
          },
          {
            id: 'heat_q2',
            question: 'What are the hottest hours of the day to avoid during a heatwave?',
            options: ['8 AM - 12 PM', '10 AM - 4 PM', '12 PM - 6 PM', '2 PM - 8 PM'],
            correctAnswer: 1,
            explanation: '10 AM to 4 PM are typically the hottest and most dangerous hours during a heatwave.',
            points: 15
          },
          {
            id: 'heat_q3',
            question: 'Which group of people is MOST vulnerable during a heatwave?',
            options: ['Teenagers', 'Adults aged 20-40', 'Elderly, children, and people with chronic conditions', 'Athletes'],
            correctAnswer: 2,
            explanation: 'Elderly people, young children, and those with chronic conditions are most susceptible to heat-related illness because their bodies regulate temperature less effectively.',
            points: 10
          },
          {
            id: 'heat_q4',
            question: 'What is a key warning sign of heat stroke (a medical emergency)?',
            options: ['Excessive sweating', 'Hot, dry skin with confusion or loss of consciousness', 'Mild headache', 'Feeling thirsty'],
            correctAnswer: 1,
            explanation: 'Heat stroke causes the body to stop sweating (skin becomes hot and dry) and is accompanied by confusion or unconsciousness. This is a medical emergency — call for help immediately.',
            points: 15
          },
          {
            id: 'heat_q5',
            question: 'Why should you avoid alcohol and caffeine during extreme heat?',
            options: ['They cause sunburn', 'They accelerate dehydration', 'They raise blood pressure', 'They are not allowed outdoors'],
            correctAnswer: 1,
            explanation: 'Alcohol and caffeine are diuretics that cause the body to lose more water through urination, accelerating dangerous dehydration during extreme heat.',
            points: 10
          },
          {
            id: 'heat_q6',
            question: 'What is the correct first aid for someone showing signs of heat exhaustion?',
            options: ['Give them hot drinks to warm them up', 'Move them to a cool place, give cool water, and apply cool wet cloths', 'Have them exercise to increase circulation', 'Leave them alone to rest in the sun'],
            correctAnswer: 1,
            explanation: 'Move the person to a cool environment, provide cool water to drink, and apply cool wet cloths to their skin. If symptoms worsen or they lose consciousness, call emergency services.',
            points: 15
          },
          {
            id: 'heat_q7',
            question: 'What is one of the most dangerous things you can do during a heatwave?',
            options: ['Drink water regularly', 'Leave a child or pet in a parked vehicle', 'Wear light-colored clothing', 'Stay in air conditioning'],
            correctAnswer: 1,
            explanation: 'The temperature inside a parked car can rise 20°C above outside temperature within minutes, becoming lethal for children or pets.',
            points: 15
          },
          {
            id: 'heat_q8',
            question: 'Which type of clothing is best to wear during a heatwave?',
            options: ['Dark, tight-fitting synthetic clothes', 'Loose-fitting, light-colored, lightweight clothes', 'No clothes at all', 'Heavy cotton for protection'],
            correctAnswer: 1,
            explanation: 'Loose, light-colored, lightweight clothing reflects sunlight and allows sweat to evaporate, helping your body stay cool.',
            points: 10
          },
          {
            id: 'heat_q9',
            question: 'What should you do if you MUST work outside during a heatwave?',
            options: [
              'Work as fast as possible without breaks',
              'Take frequent breaks in shaded or air-conditioned areas',
              'Wear black clothes to hide sweat',
              'Avoid drinking water so you don\'t need bathroom breaks'
            ],
            correctAnswer: 1,
            explanation: 'Frequent breaks in a cool environment allow your body temperature to normalize.',
            points: 15
          },
          {
            id: 'heat_q10',
            question: 'Where is the safest place to be during a heatwave if you don\'t have air conditioning at home?',
            options: [
              'In the attic',
              'Public libraries, malls, or cooling centers',
              'Under a direct sunlit porch',
              'In a closed kitchen while cooking'
            ],
            correctAnswer: 1,
            explanation: 'Public spaces often have climate control and offer a safe refuge from extreme heat.',
            points: 10
          },
          {
            id: 'heat_q11',
            question: 'Why should you check on elderly neighbors during a heatwave?',
            options: [
              'To ask for recipes',
              'They may be less able to realize they are overheating and need help',
              'To borrow their fan',
              'To see if they are watching the news'
            ],
            correctAnswer: 1,
            explanation: 'Elderly individuals are more susceptible to heat and may need assistance to stay hydrated and cool.',
            points: 15
          },
          {
            id: 'heat_q12',
            question: 'What is "Heat Cramps"?',
            options: [
              'Severe stomach ache',
              'Painful muscle spasms usually in the legs or abdomen caused by heat and fluid loss',
              'A type of skin rash',
              'Feeling very tired'
            ],
            correctAnswer: 1,
            explanation: 'Heat cramps are an early sign of heat-related illness caused by loss of salt and water through sweating.',
            points: 10
          },
          {
            id: 'heat_q13',
            question: 'How much water should an adult drink during an active day in a heatwave?',
            options: [
              '1-2 glasses',
              'At least 2-4 liters (8-10 glasses)',
              'Only when thirsty',
              'None until the evening'
            ],
            correctAnswer: 1,
            explanation: 'Staying hydrated with 2-4 liters of water is necessary to replace fluids lost through sweating.',
            points: 15
          },
          {
            id: 'heat_q14',
            question: 'If you see someone confused and with hot, dry skin during a heatwave, what is the best first step?',
            options: [
              'Fan them and wait',
              'Call 102/108 immediately — it is likely heat stroke',
              'Give them a hot meal',
              'Tell them to walk it off'
            ],
            correctAnswer: 1,
            explanation: 'These are symptoms of heat stroke, which is life-threatening and requires immediate professional medical intervention.',
            points: 15
          },
          {
            id: 'heat_q15',
            question: 'What can you do to keep your home cooler during a heatwave?',
            options: [
              'Keep all windows open all day',
              'Close curtains and blinds to block direct sunlight',
              'Keep the oven running',
              'Use dark-colored rugs'
            ],
            correctAnswer: 1,
            explanation: 'Blocking direct sunlight prevents the greenhouse effect from heating up your interior rooms.',
            points: 10
          }
        ]
      }
    });

    console.log('✅ Heatwave safety module created successfully');
    return heatwaveModule;

  } catch (error) {
    console.error('Error creating heatwave module:', error);
    throw error;
  }
};

export const seedDroughtModule = async () => {
  try {
    const existingModule = await DisasterModule.findOne({
      title: 'Drought Preparedness'
    });

    if (existingModule) {
      console.log('Drought module already exists');
      return existingModule;
    }

    const droughtModule = await DisasterModule.create({
      title: 'Drought Preparedness',
      description: 'Understanding drought impacts on India agriculture and water resources, with strategies for conservation and adaptation.',
      type: 'drought',
      difficulty: 'intermediate',
      content: {
        introduction: 'Drought significantly impacts India\'s agriculture-dependent economy. Understanding water conservation, crop selection, and drought mitigation helps farmers and communities prepare for water scarcity periods.',

        keyPoints: [
          'India relies heavily on groundwater and monsoon rains for agriculture',
          'Drought can last for months or years, requiring long-term adaptation',
          'Water conservation techniques can reduce drought impact',
          'Crop selection and timing adjustments help manage drought risk',
          'Community cooperation is essential for effective drought response'
        ],

        preventionMeasures: [
          'Install rainwater harvesting systems to collect and store monsoon water',
          'Use drip irrigation and micro-sprinkler systems for efficient watering',
          'Plant drought-resistant crops and varieties suited to local conditions',
          'Mulch around plants to reduce evaporation and retain soil moisture',
          'Create community water storage and sharing systems',
          'Monitor groundwater levels and use water sustainably',
          'Develop alternative income sources beyond rain-dependent farming'
        ],

        afterDisaster: [],

        images: [
          '/images/drought-crops.jpg',
          '/images/water-conservation.jpg',
          '/images/rainwater-harvesting.jpg'
        ],

        videos: [
          {
            id: 'drought_intro',
            title: 'Understanding Droughts',
            description: 'Introduction to droughts and their agricultural impacts',
            url: 'https://drive.google.com/file/d/1kbnDZToXg3aEfH68N4mu7P2oGi2aG4jZ/preview',
            thumbnail: '/images/thumbnails/drought-farming.jpg',
            duration: 280,
            section: 'introduction'
          },
          {
            id: 'drought_prep',
            title: 'Drought Preparedness',
            description: 'Water conservation and personal drought preparedness',
            url: 'https://drive.google.com/file/d/12d8ANIGVLy7ae6tDPMnelXjNdR0Rop5E/preview',
            thumbnail: '/images/thumbnails/water-conservation.jpg',
            duration: 240,
            section: 'preventionMeasures'
          }
        ]
      },

      quiz: {
        passingScore: 75,
        timeLimit: 15,
        questions: [
          {
            id: 'drought_q1',
            question: 'What is the most efficient irrigation method during drought?',
            options: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation', 'Channel irrigation'],
            correctAnswer: 2,
            explanation: 'Drip irrigation delivers water directly to plant roots with minimal waste, making it the most efficient method during water-scarce conditions.',
            points: 15
          },
          {
            id: 'drought_q2',
            question: 'What should be the priority for water use during drought?',
            options: ['Irrigation first', 'Drinking and essential human needs', 'Cleaning vehicles', 'Maintaining lawns and gardens'],
            correctAnswer: 1,
            explanation: 'Drinking water and essential human health needs must always be prioritized during drought conditions.',
            points: 15
          },
          {
            id: 'drought_q3',
            question: 'What is rainwater harvesting?',
            options: ['A type of irrigation system', 'Collecting and storing rainwater from rooftops and surfaces for future use', 'A technique to make it rain', 'Transporting water from rivers'],
            correctAnswer: 1,
            explanation: 'Rainwater harvesting involves collecting and storing runoff from rooftops and other surfaces during rainy periods to use during dry spells.',
            points: 10
          },
          {
            id: 'drought_q4',
            question: 'What role does mulching play during a drought?',
            options: ['It increases evaporation to cool plants', 'It reduces evaporation and retains soil moisture', 'It adds nutrients directly to plants', 'It attracts more rainfall'],
            correctAnswer: 1,
            explanation: 'Mulching around plants reduces water evaporation from the soil surface, retains moisture, and helps plants survive longer without irrigation.',
            points: 10
          },
          {
            id: 'drought_q5',
            question: 'How long can a drought last?',
            options: ['Only a few days', 'A week at most', 'Months or even years', 'Exactly one season'],
            correctAnswer: 2,
            explanation: 'Droughts can persist for months or even years, making long-term water management and adaptation strategies essential.',
            points: 10
          },
          {
            id: 'drought_q6',
            question: 'Which crop type is best suited for drought-prone regions?',
            options: ['Rice, which requires flooded fields', 'Water-intensive vegetables', 'Drought-resistant varieties like millets and sorghum', 'Any crop with heavy watering'],
            correctAnswer: 2,
            explanation: 'Drought-resistant crops like millets, sorghum, and specifically bred drought-tolerant varieties are best suited for water-scarce conditions.',
            points: 15
          },
          {
            id: 'drought_q7',
            question: 'What is a key sign of dehydration to watch for in livestock during drought?',
            options: ['Increased energy levels', 'Sunken eyes, lethargy, and reduced food and water intake', 'Faster growth rate', 'Increased milk production'],
            correctAnswer: 1,
            explanation: 'Sunken eyes, lethargy, decreased food intake, and reduced urination are key signs of dehydration in livestock that require immediate attention.',
            points: 10
          },
          {
            id: 'drought_q8',
            question: 'Why is community cooperation important during drought?',
            options: ['It is not important — individual action is enough', 'Water resources are shared and fair distribution requires coordination', 'Communities own more water naturally', 'Government prefers community management'],
            correctAnswer: 1,
            explanation: 'Water resources like rivers, groundwater, and reservoirs are shared. Community coordination ensures fair distribution and prevents conflicts during water scarcity.',
            points: 15
          },
          {
            id: 'drought_q9',
            question: 'What is "Greywater" and how can it be used in a drought?',
            options: [
              'Contaminated river water',
              'Used water from sinks/showers that can be reused for plants',
              'Dirty rain water',
              'Water from a well'
            ],
            correctAnswer: 1,
            explanation: 'Greywater can be safely reused for watering gardens or flushing toilets, reducing the demand on fresh water supplies.',
            points: 10
          },
          {
            id: 'drought_q10',
            question: 'How does drought affect the risk of wildfires?',
            options: [
              'It decreases the risk',
              'It increases the risk by drying out vegetation',
              'It has no effect',
              'It only affects local weather'
            ],
            correctAnswer: 1,
            explanation: 'Dry vegetation becomes highly flammable fuel, significantly increasing the risk and intensity of wildfires.',
            points: 15
          },
          {
            id: 'drought_q11',
            question: 'What is "Xeriscaping"?',
            options: [
              'A type of farming',
              'Landscaping that reduces or eliminates the need for irrigation',
              'Searching for water deep underground',
              'Cleaning dry river beds'
            ],
            correctAnswer: 1,
            explanation: 'Xeriscaping uses drought-tolerant plants and efficient designs to create beautiful landscapes that require very little water.',
            points: 15
          },
          {
            id: 'drought_q12',
            question: 'Why is over-extraction of groundwater dangerous during a drought?',
            options: [
              'It makes the water too salty',
              'It can cause land to sink (subsidence) and dry up neighboring wells',
              'It causes floods later',
              'It is too expensive'
            ],
            correctAnswer: 1,
            explanation: 'Extracting too much water can lead to permanent damage to aquifers and structural sinking of the land.',
            points: 15
          },
          {
            id: 'drought_q13',
            question: 'How can you detect a water leak at home during a drought?',
            options: [
              'Wait for a flood',
              'Check your water meter when no water is being used',
              'Listen for whistling sounds',
              'Look for rainbows'
            ],
            correctAnswer: 1,
            explanation: 'If the meter is still moving while all taps are closed, you likely have a hidden leak.',
            points: 10
          },
          {
            id: 'drought_q14',
            question: 'What is the role of a "check dam" in drought mitigation?',
            options: [
              'To generate electricity',
              'To slow down water flow and increase groundwater recharge',
              'To prevent boats from passing',
              'To create large industrial reservoirs'
            ],
            correctAnswer: 1,
            explanation: 'Check dams help the ground absorb water during rainy periods, replenishing the local water table for use during dry times.',
            points: 10
          },
          {
            id: 'drought_q15',
            question: 'Which sector uses the most water in India?',
            options: ['Industrial', 'Domestic/Household', 'Agricultural', 'Tourism'],
            correctAnswer: 2,
            explanation: 'Agriculture is by far the largest consumer of water in India, making efficient irrigation a primary drought mitigation strategy.',
            points: 10
          }
        ]
      }
    });

    console.log('✅ Drought preparedness module created successfully');
    return droughtModule;

  } catch (error) {
    console.error('Error creating drought module:', error);
  }
};

export const seedTornadoModule = async () => {
  try {
    const existing = await DisasterModule.findOne({ title: 'Tornado Safety Guide' });
    if (existing) return existing;
    const module = await DisasterModule.create({
      title: 'Tornado Safety Guide',
      description: 'Essential procedures for tornado warnings and severe wind events. Learn to recognize warning signs, find shelter, and protect your life during one of nature\'s most violent storms.',
      type: 'tornado',
      difficulty: 'intermediate',
      estimatedTime: 25,
      content: {
        introduction: 'Tornadoes are violently rotating columns of air that can reach wind speeds over 300 km/h, capable of destroying buildings and lifting vehicles in seconds. India, particularly in the Indo-Gangetic plains and eastern states, can experience severe wind events and tornado-like storms (locally called "dust devils" or "loo storms") during pre-monsoon and monsoon seasons. Recognizing warning signs and knowing where to shelter can mean the difference between life and death.',

        keyPoints: [
          'Tornadoes can form within minutes from severe thunderstorms with little to no warning',
          'A dark, greenish sky, large hail, and a loud roaring sound like a freight train are key warning signs',
          'Mobile homes and temporary structures offer NO protection against tornadoes — always evacuate to a sturdy building',
          'The safest shelter is an interior room on the lowest floor of a sturdy building, away from all windows',
          'Overpasses and highway bridges offer extremely dangerous shelter — wind speeds are actually higher there',
          'Battery-powered radios and weather alert systems can provide life-saving advance warnings'
        ],

        preventionMeasures: [
          'Identify the safest room in your home or school — interior rooms away from windows on the lowest floor',
          'Sign up for local weather alert services and keep a battery-powered radio charged',
          'Prepare an emergency kit with water, food, first aid supplies, flashlights, and important documents',
          'Practice tornado drills at home and school so everyone knows exactly where to go',
          'Secure or store outdoor furniture and loose objects that can become dangerous projectiles',
          'Know the difference between a Tornado Watch (conditions are favorable) and a Tornado Warning (a tornado has been sighted)',
          'If living in a mobile home, identify the nearest sturdy building and plan to evacuate quickly'
        ],

        afterDisaster: [],

        images: [
          '/images/tornado-shelter-map.jpg',
          '/images/tornado-warning-signs.jpg',
          '/images/tornado-safety-position.jpg'
        ],

        videos: [
          {
            id: 'tornado_intro',
            title: 'Understanding Tornadoes and Severe Storms',
            description: 'Learn how tornadoes form, their warning signs, and the tornado saffir-simpson scale',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: '/images/thumbnails/tornado-intro.jpg',
            duration: 240,
            section: 'introduction'
          },
          {
            id: 'tornado_shelter',
            title: 'Finding Safe Shelter During a Tornado',
            description: 'Step-by-step guide to identifying and reaching the safest shelter',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail: '/images/thumbnails/tornado-shelter.jpg',
            duration: 180,
            section: 'preventionMeasures'
          },
          {
            id: 'tornado_action',
            title: 'What To Do When a Tornado Strikes',
            description: 'Real-time actions to take during a tornado emergency',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnail: '/images/thumbnails/tornado-action.jpg',
            duration: 200,
            section: 'preventionMeasures'
          }
        ]
      },
      quiz: {
        passingScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: 't1',
            question: 'What is the best place to shelter during a tornado?',
            options: ['Near a window to monitor the storm', 'In a car to drive away', 'An interior room on the lowest floor of a sturdy building', 'Under a highway bridge or overpass'],
            correctAnswer: 2,
            explanation: 'An interior room on the lowest floor away from windows provides the best protection from flying debris. Overpasses are actually more dangerous due to increased wind speed.',
            points: 15
          },
          {
            id: 't2',
            question: 'What sound is commonly associated with an approaching tornado?',
            options: ['A high-pitched whistle', 'Complete silence', 'A loud roar similar to a freight train', 'Thunder and lightning only'],
            correctAnswer: 2,
            explanation: 'A loud continuous roar (like a freight train or jet engine) is a classic warning sign of an approaching tornado.',
            points: 10
          },
          {
            id: 't3',
            question: 'What is the difference between a Tornado Watch and a Tornado Warning?',
            options: ['They mean the same thing', 'A Watch means a tornado has been sighted; Warning means conditions are favorable', 'A Watch means conditions are favorable; Warning means a tornado has been sighted or detected', 'Watch is for daytime; Warning is for nighttime'],
            correctAnswer: 2,
            explanation: 'A Tornado Watch means weather conditions could produce a tornado. A Tornado Warning means a tornado has been sighted or detected on radar — take immediate shelter.',
            points: 15
          },
          {
            id: 't4',
            question: 'If you are outdoors and cannot reach shelter during a tornado, what should you do?',
            options: ['Take shelter under a highway overpass', 'Lie flat in a low ditch or depression away from trees', 'Climb a tree for higher visibility', 'Stay in your vehicle with seatbelt on'],
            correctAnswer: 1,
            explanation: 'If no shelter is available, lie flat in a low ditch or depression, cover head and neck. Overpasses are extremely dangerous. Never shelter under trees.',
            points: 15
          },
          {
            id: 't5',
            question: 'Which type of structure provides LEAST protection during a tornado?',
            options: ['A concrete building basement', 'An interior room of a brick home', 'A mobile home or temporary structure', 'A school gymnasium (interior)'],
            correctAnswer: 2,
            explanation: 'Mobile homes and temporary structures offer virtually no protection during a tornado and should always be evacuated when a warning is issued.',
            points: 10
          },
          {
            id: 't6',
            question: 'What is a common visible warning sign of a tornado threat?',
            options: ['A bright, sunny sky with no clouds', 'A dark greenish sky with large hail', 'A rainbow forming in the east', 'Light morning fog'],
            correctAnswer: 1,
            explanation: 'A dark, greenish sky is caused by hail in the clouds and is a recognized warning sign of severe storms that can produce tornadoes. Large hail often precedes a tornado.',
            points: 10
          },
          {
            id: 't7',
            question: 'Why should you NOT open windows when a tornado approaches?',
            options: ['It helps equalize pressure and is actually recommended', 'Opening windows is a dangerous myth that wastes precious sheltering time', 'It allows water to enter the building', 'Windows should be opened only if you are on the top floor'],
            correctAnswer: 1,
            explanation: 'The idea that opening windows equalizes pressure is a dangerous myth. Tornado damage is caused by violent winds, not pressure differences. Use that time to reach shelter instead.',
            points: 15
          },
          {
            id: 't8',
            question: 'What should you use to protect your head and neck during a tornado?',
            options: ['A metal helmet', 'Your arms and hands, or a blanket/pillow', 'A plastic bag', 'No protection needed — just stay still'],
            correctAnswer: 1,
            explanation: 'Cover your head and neck with your arms, and if available, use a blanket, pillow, or mattress for additional protection against debris.',
            points: 10
          },
          {
            id: 't9',
            question: 'What is a "Dust Devil" or "Loo Storm"?',
            options: [
              'A small tornado-like swirl of air that can still cause damage',
              'A very rain-heavy storm',
              'A type of snow storm',
              'A calm breeze'
            ],
            correctAnswer: 0,
            explanation: 'Locally called dust devils or loo storms in India, these small vortices can still be dangerous and require caution.',
            points: 10
          },
          {
            id: 't10',
            question: 'Which of these is NOT a good place to hide during a tornado?',
            options: ['A closet', 'Under heavy furniture', 'By a large window', 'A basement'],
            correctAnswer: 2,
            explanation: 'Windows are extremely dangerous during a tornado due to flying glass and debris.',
            points: 10
          },
          {
            id: 't11',
            question: 'What does a "Tornado Warning" mean you should do immediately?',
            options: [
              'Go for a drive',
              'Take shelter immediately in a sturdy building',
              'Check the news for more details',
              'Watch the sky from outside'
            ],
            correctAnswer: 1,
            explanation: 'A warning means a tornado is imminent; you must take cover immediately.',
            points: 15
          },
          {
            id: 't12',
            question: 'Why is it dangerous to stay in a car during a tornado?',
            options: [
              'The car might run out of gas',
              'Tornadoes can lift and toss vehicles easily',
              'The radio might stop working',
              'You might get lost'
            ],
            correctAnswer: 1,
            explanation: 'Vehicles offer no protection against tornado-force winds and can become deadly projectiles.',
            points: 15
          },
          {
            id: 't13',
            question: 'What is the "Enhanced Fujita" (EF) scale used for?',
            options: [
              'Measuring rainfall',
              'Measuring tornado strength based on wind speed and damage',
              'Measuring earthquake depth',
              'Measuring heat intensity'
            ],
            correctAnswer: 1,
            explanation: 'The EF scale is the standard system for rating the severity of tornadoes.',
            points: 10
          },
          {
            id: 't14',
            question: 'What should you do if you are in a mobile home during a tornado watch?',
            options: [
              'Stay and hope for the best',
              'Leave and find shelter in a nearby sturdy building',
              'Hide in the bathtub',
              'Tie the home to the ground'
            ],
            correctAnswer: 1,
            explanation: 'Mobile homes are very vulnerable to high winds. Always evacuate to a permanent, sturdy structure.',
            points: 15
          },
          {
            id: 't15',
            question: 'What can help rescuers find you after a tornado if you are trapped?',
            options: [
              'A heavy blanket',
              'A whistle or flashlight',
              'Opening your windows',
              'Painting your roof'
            ],
            correctAnswer: 1,
            explanation: 'Light and sound signals are the most effective ways to attract the attention of search and rescue teams.',
            points: 10
          }
        ]
      }
    });
    console.log('✅ Tornado module created');
    return module;
  } catch (error) { console.error(error); throw error; }
};

export const seedGasLeakModule = async () => {
  try {
    const existing = await DisasterModule.findOne({ title: 'Gas Leak Response' });
    if (existing) return existing;
    const module = await DisasterModule.create({
      title: 'Gas Leak Response',
      description: 'How to detect and safely respond to gas leak incidents at home, school, and in public places. Learn the critical steps that can prevent explosions and protect lives.',
      type: 'gas_leak',
      difficulty: 'advanced',
      estimatedTime: 30,
      content: {
        introduction: 'Natural gas and LPG (Liquefied Petroleum Gas) are widely used for cooking and heating across India. While safe when used properly, gas leaks can cause deadly explosions, fires, and asphyxiation. Natural gas is odorless, so suppliers add a distinctive rotten-egg smell (mercaptan) for detection. Partial or slow leaks are particularly dangerous because they are easy to miss. Knowing how to detect, respond to, and prevent gas leaks is a critical life skill for every household.',

        keyPoints: [
          'Natural gas is flammable and can explode when it reaches concentrations of 5-15% in air',
          'A rotten egg or sulfur smell inside a building is the primary warning sign of a gas leak',
          'Even a single spark from a light switch, phone, or cigarette can ignite leaking gas',
          'Carbon monoxide (another gas hazard) is completely odorless and colorless — a CO detector is essential',
          'LPG cylinders used in Indian homes have specific risks — always keep them in well-ventilated areas',
          'A hissing sound near gas lines or appliances is another key warning sign of a leak'
        ],

        preventionMeasures: [
          'Have all gas appliances (stoves, geysers, heaters) inspected and serviced annually by a certified technician',
          'Install gas detectors and carbon monoxide alarms in your kitchen and near sleeping areas',
          'Store LPG cylinders upright in well-ventilated areas away from heat sources and direct sunlight',
          'Regularly inspect rubber hoses and connections on gas appliances for cracks or wear',
          'Never use gas ovens or stoves for space heating — they produce dangerous carbon monoxide',
          'Turn off gas supply valves at the cylinder or meter when appliances are not in use',
          'Ensure adequate ventilation in all rooms where gas appliances are used — never block air vents',
          'Know the location of the main gas shut-off valve/regulator in your home or building'
        ],

        afterDisaster: [],

        images: [
          '/images/gas-detector.jpg',
          '/images/gas-shut-off.jpg',
          '/images/safe-evacuation-gas.jpg'
        ],

        videos: [
          {
            id: 'gas_intro',
            title: 'Understanding Gas Hazards at Home',
            description: 'Learn about natural gas properties, why leaks are dangerous, and how to detect them',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            thumbnail: '/images/thumbnails/gas-leak.jpg',
            duration: 210,
            section: 'introduction'
          },
          {
            id: 'gas_prevention',
            title: 'Gas Safety Prevention and Maintenance',
            description: 'Proper maintenance of gas appliances and how to use shut-off valves',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            thumbnail: '/images/thumbnails/gas-maintenance.jpg',
            duration: 195,
            section: 'preventionMeasures'
          },
          {
            id: 'gas_response',
            title: 'Responding to a Gas Leak Emergency',
            description: 'Step-by-step guide to evacuating safely when you detect a gas leak',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: '/images/thumbnails/gas-evacuation.jpg',
            duration: 180,
            section: 'preventionMeasures'
          }
        ]
      },
      quiz: {
        passingScore: 85,
        timeLimit: 15,
        questions: [
          {
            id: 'g1',
            question: 'What should you do FIRST if you smell gas indoors?',
            options: ['Turn on the lights to see better', 'Evacuate the building immediately without using any electrical switches', 'Call someone from inside the building', 'Open a window and light a candle to check the smell'],
            correctAnswer: 1,
            explanation: 'Evacuate immediately without using any electrical switches, appliances, or phones — even a tiny spark can ignite leaking gas and cause an explosion.',
            points: 15
          },
          {
            id: 'g2',
            question: 'What distinctive smell is added to natural gas so people can detect leaks?',
            options: ['A sweet, sugary smell', 'A rotten egg or sulfur smell', 'A smell like burning rubber', 'Natural gas has no added smell'],
            correctAnswer: 1,
            explanation: 'A chemical called mercaptan (which smells like rotten eggs or sulfur) is deliberately added to odorless natural gas so that leaks can be detected by smell.',
            points: 10
          },
          {
            id: 'g3',
            question: 'Why is carbon monoxide (CO) particularly dangerous?',
            options: ['It smells like rotten eggs', 'It is colorless and odorless — you cannot detect it without a detector', 'It only affects animals, not humans', 'It causes immediate unconsciousness'],
            correctAnswer: 1,
            explanation: 'Carbon monoxide is completely colorless and odorless, making it impossible to detect without a CO alarm. It causes fatal poisoning before victims even realize there is a problem.',
            points: 15
          },
          {
            id: 'g4',
            question: 'At what gas concentration in air can natural gas explode?',
            options: ['1-2%', '5-15%', '30-50%', 'Only at 100%'],
            correctAnswer: 1,
            explanation: 'Natural gas can ignite and explode when its concentration in air is between 5% and 15%. This is called the flammable range or explosive limit.',
            points: 10
          },
          {
            id: 'g5',
            question: 'Where should you call emergency services from during a gas leak?',
            options: ['From inside the building', 'From the building corridor', 'From at least 100 meters away from the building', 'From a neighboring building\'s window'],
            correctAnswer: 2,
            explanation: 'You must be at least 100 meters away from the building before using your phone, as mobile phones can generate sparks that ignite gas.',
            points: 10
          },
          {
            id: 'g6',
            question: 'How should LPG cylinders be stored at home?',
            options: ['Lying on their side in a closed cabinet', 'Upright in well-ventilated areas away from heat sources', 'In the refrigerator for safety', 'In a bedroom close to where they are used'],
            correctAnswer: 1,
            explanation: 'LPG cylinders must always be stored upright in well-ventilated areas away from heat sources and direct sunlight to prevent dangerous pressure buildup.',
            points: 10
          },
          {
            id: 'g7',
            question: 'What is a warning sign of a gas leak besides the smell?',
            options: ['The water turns brown', 'A hissing sound near gas lines or appliances', 'Electrical lights flickering', 'Cold patches on the floor'],
            correctAnswer: 1,
            explanation: 'A hissing or blowing sound near gas pipes, connections, or appliances indicates gas is escaping under pressure and is a serious warning sign.',
            points: 10
          },
          {
            id: 'g8',
            question: 'Why should you never use a gas oven or stove for space heating?',
            options: ['It wastes too much gas', 'It produces dangerous carbon monoxide which can be lethal in enclosed spaces', 'It damages the appliance', 'It increases your energy bill too much'],
            correctAnswer: 1,
            explanation: 'Gas appliances not designed for space heating produce dangerous levels of carbon monoxide. In an enclosed space, this can build up to fatal concentrations quickly.',
            points: 15
          },
          {
            id: 'g9',
            question: 'What is "Mercaptan"?',
            options: [
              'A type of gas pipe',
              'The chemical added to gas to give it a rotten-egg smell',
              'A safety valve',
              'A tool for fixing leaks'
            ],
            correctAnswer: 1,
            explanation: 'Mercaptan is the odorant added to natural gas to make leaks detectable by humans.',
            points: 10
          },
          {
            id: 'g10',
            question: 'What should you do if you suspect a gas leak but don\'t smell anything?',
            options: [
              'Ignore it',
              'Listen for hissing or look for bubbling in soapy water on connections',
              'Use a lighter to check',
              'Close all doors and sleep'
            ],
            correctAnswer: 1,
            explanation: 'Hissing sounds or bubbles in a soap solution are reliable ways to confirm a pressure leak.',
            points: 15
          },
          {
            id: 'g11',
            question: 'Why are pilot lights dangerous if the gas is not lit?',
            options: [
              'They use up oxygen',
              'They continuously release gas into the room',
              'They create too much light',
              'They make a clicking sound'
            ],
            correctAnswer: 1,
            explanation: 'An unlit gas valve will continuously fill a room with flammable gas until it reaches explosive levels.',
            points: 15
          },
          {
            id: 'g12',
            question: 'What should you do with your gas cylinder when going on vacation?',
            options: [
              'Leave it as is',
              'Close the main regulator valve tightly',
              'Turn it upside down',
              'Put it in the garage'
            ],
            correctAnswer: 1,
            explanation: 'Closing the main valve prevents any leaks from developing while the home is unoccupied.',
            points: 10
          },
          {
            id: 'g13',
            question: 'Which of these can detect carbon monoxide?',
            options: ['A smoke alarm', 'A specialized CO detector', 'A thermometer', 'A regular fan'],
            correctAnswer: 1,
            explanation: 'Carbon monoxide is odorless. Only a dedicated CO alarm can detect it before it becomes lethal.',
            points: 15
          },
          {
            id: 'g14',
            question: 'What is the risk of using a damaged rubber hose on an LPG cylinder?',
            options: [
              'The gas will smell better',
              'Gas can leak through cracks, leading to a fire or explosion',
              'The stove will be harder to light',
              'The food will cook faster'
            ],
            correctAnswer: 1,
            explanation: 'Old or cracked hoses are a major source of domestic gas leaks and fires.',
            points: 15
          },
          {
            id: 'g15',
            question: 'What is "Asphyxiation" in the context of a gas leak?',
            options: [
              'A type of skin rash',
              'Suffocation caused by gas replacing oxygen in the air',
              'A metal disease',
              'A high fever'
            ],
            correctAnswer: 1,
            explanation: 'Natural gas can displace oxygen in a closed room, leading to loss of consciousness and death by suffocation.',
            points: 10
          }
        ]
      }
    });
    console.log('✅ Gas leak module created');
    return module;
  } catch (error) { console.error(error); throw error; }
};

export const seedCollapseModule = async () => {
  try {
    const existing = await DisasterModule.findOne({ title: 'Building Collapse Survival' });
    if (existing) return existing;
    const module = await DisasterModule.create({
      title: 'Building Collapse Survival',
      description: 'Survival techniques, void space creation, and search & rescue basics for structural failures caused by earthquakes, explosions, or construction defects.',
      type: 'building_collapse',
      difficulty: 'advanced',
      estimatedTime: 40,
      content: {
        introduction: 'Building collapses are among the most terrifying and deadly emergencies. They can be caused by earthquakes, bomb blasts, gas explosions, structural defects, or overloading. India has witnessed tragic collapses due to illegal construction and poor building standards. Survival depends on creating protective spaces, signaling rescuers, and conserving energy while waiting for help. Understanding survivability concepts and rescue procedures can help you stay alive until Search & Rescue teams arrive.',

        keyPoints: [
          'Survival in a collapse depends on finding or creating "void spaces" — open areas created by falling structural elements',
          'The "triangle of life" concept: falling objects create triangular void spaces next to large, solid items like sofas or cars',
          'Do NOT run during a collapse — most injuries occur when people try to move through collapsing structures',
          'Tapping on pipes or walls in a regular pattern is the most effective way to signal your location to rescuers',
          'Conserving water, staying calm, and controlling breathing reduces oxygen depletion and improves survival odds',
          'Dust and particulates in collapse zones cause severe respiratory harm — cover your nose and mouth immediately'
        ],

        preventionMeasures: [
          'Report visible structural defects immediately: large cracks in walls, floors, or ceilings; sagging roofs; leaning walls',
          'Ensure buildings follow Bureau of Indian Standards (BIS) construction codes — never buy in unauthorized/illegal structures',
          'Identify the safest rooms in buildings you frequent: rooms with the most structural columns and interior walls',
          'Learn your school or workplace evacuation routes and assembly points for structural emergency scenarios',
          'Keep a personal emergency pouch with a whistle, small flashlight, and dust mask in your bag or nearby',
          'Do not overload floors or structures beyond their rated capacity with heavy materials or equipment',
          'Advocate for regular structural safety inspections of schools, public buildings, and housing'
        ],

        afterDisaster: [],

        images: [
          '/images/void-space-triangle.jpg',
          '/images/building-collapse-rescue.jpg',
          '/images/building-safety-inspection.jpg'
        ],

        videos: [
          {
            id: 'collapse_intro',
            title: 'Understanding Building Collapse',
            description: 'Introduction to structural risks, void spaces, and survivability science',
            url: 'https://drive.google.com/file/d/1MBWvJB7YEdOpdjPNKMxlynzwd7rmCPTj/preview',
            thumbnail: '/images/thumbnails/building-collapse.jpg',
            duration: 200,
            section: 'introduction'
          },
          {
            id: 'collapse_prep',
            title: 'Building Collapse Preparedness',
            description: 'Actions to take for survival and void-space creation inside collapsed buildings',
            url: 'https://drive.google.com/file/d/1tkHZlgDAPVhNPBW4vbiu83Ufm-TbMouy/preview',
            thumbnail: '/images/thumbnails/building-safety.jpg',
            duration: 220,
            section: 'preventionMeasures'
          },
          {
            id: 'collapse_rescue',
            title: 'Search and Rescue Operations',
            description: 'How rescue teams locate survivors and what to expect during a structural emergency rescue',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            thumbnail: '/images/thumbnails/search-rescue.jpg',
            duration: 260,
            section: 'afterDisaster'
          }
        ]
      },
      quiz: {
        passingScore: 80,
        timeLimit: 15,
        questions: [
          {
            id: 'b1',
            question: 'What is a critical action to secure survival during a building collapse?',
            options: ['Run down the stairs as fast as possible', 'Take cover BESIDE a large, solid piece of furniture to create a void space', 'Use an elevator to escape', 'Stand near large windows for fresh air'],
            correctAnswer: 1,
            explanation: 'Creating a void space beside (not under) sturdy furniture uses the "triangle of life" principle — falling debris often creates a protective space next to solid objects.',
            points: 15
          },
          {
            id: 'b2',
            question: 'How should you signal rescuers when trapped in rubble?',
            options: ['Shout continuously at the top of your voice', 'Tap regularly on pipes or walls (3 taps, pause, repeat)', 'Flash a light continuously', 'Move rubble to make loud crashing noises'],
            correctAnswer: 1,
            explanation: 'Regular tapping on metal pipes or solid walls travels further and conserves air. Shouting should only be done when you hear rescuers very close, as it quickly depletes oxygen.',
            points: 15
          },
          {
            id: 'b3',
            question: 'Why should you cover your nose and mouth immediately during a building collapse?',
            options: ['To block out the smell of gas', 'To prevent inhalation of dangerous dust and particulate matter', 'To stay warm', 'To block noise from the collapse'],
            correctAnswer: 1,
            explanation: 'Collapse debris generates massive clouds of pulverized concrete and hazardous particles. Inhaling these can cause serious respiratory damage or death.',
            points: 10
          },
          {
            id: 'b4',
            question: 'What does "crush syndrome" mean in the context of building collapse survival?',
            options: ['A fear of small spaces', 'A life-threatening condition caused by toxins released when crushed muscles are freed', 'A type of structural failure', 'Panic due to being trapped'],
            correctAnswer: 1,
            explanation: 'Crush syndrome occurs when muscles crushed under debris release toxic myoglobin into the bloodstream when pressure is relieved. This can cause kidney failure and requires immediate medical treatment.',
            points: 10
          },
          {
            id: 'b5',
            question: 'What visible signs should prompt you to immediately vacate a building?',
            options: ['Paint peeling or minor hairline cracks', 'Large cracks in load-bearing walls, sagging ceilings, or floors that bounce underfoot', 'Slightly sticky doors or windows', 'Dusty or old-looking walls'],
            correctAnswer: 1,
            explanation: 'Large structural cracks, sagging or bowing walls/ceilings, and floors that feel springy or bounce are serious indicators of structural instability requiring immediate evacuation.',
            points: 10
          },
          {
            id: 'b6',
            question: 'Why should you NOT use lighters or matches while trapped in collapse rubble?',
            options: ['They waste energy', 'Ruptured gas lines may be present — any flame could cause a deadly explosion', 'They would attract rescuers to the wrong location', 'They create too much smoke'],
            correctAnswer: 1,
            explanation: 'Building collapses frequently rupture gas lines. Even a small spark or flame can ignite accumulated gas, causing a secondary explosion that endangers both survivors and rescuers.',
            points: 15
          },
          {
            id: 'b7',
            question: 'What is the recommended action if you are rescued but feel uninjured?',
            options: ['Immediately return to help others inside', 'Lie flat and seek immediate medical evaluation — injuries may not be immediately apparent', 'Stand up and run from the building', 'Drink large amounts of water immediately'],
            correctAnswer: 1,
            explanation: 'Internal injuries, crush syndrome, and shock can develop hours after a collapse. All survivors should receive medical evaluation regardless of how they feel immediately after rescue.',
            points: 10
          },
          {
            id: 'b8',
            question: 'What is a key way to help prevent building collapses?',
            options: ['Only use very old, established buildings', 'Report structural defects and advocate for regular safety inspections', 'Avoid using elevators', 'Live on the ground floor only'],
            correctAnswer: 1,
            explanation: 'Reporting visible structural defects (large cracks, sagging elements) and supporting regular building safety inspections are the most effective community-level prevention strategies.',
            points: 15
          },
          {
            id: 'b9',
            question: 'What is a "Void Space"?',
            options: [
              'An empty room',
              'A protective space created when structural elements fall and lean against each other',
              'A place where no one is allowed',
              'The space outside a building'
            ],
            correctAnswer: 1,
            explanation: 'Void spaces are the only places survivors can be found alive under rubble.',
            points: 15
          },
          {
            id: 'b10',
            question: 'Which of these is a sign of a structural "load-bearing" failure?',
            options: [
              'Peeling wallpaper',
              'Deep "X" or diagonal cracks in thick walls or columns',
              'A squeaky door',
              'A dirty floor'
            ],
            correctAnswer: 1,
            explanation: 'Diagonal or X-shaped cracks in columns or major walls indicate that the structure is under extreme stress and near failure.',
            points: 15
          },
          {
            id: 'b11',
            question: 'What is "Pancake Collapse"?',
            options: [
              'A fire in a kitchen',
              'A failure where multiple floors fall flat on top of each other',
              'A type of soil erosion',
              'A method of demolition'
            ],
            correctAnswer: 1,
            explanation: 'Pancake collapses are the most deadly as they leave very few void spaces for survival.',
            points: 10
          },
          {
            id: 'b12',
            question: 'Why is it important to conserve energy while trapped in a collapse?',
            options: [
              'To save money',
              'To reduce oxygen consumption and stay alive longer',
              'To keep from getting hungry',
              'To stay cool'
            ],
            correctAnswer: 1,
            explanation: 'Staying calm and minimizing physical exertion helps you use the limited oxygen available in a void space.',
            points: 15
          },
          {
            id: 'b13',
            question: 'What should you do if you see a building leaning?',
            options: [
              'Take a photo',
              'Stay away and report it to the municipal authorities immediately',
              'Try to push it back',
              'Wait and see if it falls'
            ],
            correctAnswer: 1,
            explanation: 'A leaning building is a sign of foundation failure and could collapse at any moment.',
            points: 10
          },
          {
            id: 'b14',
            question: 'What material is most resilient during an earthquake collapse?',
            options: ['Unreinforced brick', 'Reinforced concrete with proper steel binding', 'Mud and straw', 'Plain glass'],
            correctAnswer: 1,
            explanation: 'Reinforced concrete is designed to bend and hold together even under extreme stress.',
            points: 10
          },
          {
            id: 'b15',
            question: 'Who are "First Responders" in a collapse scenario?',
            options: [
              'Neighbors and bystanders who are already there',
              'Only professional NDRF teams',
              'The police only',
              'The media'
            ],
            correctAnswer: 0,
            explanation: 'While professionals are essential, the first people on the scene are usually local residents who can provide immediate, life-saving help.',
            points: 10
          }
        ]
      }
    });
    console.log('✅ Building collapse module created');
    return module;
  } catch (error) { console.error(error); throw error; }
};

export const seedAllModules = async () => {
  try {
    console.log('🌱 Seeding disaster preparedness data...');

    // Clear existing modules first to avoid conflicts
    // await clearExistingModules();

    await seedEarthquakeModule();
    await seedFloodModule();
    await seedFireModule();
    await seedCycloneModule();
    await seedHeatwaveModule();
    await seedDroughtModule();
    await seedTornadoModule();
    await seedGasLeakModule();
    await seedCollapseModule();
    await seedBadges();
    await seedEmergencyContacts();
    await seedDemoUsers();

    console.log('✅ All data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};
