import React, { useState } from 'react';
import EvacuationRoute3D from '../../components/3d/EvacuationRoute3D';
import { useAuth } from '../../contexts/AuthContext';
import DrillScenarioEngine, { DisasterScenario } from '../../components/drills/DrillScenarioEngine';

// ── Three unique floor plans ─────────────────────────────────────────
const floorPlans = [
  {
    id: 'floor0',
    name: 'Ground Floor',
    floor: 0,
    rooms: [
      { id: 'g-room1', name: 'Class 9A', position: [-10, 1, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'g-room2', name: 'Class 9B', position: [-5, 1, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'g-room3', name: 'Class 10A', position: [0, 1, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'g-room4', name: 'Class 10B', position: [5, 1, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'g-lab', name: 'Science Lab', position: [10, 1, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const, isHazard: true },
      { id: 'g-hall1', name: 'Main Corridor', position: [0, 1, 0] as [number, number, number], size: [25, 3, 3] as [number, number, number], type: 'hallway' as const },
      { id: 'g-office1', name: 'Principal Office', position: [-5, 1, 6] as [number, number, number], size: [6, 3, 4] as [number, number, number], type: 'office' as const },
      { id: 'g-office2', name: 'Staff Room', position: [5, 1, 6] as [number, number, number], size: [6, 3, 4] as [number, number, number], type: 'office' as const },
      { id: 'g-exit1', name: 'Main Exit', position: [-12, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
      { id: 'g-exit2', name: 'Emergency Exit', position: [12, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
    ],
    evacuationPaths: [
      { id: 'line-outside-primary', points: [[-12, 0.5, 0], [-15, 0.5, 5], [-15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 45 },
      { id: 'line-outside-alt', points: [[12, 0.5, 0], [15, 0.5, 5], [15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 50 },
      { id: 'flow-g-r1', points: [[-10, 0.5, -7.5], [-10, 0.5, 0], [-12, 0.5, 0], [-15, 0.5, 5], [-15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 45 },
      { id: 'flow-g-r2', points: [[-5, 0.5, -7.5], [-5, 0.5, 0], [-12, 0.5, 0], [-15, 0.5, 5], [-15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 47 },
      { id: 'flow-g-r3', points: [[0, 0.5, -7.5], [0, 0.5, 0], [-12, 0.5, 0], [-15, 0.5, 5], [-15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 50 },
      { id: 'flow-g-r4', points: [[5, 0.5, -7.5], [5, 0.5, 0], [12, 0.5, 0], [15, 0.5, 5], [15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 52 },
      { id: 'flow-g-lab', points: [[10, 0.5, -7.5], [10, 0.5, 0], [12, 0.5, 0], [15, 0.5, 5], [15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 45 },
      { id: 'flow-g-office1', points: [[-5, 0.5, 7.5], [-5, 0.5, 0], [-12, 0.5, 0], [-15, 0.5, 5], [-15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 40 },
      { id: 'flow-g-office2', points: [[5, 0.5, 7.5], [5, 0.5, 0], [12, 0.5, 0], [15, 0.5, 5], [15, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 42 },
    ],
    exitPoints: [[-12, 0, 0], [12, 0, 0]] as [number, number, number][],
    assemblyPoint: [0, 0, 20] as [number, number, number],
  },
  {
    id: 'floor1',
    name: 'First Floor',
    floor: 1,
    rooms: [
      // North wing — classrooms lined up along Z=-6
      { id: 'f1-room1', name: 'Class 11A', position: [-8, 4, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'f1-room2', name: 'Class 11B', position: [-3, 4, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'f1-room3', name: 'Class 12A', position: [2, 4, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'f1-room4', name: 'Computer Lab', position: [7, 4, -6] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'classroom' as const },
      // Central corridor
      { id: 'f1-hall', name: 'First Floor Corridor', position: [0, 4, 0] as [number, number, number], size: [24, 3, 3] as [number, number, number], type: 'hallway' as const },
      // South wing — Library along Z=5 (adjacent to corridor)
      { id: 'f1-lib', name: 'Library', position: [-4, 4, 5] as [number, number, number], size: [10, 3, 4] as [number, number, number], type: 'office' as const },
      { id: 'f1-staff', name: 'Staff Room', position: [6, 4, 5] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'office' as const },
      // Stairways at both ends of corridor
      { id: 'f1-stairs1', name: 'Stairway A (Down)', position: [-12, 2.5, 0] as [number, number, number], size: [3, 6, 4] as [number, number, number], type: 'stairs' as const },
      { id: 'f1-stairs2', name: 'Stairway B (Down)', position: [12, 2.5, 0] as [number, number, number], size: [3, 6, 4] as [number, number, number], type: 'stairs' as const },
      // Ground-level exits
      { id: 'f1-exit', name: 'Main Exit (Ground)', position: [-14, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
      { id: 'f1-exit2', name: 'Emergency Exit (Ground)', position: [14, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
    ],
    evacuationPaths: [
      { id: 'line-outside-f1-p', points: [[-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 50 },
      { id: 'line-outside-f1-a', points: [[12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 55 },
      { id: 'flow-f1-r1', points: [[-8, 3.5, -7.5], [-8, 3.5, 0], [-12, 3.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 55 },
      { id: 'flow-f1-r2', points: [[-3, 3.5, -7.5], [-3, 3.5, 0], [-12, 3.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 58 },
      { id: 'flow-f1-r3', points: [[2, 3.5, -7.5], [2, 3.5, 0], [12, 3.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 62 },
      { id: 'flow-f1-r4', points: [[7, 3.5, -7.5], [7, 3.5, 0], [12, 3.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 60 },
      { id: 'flow-f1-lib', points: [[-4, 3.5, 6.5], [-4, 3.5, 0], [-12, 3.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 52 },
      { id: 'flow-f1-staff', points: [[6, 3.5, 6.5], [6, 3.5, 0], [12, 3.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 55 },
    ],
    exitPoints: [[-14, 0, 0], [14, 0, 0]] as [number, number, number][],
    assemblyPoint: [0, 0, 20] as [number, number, number],
  },
  {
    id: 'floor2',
    name: 'Second Floor',
    floor: 2,
    rooms: [
      // North wing — specialty rooms along Z=-6
      { id: 'f2-room1', name: 'Art Studio', position: [-8, 7, -6] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'f2-room2', name: 'Music Room', position: [-2, 7, -6] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'classroom' as const },
      { id: 'f2-room3', name: 'Chemistry Lab', position: [4, 7, -6] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'classroom' as const, isHazard: true },
      // Central corridor
      { id: 'f2-hall', name: 'Second Floor Corridor', position: [0, 7, 0] as [number, number, number], size: [24, 3, 3] as [number, number, number], type: 'hallway' as const },
      // South wing — offices along Z=5 (adjacent to corridor)
      { id: 'f2-meet', name: 'Meeting Room', position: [-6, 7, 5] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'office' as const },
      { id: 'f2-server', name: 'Server Room', position: [0, 7, 5] as [number, number, number], size: [4, 3, 4] as [number, number, number], type: 'office' as const, isHazard: true },
      { id: 'f2-lab2', name: 'Physics Lab', position: [6, 7, 5] as [number, number, number], size: [5, 3, 4] as [number, number, number], type: 'classroom' as const },
      // Stairways at both ends of corridor
      { id: 'f2-stairs1', name: 'Stairway A (Down)', position: [-12, 4, 0] as [number, number, number], size: [3, 9, 4] as [number, number, number], type: 'stairs' as const },
      { id: 'f2-stairs2', name: 'Stairway B (Down)', position: [12, 4, 0] as [number, number, number], size: [3, 9, 4] as [number, number, number], type: 'stairs' as const },
      // Ground-level exits
      { id: 'f2-exit', name: 'Main Exit (Ground)', position: [-14, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
      { id: 'f2-exit2', name: 'Emergency Exit (Ground)', position: [14, 1, 0] as [number, number, number], size: [1, 3, 3] as [number, number, number], type: 'exit' as const },
    ],
    evacuationPaths: [
      { id: 'line-outside-f2-p', points: [[-12, 4.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 65 },
      { id: 'line-outside-f2-a', points: [[12, 4.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 70 },
      { id: 'flow-f2-r1', points: [[-8, 6.5, -7.5], [-8, 6.5, 0], [-12, 6.5, 0], [-12, 4.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 75 },
      { id: 'flow-f2-r2', points: [[-2, 6.5, -7.5], [-2, 6.5, 0], [-12, 6.5, 0], [-12, 4.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 78 },
      { id: 'flow-f2-r3', points: [[4, 6.5, -7.5], [4, 6.5, 0], [12, 6.5, 0], [12, 4.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 80 },
      { id: 'flow-f2-meet', points: [[-6, 6.5, 6.5], [-6, 6.5, 0], [-12, 6.5, 0], [-12, 4.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 72 },
      { id: 'flow-f2-server', points: [[0, 6.5, 6.5], [0, 6.5, 0], [-12, 6.5, 0], [-12, 4.5, 0], [-12, 2.5, 0], [-12, 0.5, 0], [-14, 0.5, 0], [-14, 0.5, 8], [-7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: true, estimatedTime: 74 },
      { id: 'flow-f2-lab2', points: [[6, 6.5, 6.5], [6, 6.5, 0], [12, 6.5, 0], [12, 4.5, 0], [12, 2.5, 0], [12, 0.5, 0], [14, 0.5, 0], [14, 0.5, 8], [7, 0.5, 15], [0, 0.5, 20]] as [number, number, number][], isPrimary: false, estimatedTime: 82 },
    ],
    exitPoints: [[-14, 0, 0], [14, 0, 0]] as [number, number, number][],
    assemblyPoint: [0, 0, 20] as [number, number, number],
  },
];

// ── Component ────────────────────────────────────────────────────────
const EvacuationVisualizationPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [simulationMode, setSimulationMode] = useState(false);
  const [floorDropdownOpen, setFloorDropdownOpen] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<DisasterScenario | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; name: string; type: string; isHazard?: boolean } | null>(null);

  const currentPlan = floorPlans[selectedFloor];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Header ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">3D Evacuation Drill</h1>
              <p className="text-gray-500 mt-1">Navigate the building and follow the evacuation route</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Floor Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setFloorDropdownOpen(!floorDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors min-w-[170px] justify-between"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🏢</span>
                    {currentPlan.name}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${floorDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {floorDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {floorPlans.map((fp, idx) => (
                      <button
                        key={fp.id}
                        onClick={() => { setSelectedFloor(idx); setFloorDropdownOpen(false); }}
                        className={`block w-full text-left px-4 py-3 text-sm hover:bg-red-50 transition-colors ${idx === selectedFloor ? 'bg-red-50 text-red-700 font-semibold' : 'text-gray-700'}`}
                      >
                        {fp.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Simulate Button */}
              <button
                onClick={() => setSimulationMode(!simulationMode)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm shadow transition-all ${simulationMode
                  ? 'bg-red-600 text-white hover:bg-red-700 ring-2 ring-red-300'
                  : 'bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600'
                  }`}
              >
                {simulationMode ? (
                  <>
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Stop Simulation
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Run Simulation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Scenario Selection ──────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span>🎯</span> Select Drill Scenario
            </h2>
            <p className="text-sm text-gray-500 mt-1">Choose a disaster type to simulate — the 3D environment will adapt accordingly</p>
          </div>
          <div className="p-5">
            <DrillScenarioEngine
              difficulty={'intermediate'}
              selectedScenario={selectedScenario || undefined}
              onScenarioSelect={setSelectedScenario}
            />
          </div>
        </div>

        {/* ── 3D Visualization ──────────────────────────────── */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6" style={{ height: '600px' }}>
          <EvacuationRoute3D
            floorPlan={currentPlan}
            simulationMode={simulationMode}
            onSimulationComplete={() => { }}
            scenarioType={selectedScenario?.type || null}
            onRoomSelect={(room) => setSelectedRoom(room as any)}
            visualEffects={{
              fogColor: selectedScenario?.type === 'fire' ? '#ffe0e0' : selectedScenario?.type === 'flood' ? '#e0f7ff' : '#cfe8ff',
              fogNear: selectedScenario?.type === 'fire' ? 10 : 20,
              fogFar: selectedScenario?.type === 'flood' ? 100 : 120,
              skySunPosition: selectedScenario?.type === 'flood' ? [0, 10, 0] : [50, 20, 50],
              ambientIntensity: selectedScenario?.type === 'lockdown' ? 0.3 : 0.6,
              dirLightIntensity: selectedScenario?.type === 'fire' ? 1.5 : 1.2,
            }}
          />
        </div>

        {/* ── Selected Room Info ──────────────────────────────── */}
        {selectedRoom && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${selectedRoom.type === 'classroom' ? 'bg-gray-100' :
                  selectedRoom.type === 'exit' ? 'bg-green-100' :
                    selectedRoom.type === 'stairs' ? 'bg-amber-100' :
                      selectedRoom.type === 'office' ? 'bg-purple-100' :
                        'bg-gray-100'
                  }`}>
                  {selectedRoom.type === 'classroom' ? '📚' :
                    selectedRoom.type === 'exit' ? '🚪' :
                      selectedRoom.type === 'stairs' ? '🪜' :
                        selectedRoom.type === 'office' ? '🏢' :
                          selectedRoom.type === 'hallway' ? '🚶' : '📍'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{selectedRoom.type}</p>
                </div>
              </div>
              {selectedRoom.isHazard && (
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold animate-pulse">
                  ⚠ Hazard Zone
                </span>
              )}
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* ── Floor Info Cards ──────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🏫</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Rooms</p>
              <p className="text-lg font-bold text-gray-900">{currentPlan.rooms.filter(r => r.type === 'classroom' || r.type === 'office').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🚪</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Exit Points</p>
              <p className="text-lg font-bold text-gray-900">{currentPlan.exitPoints.length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🪜</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Stairways</p>
              <p className="text-lg font-bold text-gray-900">{currentPlan.rooms.filter(r => r.type === 'stairs').length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Hazard Zones</p>
              <p className="text-lg font-bold text-red-600">{currentPlan.rooms.filter(r => r.isHazard).length}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🟢</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Primary Route</p>
              <p className="text-lg font-bold text-green-600">{currentPlan.evacuationPaths.find(p => p.isPrimary)?.estimatedTime || 0}s</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-xl">🟡</span>
            </div>
            <div>
              <p className="text-xs text-gray-500">Alt. Route</p>
              <p className="text-lg font-bold text-yellow-600">{currentPlan.evacuationPaths.find(p => !p.isPrimary)?.estimatedTime || 0}s</p>
            </div>
          </div>
        </div>

        {/* ── Instructions ─────────────────────────────────── */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>💡</span> How to Use
          </h3>
          <div className="grid md:grid-cols-2 gap-3 text-sm text-blue-800">
            <p>🖱️ Click + drag to rotate the 3D model</p>
            <p>🔍 Scroll to zoom in/out</p>
            <p>🟢 Green paths = primary route</p>
            <p>🟡 Yellow paths = alternative route</p>
            <p>🔴 Red areas = hazard zones</p>
            <p>▶️ Click <strong>Run Simulation</strong> to see animated evacuation</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EvacuationVisualizationPage;
