import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

import DisasterModule from '../models/DisasterModule';

const contentMap: Record<string, any> = {
    tornado: {
        introduction: "Tornadoes are violently rotating columns of air that extend from a thunderstorm to the ground. They can destroy buildings, flip cars, and create deadly flying debris. Understanding tornado preparedness is crucial for areas prone to these severe storms.",
        keyPoints: [
            "Tornadoes can happen anytime, anywhere, but are most common in spring and summer.",
            "A Tornado Watch means conditions are favorable for tornadoes. A Tornado Warning means a tornado has been sighted or indicated by weather radar.",
            "Seek shelter immediately in an interior room on the lowest floor of a sturdy building.",
            "Stay away from windows, doors, and outside walls to protect yourself from flying debris."
        ],
        preventionMeasures: [
            "Identify a safe room in your house, such as a basement, storm cellar, or an interior room without windows.",
            "Practice a family tornado drill at least once a year so everyone knows where to go quickly.",
            "Keep an emergency kit ready with food, water, a battery-powered radio, and first aid supplies.",
            "Remove dead trees or heavy branches near your house that could become projectiles."
        ],
        duringDisaster: [
            "Go to your safe room immediately when a warning is issued.",
            "If no basement is available, go to an interior room like a bathroom or closet.",
            "Cover your head and neck with your arms, and put heavy materials such as mattresses or thick blankets over yourself.",
            "If you are outside and cannot reach a sturdy building, lie flat in a low-lying ditch or depression and cover your head with your hands."
        ],
        afterDisaster: [
            "Wait for the all-clear from local authorities or weather services before leaving your shelter.",
            "Watch out for fallen power lines, broken glass, and sharp debris.",
            "Use flashlights instead of candles to inspect for damage to avoid starting fires from ruptured gas lines.",
            "Check on neighbors and provide first aid if needed, then wait for emergency personnel."
        ]
    },
    gas_leak: {
        introduction: "A natural gas leak is a serious emergency that can lead to fire, explosion, or carbon monoxide poisoning. Natural gas is highly combustible. Knowing how to detect and respond to a gas leak is critical for household and workplace safety.",
        keyPoints: [
            "Natural gas smells like rotten eggs due to an added chemical called mercaptan, making it easier to detect.",
            "A hissing or roaring sound near a gas line, appliance, or meter is a major warning sign of a leak.",
            "Dead or dying vegetation near an underground pipeline can indicate a leak outside.",
            "Never use matches, lighters, electrical switches, or phones if you suspect a gas leak - a tiny spark can cause an explosion."
        ],
        preventionMeasures: [
            "Have your gas appliances and heating systems inspected annually by a qualified professional.",
            "Install carbon monoxide detectors on every level of your home, especially near sleeping areas.",
            "Know exactly where your main gas shut-off valve is located and how to operate it.",
            "Do not store flammable materials, paints, or solvents near gas appliances."
        ],
        duringDisaster: [
            "Evacuate everyone from the building immediately without stopping to pack belongings.",
            "Do not turn any electrical switches on or off, do not unplug anything, and do not use a phone inside.",
            "Leave doors open behind you as you exit to help ventilate the area and prevent pressure buildup.",
            "Do not attempt to locate the source of the leak yourself."
        ],
        afterDisaster: [
            "Call the gas company emergency line or emergency services (911/112) from a safe distance outside the building.",
            "Do not re-enter the home until it has been inspected and declared safe by professionals.",
            "Have a qualified technician repair the leak and restore gas service.",
            "Seek medical help immediately if anyone experiences dizziness, nausea, or signs of carbon monoxide poisoning."
        ]
    },
    building_collapse: {
        introduction: "Building collapses can occur due to severe earthquakes, internal explosions, sinkholes, heavy structural loads, or poor construction. Surviving a building collapse requires rapid situational awareness, quick protective action, and knowing how to signal for rescue.",
        keyPoints: [
            "Structural failure often happens suddenly, providing little to no warning before a collapse begins.",
            "If you cannot escape, dropping, covering, and holding on under sturdy furniture offers the best chance of survival.",
            "Protecting your airway from toxic dust and debris particles is a critical survival priority.",
            "If trapped, conserving your energy and oxygen is vital; do not yell constantly, as it scatters dust and wastes breath."
        ],
        preventionMeasures: [
            "Ensure your home or workplace meets local building codes and undergoes regular structural inspections.",
            "Report any significant new cracks in walls, foundation shifts, or sagging ceilings to building management immediately.",
            "Familiarize yourself with the emergency exit routes and stairwells in any multi-story building you inhabit or visit.",
            "Keep an emergency kit readily available at home and work, including a whistle and N95 dust masks."
        ],
        duringDisaster: [
            "If you cannot safely reach an exit in seconds, get under a sturdy desk or heavy table immediately.",
            "Crouch against an interior load-bearing wall, away from windows, glass, exterior walls, or heavy unsecured objects.",
            "Cover your head and neck tightly with your arms and tuck into a tight ball.",
            "If you are outside near a collapsing building, move rapidly as far away as possible to avoid the collapse zone and debris cloud."
        ],
        afterDisaster: [
            "If trapped, cover your mouth and nose with your clothing immediately to filter out hazardous dust.",
            "Do not light a match or lighter, as there may be explosive gas leaks.",
            "Tap on a pipe or wall rhythmically (e.g., three quick taps) so rescuers can hear you. Use a whistle if you have one.",
            "Yell only as a last resort when you hear rescuers close by, to avoid inhaling dangerous levels of dust."
        ]
    }
};

const run = async () => {
    try {
        console.log('Connecting to database...');
        // If MONGODB_URI is not loaded properly, set a fallback or throw error
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI environment variable is not set. Ensure .env is correct.');
            process.exit(1);
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const typesToUpdate = Object.keys(contentMap);
        const modules = await DisasterModule.find({ type: { $in: typesToUpdate } });

        console.log(`Found ${modules.length} modules to update.`);

        for (const mod of modules) {
            if (contentMap[mod.type]) {
                mod.content = { ...mod.content, ...contentMap[mod.type] };
                mod.markModified("content");
                await mod.save();
                console.log(`✅ Updated module content for: ${mod.title} (${mod.type})`);
            }
        }
        console.log('Update complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error updating modules:', error);
        process.exit(1);
    }
};

run();
