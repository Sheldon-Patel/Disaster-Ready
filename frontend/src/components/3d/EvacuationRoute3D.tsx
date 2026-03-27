import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Line, Sphere, Html, Sky, Tube } from '@react-three/drei';
import * as THREE from 'three';

interface Room {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  type: 'classroom' | 'hallway' | 'exit' | 'office' | 'stairs' | 'assembly';
  isHazard?: boolean;
}

interface EvacuationPath {
  id: string;
  points: [number, number, number][];
  isPrimary: boolean;
  estimatedTime: number;
}

interface FloorPlan {
  id: string;
  name: string;
  floor: number;
  rooms: Room[];
  evacuationPaths: EvacuationPath[];
  exitPoints: [number, number, number][];
  assemblyPoint: [number, number, number];
}

interface EvacuationRoute3DProps {
  floorPlan: FloorPlan;
  simulationMode?: boolean;
  onSimulationComplete?: (stats: any) => void;
  visualEffects?: {
    fogColor?: string;
    fogNear?: number;
    fogFar?: number;
    skySunPosition?: [number, number, number];
    ambientIntensity?: number;
    dirLightIntensity?: number;
  };
  scenarioType?: 'earthquake' | 'fire' | 'flood' | 'chemical' | 'lockdown' | 'bomb_threat' | 'cyber_attack' | 'power_outage' | 'tornado' | 'gas_leak' | 'building_collapse' | null;
  onRoomSelect?: (room: Room | null) => void;
}

// ─── Particle System Component ───────────────────────────────────────
const ParticleSystem: React.FC<{
  count: number;
  position: [number, number, number];
  color: string;
  size: number;
  speed: number;
  spread: number;
  direction: 'up' | 'down' | 'random';
}> = ({ count, position, color, size, speed, spread, direction }) => {
  const points = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = position[0] + (Math.random() - 0.5) * spread;
      pos[i3 + 1] = position[1];
      pos[i3 + 2] = position[2] + (Math.random() - 0.5) * spread;

      vel[i3] = (Math.random() - 0.5) * 0.1;
      vel[i3 + 1] = direction === 'up' ? Math.random() * speed :
        direction === 'down' ? -Math.random() * speed :
          (Math.random() - 0.5) * speed;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    return [pos, vel];
  }, [count, position, spread, speed, direction]);

  const geometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [positions]);

  useFrame(() => {
    if (!points.current) return;
    const pos = points.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] += velocities[i3];
      pos[i3 + 1] += velocities[i3 + 1];
      pos[i3 + 2] += velocities[i3 + 2];
      if (pos[i3 + 1] > position[1] + 10 || pos[i3 + 1] < position[1] - 5) {
        pos[i3] = position[0] + (Math.random() - 0.5) * spread;
        pos[i3 + 1] = position[1];
        pos[i3 + 2] = position[2] + (Math.random() - 0.5) * spread;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// ─── Fire Effect Component ───────────────────────────────────────────
const FireEffect: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({ position, size }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 10) * 0.5;
    }
  });

  return (
    <group position={position}>
      <ParticleSystem count={100} position={[0, size[1] / 2, 0]} color="#ff4500" size={0.3} speed={1.5} spread={size[0]} direction="up" />
      <ParticleSystem count={150} position={[0, size[1] / 2 + 2, 0]} color="#333333" size={0.5} speed={0.8} spread={size[0] + 2} direction="up" />
      <pointLight ref={lightRef} position={[0, size[1] / 2, 0]} color="#ff6600" intensity={2} distance={15} />
    </group>
  );
};

