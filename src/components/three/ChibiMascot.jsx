import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error loading 3D model:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function GLBMascot() {
  const group = useRef();
  const { scene } = useGLTF('public/models/ascend-character.glb');

  // Clone scene to avoid sharing materials state unnecessarily, though not strictly required for a single instance
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Increase the multiplier to make it follow more noticeably across the screen
    const mouseX = (state.pointer.x * Math.PI) / 2;
    const mouseY = (state.pointer.y * Math.PI) / 2;

    if (group.current) {
      // Subtle idle animation: gentle breathing/bobbing only (fixed position)
      group.current.position.x = 0;
      group.current.position.y = Math.sin(t * 1.5) * 0.05;

      // Cursor follow: Head/body subtly follow cursor
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseX * 0.5, 0.05);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouseY * 0.2, 0.05);
      // Very slight body rotation for z to add some liveliness
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -mouseX * 0.1, 0.05);
    }
  });

  return (
    <group position={[0, -0.6, 0]}>
      <Float speed={2} rotationIntensity={0.05} floatIntensity={0.1}>
        <group ref={group}>
          <primitive object={clonedScene} scale={1.3} position={[0, 1.2, 0]} />
        </group>
      </Float>

      {/* PLATFORM */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing Ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.4, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>
      {/* Base Light */}
      <pointLight position={[0, 0.5, 0]} color="#9333ea" intensity={1} distance={4} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/ascend-character.glb');

function FallbackMascot() {
  const group = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = t * 0.5;
      group.current.position.y = Math.sin(t * 2) * 0.1 + 1.0;
    }
  });
  return (
    <group position={[0, -0.6, 0]}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.3}>
        <group ref={group}>
          <mesh>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#6d28d9" wireframe />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.8]} />
            <meshStandardMaterial color="#a855f7" />
          </mesh>
        </group>
      </Float>
      {/* Platform */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Glowing Ring */}
      <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.3, 1.4, 32]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Loading Indicator (Simple floating crystal)
function LoadingMascot() {
  const group = useRef();
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y += 0.05;
    }
  });
  return (
    <group position={[0, -0.6, 0]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={group} position={[0, 1.0, 0]}>
          <octahedronGeometry args={[0.5]} />
          <meshStandardMaterial color="#d8b4fe" wireframe />
        </mesh>
      </Float>
      {/* Platform */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.5, 1.6, 0.1, 32]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

// Background Particles
function AmbientParticles() {
  const ref = useRef();
  const count = 40;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8 + 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5 - 2;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.y = t * 0.03;
      ref.current.position.y = Math.sin(t * 0.5) * 0.1;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d8b4fe"
        size={0.06}
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ChibiMascot({ className = '', height = '300px' }) {
  return (
    <div className={`w-full h-full min-h-[300px] ${className}`} style={{ height }} role="img" aria-label="Interactive RPG Mascot">
      <Canvas
        camera={{ position: [0, 1, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Soft purple rim light and dark fantasy atmosphere */}
        <ambientLight intensity={0.6} color="#ffffff" />

        {/* Main Key Light */}
        <directionalLight position={[5, 5, 5]} intensity={1.5} color="#ffffff" castShadow />

        {/* Soft Purple Rim Light */}
        <directionalLight position={[-5, 3, -5]} intensity={2.5} color="#a855f7" />

        {/* Fill Light */}
        <directionalLight position={[0, -2, 5]} intensity={0.5} color="#4c1d95" />

        <ErrorBoundary fallback={<FallbackMascot />}>
          <Suspense fallback={<LoadingMascot />}>
            <GLBMascot />
          </Suspense>
        </ErrorBoundary>

        <AmbientParticles />
        <ContactShadows position={[0, -0.65, 0]} opacity={0.6} scale={5} blur={2.5} far={2} color="#000000" />
      </Canvas>
    </div>
  );
}
