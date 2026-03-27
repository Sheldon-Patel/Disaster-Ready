import React, { useState, useEffect, useCallback } from 'react';

// Enhanced disaster scenario types with unique characteristics
export interface DisasterScenario {
  id: string;
  type: 'earthquake' | 'fire' | 'flood' | 'chemical' | 'lockdown' | 'bomb_threat' | 'cyber_attack' | 'power_outage' | 'tornado' | 'gas_leak' | 'building_collapse';
  name: string;
  description: string;
  intensity: 'low' | 'medium' | 'high' | 'critical';
  duration: number; // seconds
  weatherCondition: 'clear' | 'rain' | 'storm' | 'fog' | 'snow' | 'dust';
  timeOfDay: 'dawn' | 'morning' | 'noon' | 'afternoon' | 'evening' | 'night';
  specialConditions: string[];
  environmentalEffects: {
    visibility: number; // 0-1
    lighting: number; // 0-1
    soundLevel: number; // 0-1
    temperature: number; // Celsius
    windSpeed: number; // km/h
  };
  uniqueChallenges: Challenge[];
  evacuationConstraints: string[];
  priorityAreas: string[];
  emergencyProtocols: Protocol[];
}

interface Challenge {
  id: string;
  type: 'blocked_route' | 'injured_person' | 'equipment_failure' | 'communication_loss' | 'structural_damage';
  location: [number, number, number];
  description: string;
  severity: 'minor' | 'major' | 'critical';
  timeToResolve: number; // seconds
  requiredActions: string[];
}

interface Protocol {
  step: number;
  instruction: string;
  timeLimit: number;
  requiredRole?: 'student' | 'teacher' | 'warden' | 'security';
  validationRequired: boolean;
  alternatives: string[];
}