// ─── Earthquake Effect Component ─────────────────────────────────────
const EarthquakeEffect: React.FC<{ active: boolean }> = ({ active }) => {
  const cameraShakeRef = useRef({ x: 0, y: 0, z: 0 });

  useFrame((state) => {
    if (!active) return;
    const intensity = 0.15;
    cameraShakeRef.current.x = (Math.random() - 0.5) * intensity;
    cameraShakeRef.current.y = (Math.random() - 0.5) * intensity;
    cameraShakeRef.current.z = (Math.random() - 0.5) * intensity;
    state.camera.position.x += cameraShakeRef.current.x;
    state.camera.position.y += cameraShakeRef.current.y;
    state.camera.position.z += cameraShakeRef.current.z;
  });

  return (
    <group>
      {active && (
        <>
          <ParticleSystem count={80} position={[0, 8, 0]} color="#8B7355" size={0.2} speed={2} spread={20} direction="down" />
          <ParticleSystem count={200} position={[0, 1, 0]} color="#D2B48C" size={0.15} speed={0.3} spread={25} direction="random" />
        </>
      )}
    </group>
  );
};

// ─── Flood Effect Component ──────────────────────────────────────────
const FloodEffect: React.FC<{ waterLevel: number }> = ({ waterLevel }) => {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      waterRef.current.position.y = waterLevel + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, waterLevel, 0]}>
        <planeGeometry args={[60, 60, 32, 32]} />
        <meshStandardMaterial color="#1E90FF" transparent opacity={0.6} roughness={0.1} metalness={0.8} />
      </mesh>
      <ParticleSystem count={100} position={[0, waterLevel + 2, 0]} color="#4169E1" size={0.15} speed={1} spread={20} direction="down" />
      <ParticleSystem count={150} position={[0, waterLevel + 0.5, 0]} color="#B0E0E6" size={0.4} speed={0.2} spread={25} direction="up" />
    </group>
  );
};

// ─── Chemical Gas Effect Component ───────────────────────────────────
const ChemicalEffect: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({ position, size }) => {
  return (
    <group position={position}>
      <ParticleSystem count={200} position={[0, size[1] / 2, 0]} color="#9ACD32" size={0.6} speed={0.5} spread={size[0] + 5} direction="random" />
      <ParticleSystem count={150} position={[0, size[1] / 2, 0]} color="#ADFF2F" size={0.8} speed={0.3} spread={size[0] + 2} direction="up" />
    </group>
  );
};

// ─── Tornado Effect Component ────────────────────────────────────────
const TornadoEffect: React.FC<{ active: boolean }> = ({ active }) => {
  const tornadoRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!active || !tornadoRef.current) return;
    tornadoRef.current.rotation.y += 0.1;
  });

  const spiralParticles = useMemo(() => {
    const particles = [];
    const layers = 15;
    const particlesPerLayer = 20;
    for (let layer = 0; layer < layers; layer++) {
      const height = layer * 0.8;
      const radius = 3 + layer * 0.3;
      for (let i = 0; i < particlesPerLayer; i++) {
        const angle = (i / particlesPerLayer) * Math.PI * 2 + layer * 0.5;
        particles.push({ x: Math.cos(angle) * radius, y: height, z: Math.sin(angle) * radius });
      }
    }
    return particles;
  }, []);

  if (!active) return null;

  return (
    <group ref={tornadoRef} position={[0, 0, 0]}>
      {spiralParticles.map((pos, i) => (
        <Sphere key={i} args={[0.15, 8, 8]} position={[pos.x, pos.y, pos.z]}>
          <meshStandardMaterial color="#CCCCCC" transparent opacity={0.5} />
        </Sphere>
      ))}
      <ParticleSystem count={100} position={[0, 5, 0]} color="#8B4513" size={0.25} speed={3} spread={8} direction="random" />
      <ParticleSystem count={200} position={[0, 2, 0]} color="#D2B48C" size={0.4} speed={1.5} spread={10} direction="random" />
    </group>
  );
};

// ─── Gas Leak Effect Component ───────────────────────────────────────
const GasLeakEffect: React.FC<{ position: [number, number, number]; size: [number, number, number]; timeElapsed: number }> = ({ position, size, timeElapsed }) => {
  const lightRef = useRef<THREE.PointLight>(null);
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 5) * 0.5;
    }
  });
  const gasSpread = Math.min(size[0] + timeElapsed * 0.1, size[0] + 10);

  return (
    <group position={position}>
      <ParticleSystem count={250} position={[0, size[1] / 2, 0]} color="#7CFC00" size={0.7} speed={0.4} spread={gasSpread} direction="random" />
      <ParticleSystem count={180} position={[0, size[1] / 2, 0]} color="#32CD32" size={0.9} speed={0.2} spread={size[0] + 3} direction="up" />
      <pointLight ref={lightRef} position={[0, size[1] + 2, 0]} color="#FF0000" intensity={1.5} distance={20} />
    </group>
  );
};

