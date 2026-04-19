/**
 * updateModuleContent.js
 * Updates modules 4-9 in MongoDB with full rich content.
 * Run with: node updateModuleContent.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
if (!uri) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

mongoose.connect(uri).then(() => console.log('✅ Connected to MongoDB')).catch(err => {
    console.error('❌ Connection error:', err);
    process.exit(1);
});

const DisasterModuleSchema = new mongoose.Schema({}, { strict: false });
const DisasterModule = mongoose.model('DisasterModule', DisasterModuleSchema, 'disastermodules');

const updates = [
    // --- CYCLONE ---
    {
        filter: { title: 'Cyclone Preparedness' },
        update: {
            $set: {
                'quiz.timeLimit': 15,
                'quiz.questions': [
                    { id: 'cyclone_q1', question: 'What is the primary danger from cyclonic weather in India?', options: ['Storm surge', 'Heavy rainfall and flooding', 'Tornadoes', 'Hail'], correctAnswer: 1, explanation: "India's main risk from cyclonic weather is heavy rainfall leading to flooding.", points: 15 },
                    { id: 'cyclone_q2', question: 'When should you evacuate during a cyclone warning?', options: ['During the storm', 'After the storm passes', 'Before dangerous conditions arrive', 'Never evacuate'], correctAnswer: 2, explanation: 'Evacuation should be completed before dangerous weather conditions arrive.', points: 15 },
                    { id: 'cyclone_q3', question: 'What should you do if you go outside during the eye of a cyclone?', options: ['It is safe to stay outside during the eye', 'Return indoors immediately — the back wall of the storm will arrive soon', 'Call emergency services', 'Start cleanup operations'], correctAnswer: 1, explanation: 'The eye of a cyclone brings a brief calm, but the back wall of the storm arrives soon after with renewed destructive winds.', points: 15 },
                    { id: 'cyclone_q4', question: 'How much advance warning can cyclone tracking systems provide?', options: ['1-6 hours', '12-24 hours', '48-72 hours', 'More than a week'], correctAnswer: 2, explanation: 'Modern cyclone tracking systems can typically provide 48-72 hours of advance warning, giving residents time to prepare or evacuate.', points: 10 },
                    { id: 'cyclone_q5', question: 'What is the safest room to shelter in during a cyclone?', options: ['A room with windows to monitor the storm', 'The largest room in the house', 'A small interior room on the lowest floor', 'The garage'], correctAnswer: 2, explanation: 'A small interior room on the lowest floor away from windows provides the best protection from cyclone winds and flying debris.', points: 15 },
                    { id: 'cyclone_q6', question: 'Why should you boil water after a cyclone?', options: ['To make it taste better', 'Water supplies may be contaminated', 'Authority rules require it', 'To kill mosquitoes'], correctAnswer: 1, explanation: 'Cyclones can contaminate water supplies with sewage, debris, and bacteria. Authorities may issue boil-water advisories for safety.', points: 10 },
                    { id: 'cyclone_q7', question: 'Which month range is India most at risk from severe cyclonic weather?', options: ['January to March', 'April to June', 'July to September (Monsoon)', 'October to December'], correctAnswer: 2, explanation: "India's monsoon season (July-September) brings heavy rains and cyclonic weather systems that pose the greatest risk.", points: 10 },
                    { id: 'cyclone_q8', question: 'What should you do with outdoor furniture and loose objects before a cyclone?', options: ['Leave them outside as usual', 'Secure or bring them indoors to prevent them becoming projectiles', 'Move them away from the house', 'Tie them to trees'], correctAnswer: 1, explanation: 'Loose outdoor objects can become deadly projectiles in cyclone-force winds. Secure or bring them inside before the storm arrives.', points: 10 }
                ]
            }
        }
    },
    // --- HEATWAVE ---
    {
        filter: { title: 'Heatwave Safety' },
        update: {
            $set: {
                'quiz.timeLimit': 12,
                'quiz.questions': [
                    { id: 'heat_q1', question: 'What temperature can India reach during peak summer?', options: ['40°C', '45°C', '48°C', '50°C'], correctAnswer: 2, explanation: 'India can reach temperatures of 48°C (118°F) during peak summer.', points: 10 },
                    { id: 'heat_q2', question: 'What are the hottest hours of the day to avoid during a heatwave?', options: ['8 AM - 12 PM', '10 AM - 4 PM', '12 PM - 6 PM', '2 PM - 8 PM'], correctAnswer: 1, explanation: '10 AM to 4 PM are typically the hottest and most dangerous hours during a heatwave.', points: 15 },
                    { id: 'heat_q3', question: 'Which group of people is MOST vulnerable during a heatwave?', options: ['Teenagers', 'Adults aged 20-40', 'Elderly, children, and people with chronic conditions', 'Athletes'], correctAnswer: 2, explanation: 'Elderly people, young children, and those with chronic conditions are most susceptible to heat-related illness because their bodies regulate temperature less effectively.', points: 10 },
                    { id: 'heat_q4', question: 'What is a key warning sign of heat stroke (a medical emergency)?', options: ['Excessive sweating', 'Hot, dry skin with confusion or loss of consciousness', 'Mild headache', 'Feeling thirsty'], correctAnswer: 1, explanation: 'Heat stroke causes the body to stop sweating (skin becomes hot and dry) and is accompanied by confusion or unconsciousness. This is a medical emergency — call for help immediately.', points: 15 },
                    { id: 'heat_q5', question: 'Why should you avoid alcohol and caffeine during extreme heat?', options: ['They cause sunburn', 'They accelerate dehydration', 'They raise blood pressure', 'They are not allowed outdoors'], correctAnswer: 1, explanation: 'Alcohol and caffeine are diuretics that cause the body to lose more water through urination, accelerating dangerous dehydration during extreme heat.', points: 10 },
                    { id: 'heat_q6', question: 'What is the correct first aid for someone showing signs of heat exhaustion?', options: ['Give them hot drinks to warm them up', 'Move them to a cool place, give cool water, and apply cool wet cloths', 'Have them exercise to increase circulation', 'Leave them alone to rest in the sun'], correctAnswer: 1, explanation: 'Move the person to a cool environment, provide cool water to drink, and apply cool wet cloths to their skin. If symptoms worsen or they lose consciousness, call emergency services.', points: 15 },
                    { id: 'heat_q7', question: 'What is one of the most dangerous things you can do during a heatwave?', options: ['Drink water regularly', 'Leave a child or pet in a parked vehicle', 'Wear light-colored clothing', 'Stay in air conditioning'], correctAnswer: 1, explanation: 'The temperature inside a parked car can rise 20°C above outside temperature within minutes, becoming lethal for children or pets.', points: 15 },
                    { id: 'heat_q8', question: 'Which type of clothing is best to wear during a heatwave?', options: ['Dark, tight-fitting synthetic clothes', 'Loose-fitting, light-colored, lightweight clothes', 'No clothes at all', 'Heavy cotton for protection'], correctAnswer: 1, explanation: 'Loose, light-colored, lightweight clothing reflects sunlight and allows sweat to evaporate, helping your body stay cool.', points: 10 }
                ]
            }
        }
    },
    // --- DROUGHT ---
    {
        filter: { title: 'Drought Preparedness' },
        update: {
            $set: {
                'quiz.questions': [
                    { id: 'drought_q1', question: 'What is the most efficient irrigation method during drought?', options: ['Flood irrigation', 'Sprinkler irrigation', 'Drip irrigation', 'Channel irrigation'], correctAnswer: 2, explanation: 'Drip irrigation delivers water directly to plant roots with minimal waste, making it the most efficient method during water-scarce conditions.', points: 15 },
                    { id: 'drought_q2', question: 'What should be the priority for water use during drought?', options: ['Irrigation first', 'Drinking and essential human needs', 'Cleaning vehicles', 'Maintaining lawns and gardens'], correctAnswer: 1, explanation: 'Drinking water and essential human health needs must always be prioritized during drought conditions.', points: 15 },
                    { id: 'drought_q3', question: 'What is rainwater harvesting?', options: ['A type of irrigation system', 'Collecting and storing rainwater from rooftops and surfaces for future use', 'A technique to make it rain', 'Transporting water from rivers'], correctAnswer: 1, explanation: 'Rainwater harvesting involves collecting and storing runoff from rooftops and other surfaces during rainy periods to use during dry spells.', points: 10 },
                    { id: 'drought_q4', question: 'What role does mulching play during a drought?', options: ['It increases evaporation to cool plants', 'It reduces evaporation and retains soil moisture', 'It adds nutrients directly to plants', 'It attracts more rainfall'], correctAnswer: 1, explanation: 'Mulching around plants reduces water evaporation from the soil surface, retains moisture, and helps plants survive longer without irrigation.', points: 10 },
                    { id: 'drought_q5', question: 'How long can a drought last?', options: ['Only a few days', 'A week at most', 'Months or even years', 'Exactly one season'], correctAnswer: 2, explanation: 'Droughts can persist for months or even years, making long-term water management and adaptation strategies essential.', points: 10 },
                    { id: 'drought_q6', question: 'Which crop type is best suited for drought-prone regions?', options: ['Rice, which requires flooded fields', 'Water-intensive vegetables', 'Drought-resistant varieties like millets and sorghum', 'Any crop with heavy watering'], correctAnswer: 2, explanation: 'Drought-resistant crops like millets, sorghum, and specifically bred drought-tolerant varieties are best suited for water-scarce conditions.', points: 15 },
                    { id: 'drought_q7', question: 'What is a key sign of dehydration to watch for in livestock during drought?', options: ['Increased energy levels', 'Sunken eyes, lethargy, and reduced food and water intake', 'Faster growth rate', 'Increased milk production'], correctAnswer: 1, explanation: 'Sunken eyes, lethargy, decreased food intake, and reduced urination are key signs of dehydration in livestock that require immediate attention.', points: 10 },
                    { id: 'drought_q8', question: 'Why is community cooperation important during drought?', options: ['It is not important — individual action is enough', 'Water resources are shared and fair distribution requires coordination', 'Communities own more water naturally', 'Government prefers community management'], correctAnswer: 1, explanation: 'Water resources like rivers, groundwater, and reservoirs are shared. Community coordination ensures fair distribution and prevents conflicts during water scarcity.', points: 15 }
                ]
            }
        }
    },
    // --- TORNADO ---
    {
        filter: { title: 'Tornado Safety Guide' },
        update: {
            $set: {
                description: "Essential procedures for tornado warnings and severe wind events. Learn to recognize warning signs, find shelter, and protect your life during one of nature's most violent storms.",
                'content.introduction': 'Tornadoes are violently rotating columns of air that can reach wind speeds over 300 km/h, capable of destroying buildings and lifting vehicles in seconds. India, particularly in the Indo-Gangetic plains and eastern states, can experience severe wind events and tornado-like storms (locally called "dust devils" or "loo storms") during pre-monsoon and monsoon seasons. Recognizing warning signs and knowing where to shelter can mean the difference between life and death.',
                'content.keyPoints': [
                    'Tornadoes can form within minutes from severe thunderstorms with little to no warning',
                    'A dark, greenish sky, large hail, and a loud roaring sound like a freight train are key warning signs',
                    'Mobile homes and temporary structures offer NO protection against tornadoes — always evacuate to a sturdy building',
                    'The safest shelter is an interior room on the lowest floor of a sturdy building, away from all windows',
                    'Overpasses and highway bridges offer extremely dangerous shelter — wind speeds are actually higher there',
                    'Battery-powered radios and weather alert systems can provide life-saving advance warnings'
                ],
                'content.preventionMeasures': [
                    'Identify the safest room in your home or school — interior rooms away from windows on the lowest floor',
                    'Sign up for local weather alert services and keep a battery-powered radio charged',
                    'Prepare an emergency kit with water, food, first aid supplies, flashlights, and important documents',
                    'Practice tornado drills at home and school so everyone knows exactly where to go',
                    'Secure or store outdoor furniture and loose objects that can become dangerous projectiles',
                    'Know the difference between a Tornado Watch (conditions are favorable) and a Tornado Warning (a tornado has been sighted)',
                    'If living in a mobile home, identify the nearest sturdy building and plan to evacuate quickly'
                ],
                'content.duringDisaster': [
                    'Immediately go to a pre-designated shelter area — an interior room on the lowest floor',
                    'Stay away from all windows, doors, and exterior walls at all times',
                    'Crouch down, cover your head and neck with your arms, and face down or lie flat',
                    'If outdoors and cannot reach shelter, lie flat in a low ditch or depression — do NOT shelter under a bridge',
                    'If in a vehicle, do NOT try to outrun a tornado on roads; abandon the vehicle and find a sturdy building',
                    'Do not try to open windows — this is a dangerous myth and wastes precious time',
                    'Stay sheltered even after the tornado passes — multiple tornadoes can form from the same storm system'
                ],
                'content.afterDisaster': [
                    'Wait for official all-clear before leaving your shelter — multiple tornadoes can follow',
                    'Watch carefully for downed power lines, broken glass, structural instability, and debris',
                    'Do not enter severely damaged buildings until cleared by authorities for structural safety',
                    'Check yourself and others for injuries and provide first aid as needed',
                    'Document all damage thoroughly with photos for insurance and government assistance claims',
                    'Report hazardous situations like gas leaks, downed power lines, and structural collapse to authorities immediately',
                    'Check on neighbors, especially elderly and disabled residents who may need assistance',
                    'Cooperate with emergency responders and follow any evacuation orders promptly'
                ],
                'content.images': ['/images/tornado-shelter-map.jpg', '/images/tornado-warning-signs.jpg', '/images/tornado-safety-position.jpg'],
                'content.videos': [
                    { id: 'tornado_intro', title: 'Understanding Tornadoes and Severe Storms', description: 'Learn how tornadoes form, their warning signs, and the tornado intensity scale', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', thumbnail: '/images/thumbnails/tornado-intro.jpg', duration: 240, section: 'introduction' },
                    { id: 'tornado_shelter', title: 'Finding Safe Shelter During a Tornado', description: 'Step-by-step guide to identifying and reaching the safest shelter', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', thumbnail: '/images/thumbnails/tornado-shelter.jpg', duration: 180, section: 'preventionMeasures' },
                    { id: 'tornado_action', title: 'What To Do When a Tornado Strikes', description: 'Real-time actions to take during a tornado emergency', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', thumbnail: '/images/thumbnails/tornado-action.jpg', duration: 200, section: 'duringDisaster' }
                ],
                'quiz.passingScore': 80,
                'quiz.timeLimit': 15,
                'quiz.questions': [
                    { id: 't1', question: 'What is the best place to shelter during a tornado?', options: ['Near a window to monitor the storm', 'In a car to drive away', 'An interior room on the lowest floor of a sturdy building', 'Under a highway bridge or overpass'], correctAnswer: 2, explanation: 'An interior room on the lowest floor away from windows provides the best protection from flying debris. Overpasses are actually more dangerous due to increased wind speed.', points: 15 },
                    { id: 't2', question: 'What sound is commonly associated with an approaching tornado?', options: ['A high-pitched whistle', 'Complete silence', 'A loud roar similar to a freight train', 'Thunder and lightning only'], correctAnswer: 2, explanation: 'A loud continuous roar (like a freight train or jet engine) is a classic warning sign of an approaching tornado.', points: 10 },
                    { id: 't3', question: 'What is the difference between a Tornado Watch and a Tornado Warning?', options: ['They mean the same thing', 'A Watch means a tornado has been sighted; Warning means conditions are favorable', 'A Watch means conditions are favorable; Warning means a tornado has been sighted or detected', 'Watch is for daytime; Warning is for nighttime'], correctAnswer: 2, explanation: 'A Tornado Watch means weather conditions could produce a tornado. A Tornado Warning means a tornado has been sighted or detected on radar — take immediate shelter.', points: 15 },
                    { id: 't4', question: 'If you are outdoors and cannot reach shelter during a tornado, what should you do?', options: ['Take shelter under a highway overpass', 'Lie flat in a low ditch or depression away from trees', 'Climb a tree for higher visibility', 'Stay in your vehicle with seatbelt on'], correctAnswer: 1, explanation: 'If no shelter is available, lie flat in a low ditch or depression, cover head and neck. Overpasses are extremely dangerous. Never shelter under trees.', points: 15 },
                    { id: 't5', question: 'Which type of structure provides LEAST protection during a tornado?', options: ['A concrete building basement', 'An interior room of a brick home', 'A mobile home or temporary structure', 'A school gymnasium (interior)'], correctAnswer: 2, explanation: 'Mobile homes and temporary structures offer virtually no protection during a tornado and should always be evacuated when a warning is issued.', points: 10 },
                    { id: 't6', question: 'What is a common visible warning sign of a tornado threat?', options: ['A bright, sunny sky with no clouds', 'A dark greenish sky with large hail', 'A rainbow forming in the east', 'Light morning fog'], correctAnswer: 1, explanation: 'A dark, greenish sky is caused by hail in the clouds and is a recognized warning sign of severe storms that can produce tornadoes. Large hail often precedes a tornado.', points: 10 },
                    { id: 't7', question: 'Why should you NOT open windows when a tornado approaches?', options: ['It helps equalize pressure and is actually recommended', 'Opening windows is a dangerous myth that wastes precious sheltering time', 'It allows water to enter the building', 'Windows should be opened only if you are on the top floor'], correctAnswer: 1, explanation: 'The idea that opening windows equalizes pressure is a dangerous myth. Tornado damage is caused by violent winds, not pressure differences. Use that time to reach shelter instead.', points: 15 },
                    { id: 't8', question: 'What should you use to protect your head and neck during a tornado?', options: ['A metal helmet', 'Your arms and hands, or a blanket/pillow', 'A plastic bag', 'No protection needed — just stay still'], correctAnswer: 1, explanation: 'Cover your head and neck with your arms, and if available, use a blanket, pillow, or mattress for additional protection against debris.', points: 10 }
                ]
            }
        }
    },
    // --- GAS LEAK ---
    {
        filter: { title: 'Gas Leak Response' },
        update: {
            $set: {
                description: 'How to detect and safely respond to gas leak incidents at home, school, and in public places. Learn the critical steps that can prevent explosions and protect lives.',
                'content.introduction': 'Natural gas and LPG (Liquefied Petroleum Gas) are widely used for cooking and heating across India. While safe when used properly, gas leaks can cause deadly explosions, fires, and asphyxiation. Natural gas is odorless, so suppliers add a distinctive rotten-egg smell (mercaptan) for detection. Partial or slow leaks are particularly dangerous because they are easy to miss. Knowing how to detect, respond to, and prevent gas leaks is a critical life skill for every household.',
                'content.keyPoints': [
                    'Natural gas is flammable and can explode when it reaches concentrations of 5-15% in air',
                    'A rotten egg or sulfur smell inside a building is the primary warning sign of a gas leak',
                    'Even a single spark from a light switch, phone, or cigarette can ignite leaking gas',
                    'Carbon monoxide (another gas hazard) is completely odorless and colorless — a CO detector is essential',
                    'LPG cylinders used in Indian homes have specific risks — always keep them in well-ventilated areas',
                    'A hissing sound near gas lines or appliances is another key warning sign of a leak'
                ],
                'content.preventionMeasures': [
                    'Have all gas appliances (stoves, geysers, heaters) inspected and serviced annually by a certified technician',
                    'Install gas detectors and carbon monoxide alarms in your kitchen and near sleeping areas',
                    'Store LPG cylinders upright in well-ventilated areas away from heat sources and direct sunlight',
                    'Regularly inspect rubber hoses and connections on gas appliances for cracks or wear',
                    'Never use gas ovens or stoves for space heating — they produce dangerous carbon monoxide',
                    'Turn off gas supply valves at the cylinder or meter when appliances are not in use',
                    'Ensure adequate ventilation in all rooms where gas appliances are used — never block air vents',
                    'Know the location of the main gas shut-off valve/regulator in your home or building'
                ],
                'content.duringDisaster': [
                    'Do NOT use any electrical switches, appliances, phones, or lighters — even a small spark can ignite gas',
                    'Leave the building immediately, leaving doors open as you go to help ventilate',
                    'Do NOT use elevators — use the stairs, keeping movement calm and steady',
                    'Once outside, move at least 100 meters away from the building before using your phone',
                    'Call emergency services (fire brigade: 101) and your gas supplier from a safe distance',
                    'Warn neighbors and discourage anyone from entering the building',
                    'If you cannot evacuate, open windows (if reachable without using electricity) and stay low to the floor',
                    'If you smell gas in a vehicle, pull over safely, exit, and move far away before calling for help'
                ],
                'content.afterDisaster': [
                    'Do NOT re-enter the building until cleared by emergency services and the gas company',
                    'Do not turn on any lights, appliances, or electronics until professionals confirm the leak is fixed and ventilated',
                    'Have a certified gas engineer inspect and repair all affected appliances and connections before use',
                    'Ventilate the building thoroughly for several hours after professional clearance is given',
                    'Check all occupants for symptoms of gas exposure: dizziness, nausea, headache, confusion',
                    'Seek medical attention if anyone shows symptoms — even carbon monoxide exposure requires treatment',
                    'Report the incident to your gas supplier and local authorities for documentation',
                    'Review and update your emergency plan to practice gas leak drills with your family'
                ],
                'content.images': ['/images/gas-detector.jpg', '/images/gas-shut-off.jpg', '/images/safe-evacuation-gas.jpg'],
                'content.videos': [
                    { id: 'gas_intro', title: 'Understanding Gas Hazards at Home', description: 'Learn about natural gas properties, why leaks are dangerous, and how to detect them', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', thumbnail: '/images/thumbnails/gas-leak.jpg', duration: 210, section: 'introduction' },
                    { id: 'gas_prevention', title: 'Gas Safety Prevention and Maintenance', description: 'Proper maintenance of gas appliances and how to use shut-off valves', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', thumbnail: '/images/thumbnails/gas-maintenance.jpg', duration: 195, section: 'preventionMeasures' },
                    { id: 'gas_response', title: 'Responding to a Gas Leak Emergency', description: 'Step-by-step guide to evacuating safely when you detect a gas leak', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', thumbnail: '/images/thumbnails/gas-evacuation.jpg', duration: 180, section: 'duringDisaster' }
                ],
                'quiz.passingScore': 85,
                'quiz.timeLimit': 15,
                'quiz.questions': [
                    { id: 'g1', question: 'What should you do FIRST if you smell gas indoors?', options: ['Turn on the lights to see better', 'Evacuate the building immediately without using any electrical switches', 'Call someone from inside the building', 'Open a window and light a candle to check the smell'], correctAnswer: 1, explanation: 'Evacuate immediately without using any electrical switches, appliances, or phones — even a tiny spark can ignite leaking gas and cause an explosion.', points: 15 },
                    { id: 'g2', question: 'What distinctive smell is added to natural gas so people can detect leaks?', options: ['A sweet, sugary smell', 'A rotten egg or sulfur smell', 'A smell like burning rubber', 'Natural gas has no added smell'], correctAnswer: 1, explanation: 'A chemical called mercaptan (which smells like rotten eggs or sulfur) is deliberately added to odorless natural gas so that leaks can be detected by smell.', points: 10 },
                    { id: 'g3', question: 'Why is carbon monoxide (CO) particularly dangerous?', options: ['It smells like rotten eggs', 'It is colorless and odorless — you cannot detect it without a detector', 'It only affects animals, not humans', 'It causes immediate unconsciousness'], correctAnswer: 1, explanation: 'Carbon monoxide is completely colorless and odorless, making it impossible to detect without a CO alarm. It causes fatal poisoning before victims even realize there is a problem.', points: 15 },
                    { id: 'g4', question: 'At what gas concentration in air can natural gas explode?', options: ['1-2%', '5-15%', '30-50%', 'Only at 100%'], correctAnswer: 1, explanation: 'Natural gas can ignite and explode when its concentration in air is between 5% and 15%. This is called the flammable range or explosive limit.', points: 10 },
                    { id: 'g5', question: 'Where should you call emergency services from during a gas leak?', options: ['From inside the building', 'From the building corridor', 'From at least 100 meters away from the building', "From a neighboring building's window"], correctAnswer: 2, explanation: 'You must be at least 100 meters away from the building before using your phone, as mobile phones can generate sparks that ignite gas.', points: 10 },
                    { id: 'g6', question: 'How should LPG cylinders be stored at home?', options: ['Lying on their side in a closed cabinet', 'Upright in well-ventilated areas away from heat sources', 'In the refrigerator for safety', 'In a bedroom close to where they are used'], correctAnswer: 1, explanation: 'LPG cylinders must always be stored upright in well-ventilated areas away from heat sources and direct sunlight to prevent dangerous pressure buildup.', points: 10 },
                    { id: 'g7', question: 'What is a warning sign of a gas leak besides the smell?', options: ['The water turns brown', 'A hissing sound near gas lines or appliances', 'Electrical lights flickering', 'Cold patches on the floor'], correctAnswer: 1, explanation: 'A hissing or blowing sound near gas pipes, connections, or appliances indicates gas is escaping under pressure and is a serious warning sign.', points: 10 },
                    { id: 'g8', question: 'Why should you never use a gas oven or stove for space heating?', options: ['It wastes too much gas', 'It produces dangerous carbon monoxide which can be lethal in enclosed spaces', 'It damages the appliance', 'It increases your energy bill too much'], correctAnswer: 1, explanation: 'Gas appliances not designed for space heating produce dangerous levels of carbon monoxide. In an enclosed space, this can build up to fatal concentrations quickly.', points: 15 }
                ]
            }
        }
    },
    // --- BUILDING COLLAPSE ---
    {
        filter: { title: 'Building Collapse Survival' },
        update: {
            $set: {
                description: 'Survival techniques, void space creation, and search & rescue basics for structural failures caused by earthquakes, explosions, or construction defects.',
                'content.introduction': 'Building collapses are among the most terrifying and deadly emergencies. They can be caused by earthquakes, bomb blasts, gas explosions, structural defects, or overloading. India has witnessed tragic collapses due to illegal construction and poor building standards. Survival depends on creating protective spaces, signaling rescuers, and conserving energy while waiting for help. Understanding survivability concepts and rescue procedures can help you stay alive until Search & Rescue teams arrive.',
                'content.keyPoints': [
                    'Survival in a collapse depends on finding or creating "void spaces" — open areas created by falling structural elements',
                    'The "triangle of life" concept: falling objects create triangular void spaces next to large, solid items like sofas or cars',
                    'Do NOT run during a collapse — most injuries occur when people try to move through collapsing structures',
                    'Tapping on pipes or walls in a regular pattern is the most effective way to signal your location to rescuers',
                    'Conserving water, staying calm, and controlling breathing reduces oxygen depletion and improves survival odds',
                    'Dust and particulates in collapse zones cause severe respiratory harm — cover your nose and mouth immediately'
                ],
                'content.preventionMeasures': [
                    'Report visible structural defects immediately: large cracks in walls, floors, or ceilings; sagging roofs; leaning walls',
                    'Ensure buildings follow Bureau of Indian Standards (BIS) construction codes — never buy in unauthorized/illegal structures',
                    'Identify the safest rooms in buildings you frequent: rooms with the most structural columns and interior walls',
                    'Learn your school or workplace evacuation routes and assembly points for structural emergency scenarios',
                    'Keep a personal emergency pouch with a whistle, small flashlight, and dust mask in your bag or nearby',
                    'Do not overload floors or structures beyond their rated capacity with heavy materials or equipment',
                    'Advocate for regular structural safety inspections of schools, public buildings, and housing'
                ],
                'content.duringDisaster': [
                    'If you sense a collapse starting, immediately take cover beside a large, solid piece of furniture (sofa, car) — not under it',
                    'Cover your nose and mouth with clothing or any available fabric to avoid inhaling dangerous dust and particles',
                    'Try to stay near an exterior wall to increase your visibility and access for rescue teams',
                    'Stay completely calm — panic increases oxygen consumption and can lead to poor decisions',
                    'Do not use lighters or matches — gas lines may have ruptured and any flame could cause an explosion',
                    'If trapped, tap slowly and regularly on pipes, walls, or debris so rescuers can locate you — shout only as a last resort to conserve air',
                    'Do not move unnecessary debris that could cause secondary collapses — only move what is essential to breathe or survive'
                ],
                'content.afterDisaster': [
                    'Once the immediate collapse stops, assess your injuries — do not move if spinal injury is suspected',
                    'Create an air passage if needed by carefully clearing debris around your face to improve breathing',
                    'Signal rescuers using tapping (3 taps, pause, 3 taps) on metal pipes or solid walls rather than shouting repeatedly',
                    'Conserve water and ration any food or water you may have — rescues can take hours or even days',
                    'If you can hear rescuers approaching, shout and tap loudly to give them your precise location',
                    'Do not eat or drink anything from the collapse debris — food and water may be contaminated',
                    'Once rescued, lie flat and do not stand up suddenly — your body may be in shock from stress and dehydration',
                    'Seek immediate medical evaluation even if you feel uninjured — internal injuries and crush syndrome develop over hours'
                ],
                'content.images': ['/images/void-space-triangle.jpg', '/images/building-collapse-rescue.jpg', '/images/building-safety-inspection.jpg'],
                'content.videos': [
                    { id: 'collapse_intro', title: 'Understanding Building Collapse', description: 'Introduction to structural risks, void spaces, and survivability science', url: 'https://drive.google.com/file/d/1MBWvJB7YEdOpdjPNKMxlynzwd7rmCPTj/preview', thumbnail: '/images/thumbnails/building-collapse.jpg', duration: 200, section: 'introduction' },
                    { id: 'collapse_prep', title: 'Building Collapse Preparedness', description: 'Actions to take for survival and void-space creation inside collapsed buildings', url: 'https://drive.google.com/file/d/1tkHZlgDAPVhNPBW4vbiu83Ufm-TbMouy/preview', thumbnail: '/images/thumbnails/building-safety.jpg', duration: 220, section: 'preventionMeasures' },
                    { id: 'collapse_rescue', title: 'Search and Rescue Operations', description: 'How rescue teams locate survivors and what to expect during a structural emergency rescue', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', thumbnail: '/images/thumbnails/search-rescue.jpg', duration: 260, section: 'afterDisaster' }
                ],
                'quiz.passingScore': 80,
                'quiz.timeLimit': 15,
                'quiz.questions': [
                    { id: 'b1', question: 'What is a critical action to secure survival during a building collapse?', options: ['Run down the stairs as fast as possible', 'Take cover BESIDE a large, solid piece of furniture to create a void space', 'Use an elevator to escape', 'Stand near large windows for fresh air'], correctAnswer: 1, explanation: 'Creating a void space beside (not under) sturdy furniture uses the "triangle of life" principle — falling debris often creates a protective space next to solid objects.', points: 15 },
                    { id: 'b2', question: 'How should you signal rescuers when trapped in rubble?', options: ['Shout continuously at the top of your voice', 'Tap regularly on pipes or walls (3 taps, pause, repeat)', 'Flash a light continuously', 'Move rubble to make loud crashing noises'], correctAnswer: 1, explanation: 'Regular tapping on metal pipes or solid walls travels further and conserves air. Shouting should only be done when you hear rescuers very close, as it quickly depletes oxygen.', points: 15 },
                    { id: 'b3', question: 'Why should you cover your nose and mouth immediately during a building collapse?', options: ['To block out the smell of gas', 'To prevent inhalation of dangerous dust and particulate matter', 'To stay warm', 'To block noise from the collapse'], correctAnswer: 1, explanation: 'Collapse debris generates massive clouds of pulverized concrete and hazardous particles. Inhaling these can cause serious respiratory damage or death.', points: 10 },
                    { id: 'b4', question: 'What does "crush syndrome" mean in the context of building collapse survival?', options: ['A fear of small spaces', 'A life-threatening condition caused by toxins released when crushed muscles are freed', 'A type of structural failure', 'Panic due to being trapped'], correctAnswer: 1, explanation: 'Crush syndrome occurs when muscles crushed under debris release toxic myoglobin into the bloodstream when pressure is relieved. This can cause kidney failure and requires immediate medical treatment.', points: 10 },
                    { id: 'b5', question: 'What visible signs should prompt you to immediately vacate a building?', options: ['Paint peeling or minor hairline cracks', 'Large cracks in load-bearing walls, sagging ceilings, or floors that bounce underfoot', 'Slightly sticky doors or windows', 'Dusty or old-looking walls'], correctAnswer: 1, explanation: 'Large structural cracks, sagging or bowing walls/ceilings, and floors that feel springy or bounce are serious indicators of structural instability requiring immediate evacuation.', points: 10 },
                    { id: 'b6', question: 'Why should you NOT use lighters or matches while trapped in collapse rubble?', options: ['They waste energy', 'Ruptured gas lines may be present — any flame could cause a deadly explosion', 'They would attract rescuers to the wrong location', 'They create too much smoke'], correctAnswer: 1, explanation: 'Building collapses frequently rupture gas lines. Even a small spark or flame can ignite accumulated gas, causing a secondary explosion that endangers both survivors and rescuers.', points: 15 },
                    { id: 'b7', question: 'What is the recommended action if you are rescued but feel uninjured?', options: ['Immediately return to help others inside', 'Lie flat and seek immediate medical evaluation — injuries may not be immediately apparent', 'Stand up and run from the building', 'Drink large amounts of water immediately'], correctAnswer: 1, explanation: 'Internal injuries, crush syndrome, and shock can develop hours after a collapse. All survivors should receive medical evaluation regardless of how they feel immediately after rescue.', points: 10 },
                    { id: 'b8', question: 'What is a key way to help prevent building collapses?', options: ['Only use very old, established buildings', 'Report structural defects and advocate for regular safety inspections', 'Avoid using elevators', 'Live on the ground floor only'], correctAnswer: 1, explanation: 'Reporting visible structural defects (large cracks, sagging elements) and supporting regular building safety inspections are the most effective community-level prevention strategies.', points: 15 }
                ]
            }
        }
    }
];

async function runUpdates() {
    let successCount = 0;
    for (const { filter, update } of updates) {
        try {
            const result = await DisasterModule.updateOne(filter, update);
            if (result.matchedCount === 0) {
                console.warn(`⚠️  No module found matching: ${JSON.stringify(filter)}`);
            } else {
                console.log(`✅ Updated: ${JSON.stringify(filter)} (modified: ${result.modifiedCount})`);
                successCount++;
            }
        } catch (err) {
            console.error(`❌ Error updating ${JSON.stringify(filter)}:`, err.message);
        }
    }
    console.log(`\n🎉 Done! Updated ${successCount}/${updates.length} modules.`);
    await mongoose.disconnect();
}

runUpdates();