const DISASTER_SCENARIOS: DisasterScenario[] = [
  {
    id: 'earthquake_moderate',
    type: 'earthquake',
    name: '🌍 Moderate Earthquake - School Hours',
    description: 'A 6.5 magnitude earthquake strikes during peak class hours. Multiple aftershocks expected.',
    intensity: 'medium',
    duration: 180,
    weatherCondition: 'clear',
    timeOfDay: 'morning',
    specialConditions: ['aftershocks', 'falling_debris', 'structural_cracks'],
    environmentalEffects: {
      visibility: 0.8,
      lighting: 0.9,
      soundLevel: 0.7,
      temperature: 25,
      windSpeed: 5
    },
    uniqueChallenges: [
      {
        id: 'aftershock1',
        type: 'structural_damage',
        location: [5, 0, -10],
        description: 'Stairwell partially blocked by debris from aftershock',
        severity: 'major',
        timeToResolve: 45,
        requiredActions: ['assess_damage', 'find_alternate_route', 'assist_trapped']
      },
      {
        id: 'injured_student',
        type: 'injured_person',
        location: [-2, 0, 8],
        description: 'Student injured by falling ceiling tile, needs assistance',
        severity: 'minor',
        timeToResolve: 30,
        requiredActions: ['first_aid', 'call_medical', 'safe_evacuation']
      }
    ],
    evacuationConstraints: ['no_elevators', 'check_for_aftershocks', 'clear_debris_paths'],
    priorityAreas: ['science_labs', 'library', 'auditorium'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'DROP to hands and knees immediately',
        timeLimit: 5,
        validationRequired: true,
        alternatives: ['protect_head_if_no_desk']
      },
      {
        step: 2,
        instruction: 'COVER under sturdy desk or table',
        timeLimit: 3,
        validationRequired: true,
        alternatives: ['cover_head_with_arms']
      },
      {
        step: 3,
        instruction: 'HOLD ON and be prepared to move with shelter',
        timeLimit: 60,
        validationRequired: false,
        alternatives: ['protect_vital_organs']
      }
    ]
  },
  {
    id: 'fire_chemistry_lab',
    type: 'fire',
    name: '🔥 Chemical Fire - Science Laboratory',
    description: 'Fire breaks out in chemistry lab with toxic fumes spreading rapidly through ventilation system.',
    intensity: 'high',
    duration: 300,
    weatherCondition: 'clear',
    timeOfDay: 'afternoon',
    specialConditions: ['toxic_smoke', 'chemical_hazard', 'spreading_fire', 'evacuation_priority'],
    environmentalEffects: {
      visibility: 0.3,
      lighting: 0.4,
      soundLevel: 0.9,
      temperature: 35,
      windSpeed: 8
    },
    uniqueChallenges: [
      {
        id: 'toxic_corridor',
        type: 'blocked_route',
        location: [0, 0, -5],
        description: 'Main corridor filled with toxic smoke, visibility near zero',
        severity: 'critical',
        timeToResolve: 120,
        requiredActions: ['use_emergency_exit', 'wet_cloth_breathing', 'stay_low']
      },
      {
        id: 'fire_spread',
        type: 'equipment_failure',
        location: [8, 0, -8],
        description: 'Fire suppression system malfunction in east wing',
        severity: 'critical',
        timeToResolve: 180,
        requiredActions: ['manual_extinguisher', 'evacuate_immediately', 'seal_doors']
      }
    ],
    evacuationConstraints: ['avoid_smoke_areas', 'use_wet_cloth', 'stay_below_smoke_line'],
    priorityAreas: ['chemistry_labs', 'adjacent_classrooms', 'ventilation_connected_areas'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Alert others and activate nearest fire alarm',
        timeLimit: 10,
        validationRequired: true,
        alternatives: ['shout_fire_warning']
      },
      {
        step: 2,
        instruction: 'Exit immediately via nearest safe route',
        timeLimit: 30,
        validationRequired: true,
        alternatives: ['use_emergency_exit', 'break_window_if_trapped']
      },
      {
        step: 3,
        instruction: 'Stay low, cover nose/mouth with wet cloth',
        timeLimit: 0,
        validationRequired: false,
        alternatives: ['breathe_through_shirt']
      }
    ]
  },
  {
    id: 'flood_monsoon',
    type: 'flood',
    name: '🌊 Flash Flood - Monsoon Emergency',
    description: 'Unprecedented rainfall causes rapid flooding. Ground floor submerged, power outage imminent.',
    intensity: 'critical',
    duration: 480,
    weatherCondition: 'storm',
    timeOfDay: 'evening',
    specialConditions: ['rising_water', 'power_outage', 'communication_failure', 'lightning_risk'],
    environmentalEffects: {
      visibility: 0.4,
      lighting: 0.2,
      soundLevel: 0.8,
      temperature: 22,
      windSpeed: 45
    },
    uniqueChallenges: [
      {
        id: 'rising_water',
        type: 'blocked_route',
        location: [0, -2, 0],
        description: 'Ground floor flooded, water level rising rapidly',
        severity: 'critical',
        timeToResolve: 240,
        requiredActions: ['move_to_higher_floors', 'avoid_electrical_hazards', 'prepare_for_rescue']
      },
      {
        id: 'power_failure',
        type: 'equipment_failure',
        location: [-10, 0, 5],
        description: 'Main power grid failure, emergency lighting only',
        severity: 'major',
        timeToResolve: 300,
        requiredActions: ['use_flashlights', 'stay_together', 'mark_location']
      }
    ],
    evacuationConstraints: ['avoid_ground_floor', 'no_electrical_contact', 'group_movement_only'],
    priorityAreas: ['upper_floors', 'roof_access', 'emergency_shelter_areas'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Move to highest available floor immediately',
        timeLimit: 60,
        validationRequired: true,
        alternatives: ['climb_to_roof_if_necessary']
      },
      {
        step: 2,
        instruction: 'Avoid all electrical equipment and water',
        timeLimit: 0,
        validationRequired: false,
        alternatives: ['unplug_devices_if_safe']
      },
      {
        step: 3,
        instruction: 'Signal for help from visible location',
        timeLimit: 120,
        validationRequired: true,
        alternatives: ['use_bright_colored_cloth', 'mirror_signal']
      }
    ]
  },
  {
    id: 'chemical_gas_leak',
    type: 'chemical',
    name: '☢️ Toxic Gas Leak - Industrial Accident',
    description: 'Nearby chemical plant accident releases toxic gas cloud approaching school premises.',
    intensity: 'high',
    duration: 360,
    weatherCondition: 'fog',
    timeOfDay: 'morning',
    specialConditions: ['toxic_gas_cloud', 'wind_direction_critical', 'shelter_in_place'],
    environmentalEffects: {
      visibility: 0.5,
      lighting: 0.7,
      soundLevel: 0.6,
      temperature: 18,
      windSpeed: 12
    },
    uniqueChallenges: [
      {
        id: 'gas_infiltration',
        type: 'blocked_route',
        location: [15, 0, 0],
        description: 'Toxic gas cloud approaching from east, outdoor evacuation unsafe',
        severity: 'critical',
        timeToResolve: 200,
        requiredActions: ['seal_building', 'shelter_in_place', 'monitor_air_quality']
      },
      {
        id: 'ventilation_shutdown',
        type: 'equipment_failure',
        location: [0, 10, 0],
        description: 'HVAC system must be shut down to prevent gas circulation',
        severity: 'major',
        timeToResolve: 15,
        requiredActions: ['turn_off_hvac', 'seal_windows_doors', 'use_internal_air_only']
      }
    ],
    evacuationConstraints: ['no_outdoor_movement', 'seal_all_openings', 'monitor_air_quality'],
    priorityAreas: ['interior_rooms', 'higher_floors', 'rooms_with_good_sealing'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Move to interior rooms away from windows',
        timeLimit: 30,
        validationRequired: true,
        alternatives: ['basement_if_available']
      },
      {
        step: 2,
        instruction: 'Seal all windows, doors, and vents with tape/cloth',
        timeLimit: 60,
        validationRequired: true,
        alternatives: ['use_wet_towels_for_sealing']
      },
      {
        step: 3,
        instruction: 'Turn off all ventilation and air conditioning',
        timeLimit: 10,
        requiredRole: 'teacher',
        validationRequired: true,
        alternatives: ['block_air_vents_manually']
      }
    ]
  },
  {
    id: 'lockdown_intruder',
    type: 'lockdown',
    name: '🔒 Code Red Lockdown - Security Threat',
    description: 'Unauthorized intruder on campus. Immediate lockdown procedures activated.',
    intensity: 'critical',
    duration: 900,
    weatherCondition: 'clear',
    timeOfDay: 'noon',
    specialConditions: ['silent_movement', 'communication_blackout', 'hide_in_place'],
    environmentalEffects: {
      visibility: 1.0,
      lighting: 0.8,
      soundLevel: 0.1,
      temperature: 24,
      windSpeed: 3
    },
    uniqueChallenges: [
      {
        id: 'silent_lockdown',
        type: 'communication_loss',
        location: [0, 0, 0],
        description: 'Must maintain complete silence while securing area',
        severity: 'critical',
        timeToResolve: 600,
        requiredActions: ['lock_all_doors', 'turn_off_lights', 'silent_communication_only']
      },
      {
        id: 'classroom_security',
        type: 'equipment_failure',
        location: [3, 0, -7],
        description: 'Classroom door lock mechanism broken',
        severity: 'major',
        timeToResolve: 30,
        requiredActions: ['barricade_door', 'move_away_from_windows', 'use_silent_signals']
      }
    ],
    evacuationConstraints: ['no_movement', 'complete_silence', 'wait_for_all_clear'],
    priorityAreas: ['secure_classrooms', 'lockable_rooms', 'interior_spaces'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Lock classroom door immediately',
        timeLimit: 5,
        requiredRole: 'teacher',
        validationRequired: true,
        alternatives: ['barricade_with_furniture']
      },
      {
        step: 2,
        instruction: 'Turn off lights and move away from windows',
        timeLimit: 10,
        validationRequired: true,
        alternatives: ['hide_behind_solid_furniture']
      },
      {
        step: 3,
        instruction: 'Remain silent and hidden until all-clear signal',
        timeLimit: 0,
        validationRequired: false,
        alternatives: ['use_pre_arranged_silent_signals']
      }
    ]
  },
  {
    id: 'tornado_severe',
    type: 'tornado',
    name: '🌪️ Severe Tornado Warning - Approaching School',
    description: 'EF3 tornado spotted 2km away, moving towards school. Extreme winds and flying debris imminent.',
    intensity: 'critical',
    duration: 240,
    weatherCondition: 'storm',
    timeOfDay: 'afternoon',
    specialConditions: ['high_winds', 'flying_debris', 'structural_threat', 'rapid_pressure_change'],
    environmentalEffects: {
      visibility: 0.4,
      lighting: 0.3,
      soundLevel: 1.0,
      temperature: 22,
      windSpeed: 120
    },
    uniqueChallenges: [
      {
        id: 'window_hazard',
        type: 'structural_damage',
        location: [10, 0, 5],
        description: 'Windows shattering from pressure changes and debris impact',
        severity: 'critical',
        timeToResolve: 20,
        requiredActions: ['move_to_interior', 'avoid_windows', 'protect_head']
      },
      {
        id: 'roof_damage',
        type: 'structural_damage',
        location: [0, 5, 0],
        description: 'Roof structure compromised, debris falling into upper floors',
        severity: 'critical',
        timeToResolve: 60,
        requiredActions: ['evacuate_upper_floors', 'seek_basement', 'duck_and_cover']
      }
    ],
    evacuationConstraints: ['stay_interior', 'avoid_windows', 'lowest_floor_preferred', 'no_outdoor_movement'],
    priorityAreas: ['basement', 'interior_hallways', 'reinforced_rooms'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Move immediately to lowest floor interior room',
        timeLimit: 30,
        validationRequired: true,
        alternatives: ['interior_hallway_if_no_basement']
      },
      {
        step: 2,
        instruction: 'Get under sturdy furniture, protect head and neck',
        timeLimit: 15,
        validationRequired: true,
        alternatives: ['crouch_against_interior_wall']
      },
      {
        step: 3,
        instruction: 'Stay in position until all-clear signal',
        timeLimit: 0,
        validationRequired: false,
        alternatives: ['wait_for_wind_to_stop']
      }
    ]
  },
  {
    id: 'gas_leak_major',
    type: 'gas_leak',
    name: '☢️ Major Gas Leak - Utility Room',
    description: 'Natural gas leak detected in utility room. Explosive concentration building. Immediate evacuation required.',
    intensity: 'critical',
    duration: 180,
    weatherCondition: 'clear',
    timeOfDay: 'morning',
    specialConditions: ['explosive_risk', 'toxic_fumes', 'no_electricity', 'no_open_flames'],
    environmentalEffects: {
      visibility: 0.6,
      lighting: 0.5,
      soundLevel: 0.4,
      temperature: 20,
      windSpeed: 3
    },
    uniqueChallenges: [
      {
        id: 'gas_spread',
        type: 'blocked_route',
        location: [-5, 0, -5],
        description: 'Gas spreading through ventilation system to adjacent rooms',
        severity: 'critical',
        timeToResolve: 90,
        requiredActions: ['evacuate_immediately', 'no_electrical_switches', 'open_windows_if_safe']
      },
      {
        id: 'explosion_risk',
        type: 'equipment_failure',
        location: [-8, 0, -8],
        description: 'Gas concentration reaching explosive levels near utility room',
        severity: 'critical',
        timeToResolve: 60,
        requiredActions: ['clear_area_immediately', 'no_sparks', 'emergency_shutoff']
      }
    ],
    evacuationConstraints: ['no_electrical_devices', 'no_fire_alarms', 'silent_evacuation', 'upwind_exit'],
    priorityAreas: ['utility_room', 'basement', 'ventilation_connected_areas'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Do NOT use electrical switches, phones, or alarms',
        timeLimit: 0,
        validationRequired: true,
        alternatives: ['manual_notification_only']
      },
      {
        step: 2,
        instruction: 'Evacuate immediately via nearest safe exit',
        timeLimit: 60,
        validationRequired: true,
        alternatives: ['upwind_direction_preferred']
      },
      {
        step: 3,
        instruction: 'Move at least 100m away from building',
        timeLimit: 120,
        validationRequired: true,
        alternatives: ['gather_at_upwind_assembly_point']
      }
    ]
  },
  {
    id: 'building_collapse_partial',
    type: 'building_collapse',
    name: '🏚️ Partial Building Collapse - Structural Failure',
    description: 'Structural failure in east wing. Partial collapse with risk of further deterioration. Heavy debris and dust.',
    intensity: 'critical',
    duration: 300,
    weatherCondition: 'dust',
    timeOfDay: 'noon',
    specialConditions: ['unstable_structure', 'heavy_debris', 'dust_cloud', 'trapped_persons'],
    environmentalEffects: {
      visibility: 0.2,
      lighting: 0.4,
      soundLevel: 0.9,
      temperature: 28,
      windSpeed: 2
    },
    uniqueChallenges: [
      {
        id: 'east_wing_collapse',
        type: 'structural_damage',
        location: [15, 0, 0],
        description: 'East wing second floor collapsed onto first floor',
        severity: 'critical',
        timeToResolve: 300,
        requiredActions: ['avoid_area', 'search_for_trapped', 'structural_assessment']
      },
      {
        id: 'debris_blocking',
        type: 'blocked_route',
        location: [8, 0, 2],
        description: 'Main corridor blocked by concrete and steel debris',
        severity: 'critical',
        timeToResolve: 180,
        requiredActions: ['find_alternate_route', 'clear_safe_path', 'check_stability']
      },
      {
        id: 'dust_inhalation',
        type: 'communication_loss',
        location: [10, 0, -2],
        description: 'Heavy dust cloud causing breathing difficulties and zero visibility',
        severity: 'major',
        timeToResolve: 120,
        requiredActions: ['cover_mouth', 'stay_low', 'feel_along_walls']
      }
    ],
    evacuationConstraints: ['avoid_damaged_areas', 'watch_for_falling_debris', 'cover_airways', 'move_carefully'],
    priorityAreas: ['collapsed_section', 'adjacent_rooms', 'upper_floors_above_collapse'],
    emergencyProtocols: [
      {
        step: 1,
        instruction: 'Cover nose and mouth with cloth to filter dust',
        timeLimit: 10,
        validationRequired: true,
        alternatives: ['use_shirt_as_filter']
      },
      {
        step: 2,
        instruction: 'Evacuate via structurally sound routes only',
        timeLimit: 120,
        validationRequired: true,
        alternatives: ['wait_for_rescue_if_trapped']
      },
      {
        step: 3,
        instruction: 'Report any trapped persons to emergency responders',
        timeLimit: 180,
        validationRequired: false,
        alternatives: ['mark_location_if_safe']
      }
    ]
  }
];