// ─── Building Collapse Effect Component ──────────────────────────────
const BuildingCollapseEffect: React.FC<{ active: boolean }> = ({ active }) => {
  if (!active) return null;
  return (
    <group>
      <ParticleSystem count={150} position={[15, 8, 0]} color="#696969" size={0.4} speed={4} spread={8} direction="down" />
      <ParticleSystem count={200} position={[15, 6, 0]} color="#A9A9A9" size={0.25} speed={3} spread={10} direction="down" />
      <ParticleSystem count={300} position={[15, 3, 0]} color="#D3D3D3" size={0.6} speed={0.8} spread={15} direction="random" />
      <ParticleSystem count={250} position={[15, 1, 0]} color="#C0C0C0" size={0.5} speed={0.5} spread={18} direction="random" />
    </group>
  );
};

// ─── Room Component — interactive with click-to-select, hover glow, double-click zoom ────
const Room3D: React.FC<{
  room: Room;
  isActive: boolean;
  scenarioType?: string;
  onClick?: () => void;
  onDoubleClick?: () => void;
  animationDelay?: number;
}> = ({ room, isActive, scenarioType, onClick, onDoubleClick, animationDelay = 0 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [animProgress, setAnimProgress] = useState(0);

  // Animated entrance — rooms fly in from below
  useFrame((state, delta) => {
    if (animProgress < 1) {
      const elapsed = state.clock.elapsedTime;
      const t = Math.min(1, Math.max(0, (elapsed - animationDelay * 0.08) * 1.5));
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimProgress(eased);
    }

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (isActive) {
        material.emissive = new THREE.Color(0x4488ff);
        material.emissiveIntensity = Math.sin(state.clock.elapsedTime * 3) * 0.3 + 0.5;
      } else if (hovered) {
        material.emissive = new THREE.Color(0x666666);
        material.emissiveIntensity = 0.3;
      } else {
        material.emissive = new THREE.Color(0x000000);
        material.emissiveIntensity = 0;
      }
      const targetScale = hovered ? 1.05 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
  });

  const getColor = () => {
    if (room.isHazard) return '#ff3333';
    switch (room.type) {
      case 'classroom': return '#88aadd'; // Soft blue
      case 'hallway': return '#7799cc'; // Slightly darker blue for hallways
      case 'exit': return '#00ff66';
      case 'assembly': return '#0088ff';
      case 'stairs': return '#ffaa00';
      case 'office': return '#bb88ff';
      default: return '#88aadd';
    }
  };

  const yOffset = (1 - animProgress) * -8; // fly in from below

  return (
    <group position={[room.position[0], room.position[1] + yOffset, room.position[2]]}>
      <Box
        ref={meshRef}
        args={room.size}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onDoubleClick={(e) => { e.stopPropagation(); onDoubleClick?.(); }}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <meshStandardMaterial
          color={getColor()}
          transparent
          opacity={room.type === 'hallway' ? 0.4 : (hovered ? 0.95 : 0.85)}
          roughness={0.4}
          metalness={0.1}
        />
      </Box>
      {/* Hover / active info popup */}
      {(hovered || isActive) && (
        <Html distanceFactor={10}>
          <div style={{
            background: 'rgba(0,0,0,0.9)',
            color: 'white',
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: 12,
            whiteSpace: 'nowrap',
            border: isActive ? '2px solid #4488ff' : '1px solid #555',
            backdropFilter: 'blur(4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: 3, fontSize: 13 }}>{room.name}</div>
            <div style={{ color: '#aaa', textTransform: 'capitalize' }}>{room.type}</div>
            {room.isHazard && <div style={{ color: '#ff4444', fontWeight: 'bold', marginTop: 2 }}>⚠ HAZARD ZONE</div>}
            {isActive && <div style={{ color: '#88bbff', fontSize: 10, marginTop: 3 }}>Double-click to zoom</div>}
          </div>
        </Html>
      )}
      {/* Room label */}
      <Text
        position={[0, room.size[1] / 2 + 0.5, 0]}
        fontSize={0.45}
        color="white"
        outlineWidth={0.05}
        outlineColor="black"
        anchorX="center"
        anchorY="middle"
      >
        {room.name}
      </Text>

      {/* Hazard visual effects */}
      {room.isHazard && scenarioType === 'fire' && <FireEffect position={[0, 0, 0]} size={room.size} />}
      {room.isHazard && scenarioType === 'chemical' && <ChemicalEffect position={[0, 0, 0]} size={room.size} />}
      {room.isHazard && scenarioType === 'gas_leak' && <GasLeakEffect position={[0, 0, 0]} size={room.size} timeElapsed={0} />}
    </group>
  );
};

// ─── Flowing Student Evacuee — ONE-WAY trip from room to safe zone ─
const StudentEvacuee: React.FC<{
  points: [number, number, number][];
  color: string;
  delay: number; // seconds before this student starts moving
  speed: number;
  onArrived: () => void;
}> = ({ points, color, delay, speed, onArrived }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const elapsedRef = useRef(0);
  const arrivedRef = useRef(false);

  useFrame((_, delta) => {
    if (!meshRef.current || points.length < 2 || arrivedRef.current) return;

    elapsedRef.current += delta;

    // Wait for stagger delay before starting
    if (elapsedRef.current < delay) {
      meshRef.current.visible = false;
      return;
    }

    meshRef.current.visible = true;
    const movingTime = elapsedRef.current - delay;
    const t = Math.min(movingTime * speed * 0.03, 1); // 0→1 progress

    if (t >= 1) {
      // Arrived at safe zone!
      arrivedRef.current = true;
      meshRef.current.visible = false;
      onArrived();
      return;
    }

    // Interpolate along path segments
    const totalSegments = points.length - 1;
    const segFloat = t * totalSegments;
    const segIndex = Math.min(Math.floor(segFloat), totalSegments - 1);
    const segT = segFloat - segIndex;

    const p1 = points[segIndex];
    const p2 = points[segIndex + 1];

    meshRef.current.position.set(
      p1[0] + (p2[0] - p1[0]) * segT,
      p1[1] + (p2[1] - p1[1]) * segT + 0.4,
      p1[2] + (p2[2] - p1[2]) * segT
    );
  });

  return (
    <mesh ref={meshRef} visible={false}>
      <sphereGeometry args={[0.35, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </mesh>
  );
};

// ─── Evacuation Path Component — 3D tube with glow and flowing markers ─
const EvacuationPath3D: React.FC<{ path: EvacuationPath; animated: boolean; onStudentArrived?: () => void }> = ({ path, animated, onStudentArrived }) => {
  const isLineOnly = path.id.startsWith('line-');
  const isFlowOnly = path.id.startsWith('flow-');

  const isOffice = path.id.includes('office') || path.id.includes('staff') || path.id.includes('lib') || path.id.includes('meet') || path.id.includes('server');
  const studentCount = isOffice ? 1 : 3;

  // Build a CatmullRom curve from path points (raised above floor)
  const curve = useMemo(() => {
    const raisedPoints = path.points.map(
      p => new THREE.Vector3(p[0], p[1] + 0.4, p[2])
    );
    return new THREE.CatmullRomCurve3(raisedPoints, false, 'catmullrom', 0.3);
  }, [path.points]);

  const coreColor = path.isPrimary ? '#33cc55' : '#eebb00'; // Dimmer/lighter green and yellow
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (materialRef.current && animated) {
      // Create a softer pulsing glow effect
      const pulseSpeed = path.isPrimary ? 3 : 2;
      materialRef.current.emissiveIntensity = 1.0 + Math.sin(state.clock.elapsedTime * pulseSpeed) * 0.8;
    }
  });

  return (
    <group>
      {/* Core tube — bright and solid with a pulsing glow, thin line style */}
      {!isFlowOnly && (
        <Tube args={[curve, 32, 0.08, 8, false]}>
          <meshStandardMaterial
            ref={materialRef}
            color={coreColor}
            emissive={coreColor}
            emissiveIntensity={1.5}
            side={THREE.DoubleSide}
            toneMapped={false}
          />
        </Tube>
      )}

      {/* Student Evacuees (dark green for primary, dark yellow for alternative) */}
      {!isLineOnly && animated && Array.from({ length: studentCount }).map((_, i) => (
        <StudentEvacuee
          key={`student-${path.id}-${i}`}
          points={path.points}
          color={path.isPrimary ? '#004400' : '#aa7700'}
          delay={i * 1.5}
          speed={path.isPrimary ? 1.8 : 1.4}
          onArrived={onStudentArrived || (() => { })}
        />
      ))}

      {/* Bright endpoint marker (assembly direction) */}
      {!isFlowOnly && path.points.length > 0 && (
        <group position={[path.points[path.points.length - 1][0], path.points[path.points.length - 1][1] + 0.4, path.points[path.points.length - 1][2]]}>
          <Sphere args={[0.4, 12, 12]}>
            <meshStandardMaterial
              color={coreColor}
              emissive={coreColor}
              emissiveIntensity={1.5}
            />
          </Sphere>
        </group>
      )}
    </group>
  );
};

// ─── Exit Point Component — bright pulsing beacon ────────────────────
const ExitPoint3D: React.FC<{ position: [number, number, number]; isPrimary?: boolean }> = ({ position, isPrimary }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.3;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 4) * 1;
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[1.2, 2.5, 0.3]}>
        <meshStandardMaterial color="#00ff66" emissive="#00ff66" emissiveIntensity={0.8} />
      </Box>
      <Text position={[0, 2.5, 0]} fontSize={0.9} color="#00ff66" outlineWidth={0.04} outlineColor="black" anchorX="center" anchorY="middle">
        EXIT
      </Text>
      <pointLight ref={lightRef} position={[0, 1, 1]} color="#00ff66" intensity={2} distance={15} />
      {isPrimary && <pointLight position={[0, 0, -1]} color="#00ff66" intensity={1.5} distance={12} />}
    </group>
  );
};

