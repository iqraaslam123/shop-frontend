import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

const FloatingOrbs = () => {
  const groupRef = useRef();

  const orbs = useMemo(() => {
    const count = 20;
    return Array.from({ length: count }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6 - 3,
      ],
      scale: Math.random() * 0.5 + 0.2,
      color: new THREE.Color().setHSL(Math.random() * 0.2 + 0.5, 0.8, 0.5),
      speed: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb, i) => (
        <Float key={i} speed={orb.speed} rotationIntensity={0.2} floatIntensity={0.5}>
          <mesh position={orb.position} scale={orb.scale}>
            <sphereGeometry args={[1, 32, 32]} />
            <MeshDistortMaterial
              color={orb.color}
              transparent
              opacity={0.4}
              distort={0.3}
              speed={2}
              wireframe
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const CenterSphere = () => {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 2]} />
      <MeshDistortMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={0.2}
        transparent
        opacity={0.6}
        distort={0.2}
        speed={3}
        wireframe
      />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <FloatingOrbs />
        <CenterSphere />
      </Canvas>
    </div>
  );
};

export default ThreeScene;