interface DrillScenarioEngineProps {
  onScenarioSelect: (scenario: DisasterScenario) => void;
  selectedScenario?: DisasterScenario;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

const DrillScenarioEngine: React.FC<DrillScenarioEngineProps> = ({
  onScenarioSelect,
  selectedScenario,
  difficulty
}) => {
  const [availableScenarios, setAvailableScenarios] = useState<DisasterScenario[]>([]);
  const [randomizedScenario, setRandomizedScenario] = useState<DisasterScenario | null>(null);

  const generateRandomScenario = useCallback(() => {
    const baseScenarios = DISASTER_SCENARIOS.filter(scenario => {
      switch (difficulty) {
        case 'beginner':
          return scenario.intensity === 'low' || scenario.intensity === 'medium';
        case 'intermediate':
          return scenario.intensity === 'medium' || scenario.intensity === 'high';
        case 'advanced':
          return scenario.intensity === 'high' || scenario.intensity === 'critical';
        case 'expert':
          return scenario.intensity === 'critical';
        default:
          return true;
      }
    });

    const scenario = baseScenarios[Math.floor(Math.random() * baseScenarios.length)];

    // Add randomization to the scenario
    const randomizedWeather = ['clear', 'rain', 'storm', 'fog'][Math.floor(Math.random() * 4)];
    const randomizedTime = ['dawn', 'morning', 'noon', 'afternoon', 'evening', 'night'][Math.floor(Math.random() * 6)];

    const randomizedScenario: DisasterScenario = {
      ...scenario,
      id: `${scenario.id}_${Date.now()}`,
      weatherCondition: randomizedWeather as any,
      timeOfDay: randomizedTime as any,
      duration: scenario.duration + (Math.random() - 0.5) * 60, // ±30 seconds variation
      environmentalEffects: {
        ...scenario.environmentalEffects,
        visibility: Math.max(0.1, scenario.environmentalEffects.visibility + (Math.random() - 0.5) * 0.3),
        lighting: Math.max(0.1, scenario.environmentalEffects.lighting + (Math.random() - 0.5) * 0.3),
        temperature: scenario.environmentalEffects.temperature + (Math.random() - 0.5) * 10,
        windSpeed: Math.max(0, scenario.environmentalEffects.windSpeed + (Math.random() - 0.5) * 20)
      }
    };

    setRandomizedScenario(randomizedScenario);
    return randomizedScenario;
  }, [difficulty]);

  useEffect(() => {
    setAvailableScenarios(DISASTER_SCENARIOS);
  }, []);

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'clear': return '☀️';
      case 'rain': return '🌧️';
      case 'storm': return '⛈️';
      case 'fog': return '🌫️';
      case 'snow': return '❄️';
      case 'dust': return '💨';
      default: return '🌤️';
    }
  };

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'dawn': return '🌅';
      case 'morning': return '🌄';
      case 'noon': return '☀️';
      case 'afternoon': return '🌇';
      case 'evening': return '🌆';
      case 'night': return '🌙';
      default: return '🕐';
    }
  };

  const ScenarioCard: React.FC<{ scenario: DisasterScenario; isSelected: boolean }> = ({ scenario, isSelected }) => (
    <div
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-xl ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
        : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      onClick={() => onScenarioSelect(scenario)}
    >
      <div className="absolute top-4 right-4 flex space-x-2">
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getIntensityColor(scenario.intensity)}`}>
          {scenario.intensity.toUpperCase()}
        </span>
        <span className="text-lg">{getWeatherIcon(scenario.weatherCondition)}</span>
        <span className="text-lg">{getTimeIcon(scenario.timeOfDay)}</span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.name}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{scenario.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
        <div>
          <span className="font-medium text-gray-700">Duration:</span>
          <span className="ml-1 text-gray-900">{Math.floor(scenario.duration / 60)}m {scenario.duration % 60}s</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Challenges:</span>
          <span className="ml-1 text-gray-900">{scenario.uniqueChallenges.length}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Visibility:</span>
          <span className="ml-1 text-gray-900">{Math.round(scenario.environmentalEffects.visibility * 100)}%</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Priority Areas:</span>
          <span className="ml-1 text-gray-900">{scenario.priorityAreas.length}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs font-medium text-gray-700">Special Conditions:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {scenario.specialConditions.slice(0, 3).map((condition, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                {condition.replace('_', ' ')}
              </span>
            ))}
            {scenario.specialConditions.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{scenario.specialConditions.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {isSelected && (
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <h4 className="text-sm font-bold text-blue-900 mb-2">Emergency Protocols:</h4>
          <div className="space-y-1">
            {scenario.emergencyProtocols.slice(0, 2).map((protocol, index) => (
              <div key={index} className="text-xs text-blue-800">
                <span className="font-medium">{protocol.step}.</span> {protocol.instruction}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">🎯 Drill Scenario Selection</h2>
          <div className="flex space-x-3">
            <button
              onClick={generateRandomScenario}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              🎲 Random Scenario
            </button>
            <span className={`px-3 py-2 text-sm font-medium rounded-lg ${getIntensityColor(difficulty)}`}>
              {difficulty.toUpperCase()} Mode
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Choose a disaster scenario for your virtual drill. Each scenario presents unique challenges and requires different emergency protocols.
        </p>

        {randomizedScenario && (
          <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-purple-900">🎲 Generated Random Scenario</h3>
                <p className="text-xs text-purple-700">{randomizedScenario.name}</p>
              </div>
              <button
                onClick={() => onScenarioSelect(randomizedScenario)}
                className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
              >
                Select This
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {availableScenarios.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            isSelected={selectedScenario?.id === scenario.id}
          />
        ))}
      </div>

      {selectedScenario && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg border">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Selected Scenario: {selectedScenario.name}</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-gray-800 mb-3">🎯 Unique Challenges</h4>
              <div className="space-y-2">
                {selectedScenario.uniqueChallenges.map((challenge, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-orange-900">{challenge.type.replace('_', ' ')}</span>
                      <span className={`px-2 py-1 text-xs rounded ${challenge.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        challenge.severity === 'major' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                        {challenge.severity}
                      </span>
                    </div>
                    <p className="text-xs text-orange-800">{challenge.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3">📋 Emergency Protocols</h4>
              <div className="space-y-2">
                {selectedScenario.emergencyProtocols.map((protocol, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-blue-900">Step {protocol.step}</span>
                      <span className="text-xs text-blue-700">{protocol.timeLimit}s</span>
                    </div>
                    <p className="text-xs text-blue-800">{protocol.instruction}</p>
                    {protocol.requiredRole && (
                      <span className="inline-block mt-1 px-2 py-1 bg-blue-200 text-blue-800 text-xs rounded">
                        {protocol.requiredRole}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-800 mb-3">🌍 Environment</h4>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h5 className="text-sm font-medium text-green-900 mb-2">Conditions</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Weather: {getWeatherIcon(selectedScenario.weatherCondition)} {selectedScenario.weatherCondition}</div>
                    <div>Time: {getTimeIcon(selectedScenario.timeOfDay)} {selectedScenario.timeOfDay}</div>
                    <div>Visibility: {Math.round(selectedScenario.environmentalEffects.visibility * 100)}%</div>
                    <div>Temp: {selectedScenario.environmentalEffects.temperature}°C</div>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h5 className="text-sm font-medium text-yellow-900 mb-2">Constraints</h5>
                  <ul className="text-xs text-yellow-800 space-y-1">
                    {selectedScenario.evacuationConstraints.map((constraint, index) => (
                      <li key={index}>• {constraint.replace('_', ' ')}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillScenarioEngine;