// ─── Assembly Point Component ────────────────────────────────────────
const AssemblyPoint3D: React.FC<{ position: [number, number, number] }> = ({ position }) => {
  const meshRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Sphere args={[2, 16, 16]}>
        <meshStandardMaterial color="#0080ff" transparent opacity={0.5} wireframe />
      </Sphere>
      <Text position={[0, 3, 0]} fontSize={1} color="#0080ff" anchorX="center" anchorY="middle">
        ASSEMBLY POINT
      </Text>
      <Html position={[0, -3, 0]} center>
        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
          Safe Zone
        </div>
      </Html>
    </group>
  );
};

// ─── Person Simulator ────────────────────────────────────────────────
const Person3D: React.FC<{
  startPosition: [number, number, number];
  path: [number, number, number][];
  speed: number;
  color?: string;
  onReachDestination: () => void;
}> = ({ startPosition, path, speed, color = '#ff00ff', onReachDestination }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [position, setPosition] = useState(startPosition);

  useFrame((state, delta) => {
    if (meshRef.current && currentPathIndex < path.length) {
      const target = path[currentPathIndex];
      const direction = new THREE.Vector3(
        target[0] - position[0],
        target[1] - position[1],
        target[2] - position[2]
      );
      const distance = direction.length();
      if (distance > 0.1) {
        direction.normalize();
        const movement = direction.multiplyScalar(speed * delta);
        const newPosition: [number, number, number] = [
          position[0] + movement.x,
          position[1] + movement.y,
          position[2] + movement.z
        ];
        setPosition(newPosition);
        meshRef.current.position.set(...newPosition);
      } else {
        if (currentPathIndex === path.length - 1) {
          onReachDestination();
        }
        setCurrentPathIndex(currentPathIndex + 1);
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[0.3, 8, 8]} position={position}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
};

// ─── Camera Controls with zoom-to-target ─────────────────────────────
const CameraAnimator: React.FC<{
  targetPosition: [number, number, number] | null;
  onComplete: () => void;
}> = ({ targetPosition, onComplete }) => {
  const { camera } = useThree();
  const animating = useRef(false);
  const targetVec = useRef(new THREE.Vector3());
  const startVec = useRef(new THREE.Vector3());
  const progress = useRef(0);

  useEffect(() => {
    if (targetPosition) {
      startVec.current.copy(camera.position);
      // Position camera offset from target
      targetVec.current.set(
        targetPosition[0] + 6,
        targetPosition[1] + 5,
        targetPosition[2] + 6
      );
      progress.current = 0;
      animating.current = true;
    }
  }, [targetPosition, camera]);

  useFrame((state, delta) => {
    if (!animating.current) return;

    progress.current = Math.min(1, progress.current + delta * 1.5);
    // Ease-out cubic
    const t = 1 - Math.pow(1 - progress.current, 3);

    camera.position.lerpVectors(startVec.current, targetVec.current, t);

    if (progress.current >= 1) {
      animating.current = false;
      onComplete();
    }
  });

  return null;
};

// ─── Main 3D Evacuation Route Component ──────────────────────────────
const EvacuationRoute3D: React.FC<EvacuationRoute3DProps> = ({
  floorPlan,
  simulationMode = false,
  onSimulationComplete,
  visualEffects,
  scenarioType = null,
  onRoomSelect,
}) => {
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [simulationStarted, setSimulationStarted] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [evacuees, setEvacuees] = useState<Array<{ id: string; startPosition: [number, number, number]; path: [number, number, number][]; color: string; speed: number }>>([]);
  const [floodWaterLevel, setFloodWaterLevel] = useState(-2);
  const [completedCount, setCompletedCount] = useState(0);
  const [allEvacuated, setAllEvacuated] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsRef = useRef<any>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  const [showRoutes, setShowRoutes] = useState(true);

  useEffect(() => {
    if (simulationMode && simulationStarted && !allEvacuated) {
      timerRef.current = setInterval(() => {
        setSimulationTime(prev => prev + 1);
        if (scenarioType === 'flood') {
          setFloodWaterLevel(prev => Math.min(prev + 0.02, 2));
        }
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [simulationMode, simulationStarted, allEvacuated, scenarioType]);

  useEffect(() => {
    if (simulationStarted && evacuees.length > 0 && completedCount >= evacuees.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      setAllEvacuated(true);
      setSimulationStarted(false);
      if (onSimulationComplete) {
        onSimulationComplete({
          evacuationTime: simulationTime,
          peopleEvacuated: completedCount,
          bottlenecks: Math.floor(Math.random() * 3),
          safetyScore: Math.max(0, 100 - (simulationTime / 60) * 10 - Math.floor(Math.random() * 5))
        });
      }
    }
  }, [completedCount, evacuees.length, simulationStarted, simulationTime, onSimulationComplete]);

  const getScenarioSpeed = (): number => {
    switch (scenarioType) {
      case 'earthquake': return 1.2;
      case 'fire': return 3.0;
      case 'chemical': return 1.5;
      case 'flood': return 1.0;
      case 'tornado': return 2.5;
      case 'gas_leak': return 1.8;
      case 'building_collapse': return 2.8;
      case 'lockdown': return 0.8;
      default: return 2.0;
    }
  };

  const startSimulation = () => {
    setSimulationStarted(true);
    setAllEvacuated(false);
    setFloodWaterLevel(-2);
    setCompletedCount(0);

    // Count total students that will be spawned across all flow paths
    const flowPaths = floorPlan.evacuationPaths.filter(p => !p.id.startsWith('line-'));
    let totalStudents = 0;
    flowPaths.forEach(p => {
      const isOffice = p.id.includes('office') || p.id.includes('staff') || p.id.includes('lib') || p.id.includes('meet') || p.id.includes('server');
      totalStudents += isOffice ? 1 : 3;
    });

    // Use evacuees array just to track the count for the completion logic
    const studentPlaceholders = Array.from({ length: totalStudents }, (_, i) => ({
      id: `student-${i}`,
      startPosition: [0, 0, 0] as [number, number, number],
      path: [] as [number, number, number][],
      color: '#000',
      speed: 1,
    }));
    setEvacuees(studentPlaceholders);
  };

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSimulationStarted(false);
    setAllEvacuated(false);
    setSimulationTime(0);
    setEvacuees([]);
    setFloodWaterLevel(-2);
    setCompletedCount(0);
  };

  // Camera preset handlers
  const setCameraPreset = useCallback((preset: 'top' | 'front' | 'side' | 'reset') => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;

    let pos: [number, number, number];
    switch (preset) {
      case 'top':
        pos = [0, 30, 0.1];
        break;
      case 'front':
        pos = [0, 8, 25];
        break;
      case 'side':
        pos = [25, 8, 0];
        break;
      default: // reset
        pos = [15, 15, 15];
        break;
    }
    setCameraTarget(pos);
  }, []);

  const handleRoomClick = useCallback((room: Room) => {
    const newId = activeRoomId === room.id ? null : room.id;
    setActiveRoomId(newId);
    onRoomSelect?.(newId ? room : null);
  }, [activeRoomId, onRoomSelect]);

  const handleRoomDoubleClick = useCallback((room: Room) => {
    setCameraTarget(room.position);
    setActiveRoomId(room.id);
    onRoomSelect?.(room);
  }, [onRoomSelect]);

  return (
    <div className="relative w-full h-full">
      {/* Top Toolbar (Controls + Legend combined for space saving) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">

        {/* Left Side: General Info & Simulation Controls */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 flex gap-4 items-center border border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Floor</span>
            <span className="text-sm font-semibold text-gray-900">{floorPlan.name}</span>
          </div>
          <div className="w-px h-8 bg-gray-200"></div>
          {scenarioType && (
            <>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scenario</span>
                <span className="text-sm font-bold text-red-600 capitalize">{scenarioType.replace('_', ' ')}</span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
            </>
          )}

          {simulationMode && (
            <div className="flex items-center gap-3">
              <div className="flex flex-col min-w-[60px]">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time</span>
                <span className="text-sm font-mono font-bold text-gray-900">{simulationTime}s</span>
              </div>
              {allEvacuated && (
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded border border-green-200 font-semibold animate-pulse">
                  ✅ Evacuated
                </span>
              )}
              <div className="flex gap-1">
                <button
                  onClick={startSimulation}
                  disabled={simulationStarted || allEvacuated}
                  className="px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 text-xs font-bold transition-colors shadow-sm"
                >
                  ▶ Start
                </button>
                <button
                  onClick={resetSimulation}
                  className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs font-bold transition-colors shadow-sm"
                >
                  ↺ Reset
                </button>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
            </div>
          )}

          {/* Route Toggle */}
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-3 py-1.5 rounded flex items-center gap-1.5 text-xs font-bold transition-colors shadow-sm ${showRoutes ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'}`}
          >
            <div className={`w-2 h-2 rounded-full ${showRoutes ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            Routes
          </button>
        </div>

        {/* Right Side: Legend */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100 flex flex-col gap-2">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Legend</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-400"></div><span className="text-gray-700">Classroom</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-blue-500"></div><span className="text-gray-700">Safe Zone</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-gray-600 opacity-50"></div><span className="text-gray-700">Hallway</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500"></div><span className="text-gray-700 text-red-600 font-semibold">Hazard</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-green-500"></div><span className="text-gray-700">Exit</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-1.5 rounded-full bg-green-400"></div><span className="text-gray-700">Primary</span></div>
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-orange-500"></div><span className="text-gray-700">Stairs</span></div>
            <div className="flex items-center gap-1.5"><div className="w-4 h-1.5 rounded-full bg-yellow-400 text-[10px] leading-none text-center text-yellow-800 font-bold">--</div><span className="text-gray-700">Alt Route</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Camera Controls */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg p-1.5 flex gap-1 border border-gray-200">
        <span className="px-3 py-1.5 text-xs font-bold text-gray-500 flex items-center border-r border-gray-200 mr-1">🎥 View</span>
        {(['top', 'front', 'side', 'reset'] as const).map(preset => (
          <button
            key={preset}
            onClick={() => setCameraPreset(preset)}
            className="px-4 py-1.5 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-full text-xs font-bold transition-colors capitalize flex items-center gap-1"
          >
            {preset === 'reset' ? '↺ Reset' : preset === 'top' ? '⬆ Top' : preset === 'front' ? '👁 Front' : '👈 Side'}
          </button>
        ))}
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [15, 15, 15], fov: 60 }} shadows>
        {/* Sky and Fog */}
        <Sky sunPosition={visualEffects?.skySunPosition || [50, 20, 50]} turbidity={6} rayleigh={1.2} mieCoefficient={0.01} mieDirectionalG={0.8} inclination={0.49} azimuth={0.25} />
        {/* @ts-ignore */}
        <fog attach="fog" args={[visualEffects?.fogColor || '#cfe8ff', visualEffects?.fogNear || 25, visualEffects?.fogFar || 150]} />

        {/* Lights */}
        <ambientLight intensity={scenarioType === 'lockdown' ? 0.2 : (visualEffects?.ambientIntensity ?? 0.7)} />
        <directionalLight position={[10, 15, 5]} intensity={visualEffects?.dirLightIntensity ?? 1.4} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.3} />
        <pointLight position={[0, 12, 0]} intensity={0.5} distance={40} color="#ffffff" />

        {/* Camera controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
          enableDamping
          dampingFactor={0.05}
        />

        {/* Camera zoom-to-target */}
        <CameraAnimator
          targetPosition={cameraTarget}
          onComplete={() => setCameraTarget(null)}
        />

        {/* Grid Floor */}
        <gridHelper args={[50, 50, '#666666', '#444444']} />

        {/* Ground plane for better visual grounding */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial color="#e8e8e8" transparent opacity={0.3} />
        </mesh>

        {/* Disaster Effects */}
        {scenarioType === 'earthquake' && <EarthquakeEffect active={simulationStarted} />}
        {scenarioType === 'flood' && simulationStarted && <FloodEffect waterLevel={floodWaterLevel} />}
        {scenarioType === 'tornado' && <TornadoEffect active={simulationStarted} />}
        {scenarioType === 'building_collapse' && <BuildingCollapseEffect active={simulationStarted} />}

        {/* Render Rooms — clickable with animated entrance */}
        {floorPlan.rooms.map((room, index) => (
          <Room3D
            key={room.id}
            room={room}
            isActive={room.id === activeRoomId}
            scenarioType={scenarioType || undefined}
            onClick={() => handleRoomClick(room)}
            onDoubleClick={() => handleRoomDoubleClick(room)}
            animationDelay={index}
          />
        ))}

        {/* Render Evacuation Paths */}
        {showRoutes && floorPlan.evacuationPaths.map(path => (
          <EvacuationPath3D
            key={path.id}
            path={path}
            animated={simulationStarted}
            onStudentArrived={() => setCompletedCount(prev => prev + 1)}
          />
        ))}

        {/* Render Exit Points */}
        {floorPlan.exitPoints.map((exit, index) => (
          <ExitPoint3D
            key={`exit-${index}`}
            position={exit}
            isPrimary={index === 0}
          />
        ))}

        {/* Render Assembly Point */}
        <AssemblyPoint3D position={floorPlan.assemblyPoint} />

        {/* Render Evacuees during simulation */}
        {simulationStarted && evacuees.map(evacuee => (
          <Person3D
            key={evacuee.id}
            startPosition={evacuee.startPosition}
            path={evacuee.path}
            speed={evacuee.speed}
            color={evacuee.color}
            onReachDestination={() => setCompletedCount(prev => prev + 1)}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default EvacuationRoute3D;
