'use client';

import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Text, RoundedBox } from '@react-three/drei';
import { Suspense, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

interface FoodItem {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    position: [number, number, number];
}

interface FoodPlateProps {
    item: FoodItem;
    isSelected: boolean;
    onClick: () => void;
}

// 3D Plate with food image on top
function FoodPlate({ item, isSelected, onClick }: FoodPlateProps) {
    const plateRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    // Load food image as texture
    const texture = useLoader(THREE.TextureLoader, item.imageUrl);

    // Animate plate rotation
    useFrame((state) => {
        if (plateRef.current) {
            // Gentle floating animation
            plateRef.current.position.y = item.position[1] + Math.sin(state.clock.elapsedTime + item.position[0]) * 0.05;

            // Rotate when selected or hovered
            if (isSelected || hovered) {
                plateRef.current.rotation.y += 0.02;
            }
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.3}
        >
            <group
                ref={plateRef}
                position={item.position}
                onClick={onClick}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
                scale={isSelected ? 1.2 : hovered ? 1.1 : 1}
            >
                {/* Plate base */}
                <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
                    <cylinderGeometry args={[1.2, 1.4, 0.1, 32]} />
                    <meshStandardMaterial
                        color={isSelected ? "#a855f7" : "#ffffff"}
                        metalness={0.3}
                        roughness={0.2}
                    />
                </mesh>

                {/* Plate rim */}
                <mesh position={[0, 0, 0]} castShadow>
                    <torusGeometry args={[1.3, 0.08, 16, 32]} />
                    <meshStandardMaterial
                        color={isSelected ? "#ec4899" : "#e2e8f0"}
                        metalness={0.5}
                        roughness={0.3}
                    />
                </mesh>

                {/* Food image on plate */}
                <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1, 32]} />
                    <meshStandardMaterial
                        map={texture}
                        transparent
                        side={THREE.DoubleSide}
                    />
                </mesh>

                {/* Price tag */}
                <group position={[1.3, 0.5, 0]}>
                    <RoundedBox args={[0.8, 0.4, 0.05]} radius={0.05}>
                        <meshStandardMaterial color="#1e1b4b" />
                    </RoundedBox>
                    <Text
                        position={[0, 0, 0.03]}
                        fontSize={0.15}
                        color="#a855f7"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Inter-Bold.woff"
                    >
                        Rs.{item.price}
                    </Text>
                </group>

                {/* Glow effect when selected */}
                {isSelected && (
                    <mesh position={[0, -0.1, 0]}>
                        <cylinderGeometry args={[1.5, 1.5, 0.02, 32]} />
                        <meshBasicMaterial color="#a855f7" transparent opacity={0.3} />
                    </mesh>
                )}
            </group>
        </Float>
    );
}

// Loading fallback for textures
function LoadingPlate({ position }: { position: [number, number, number] }) {
    const plateRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (plateRef.current) {
            plateRef.current.rotation.y = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={plateRef} position={position}>
            <cylinderGeometry args={[1, 1, 0.1, 32]} />
            <meshStandardMaterial color="#4b5563" wireframe />
        </mesh>
    );
}

// Main 3D Scene
interface Food3DSceneProps {
    items: Array<{
        id: string;
        name: string;
        price: number;
        imageUrl: string;
    }>;
    selectedItemId: string | null;
    onSelectItem: (id: string) => void;
}

function Scene({ items, selectedItemId, onSelectItem }: Food3DSceneProps) {
    // Position items in a grid
    const positionedItems: FoodItem[] = useMemo(() => {
        const cols = Math.ceil(Math.sqrt(items.length));
        return items.map((item, index) => ({
            ...item,
            position: [
                (index % cols - cols / 2 + 0.5) * 3.5,
                0,
                (Math.floor(index / cols) - Math.floor(items.length / cols) / 2) * 3.5
            ] as [number, number, number]
        }));
    }, [items]);

    return (
        <>
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <spotLight
                position={[10, 10, 10]}
                angle={0.3}
                penumbra={1}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />
            <spotLight
                position={[-10, 10, -10]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                color="#a855f7"
            />
            <pointLight position={[0, 5, 0]} intensity={0.5} color="#ec4899" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Food plates */}
            {positionedItems.map((item) => (
                <Suspense key={item.id} fallback={<LoadingPlate position={item.position} />}>
                    <FoodPlate
                        item={item}
                        isSelected={selectedItemId === item.id}
                        onClick={() => onSelectItem(item.id)}
                    />
                </Suspense>
            ))}

            {/* Floor/Table surface */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial
                    color="#1e1b4b"
                    metalness={0.1}
                    roughness={0.8}
                    transparent
                    opacity={0.8}
                />
            </mesh>

            {/* Contact shadows for realism */}
            <ContactShadows
                position={[0, -0.49, 0]}
                opacity={0.5}
                scale={30}
                blur={2}
                far={4}
                color="#000000"
            />

            {/* Camera controls */}
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 2.2}
                minDistance={3}
                maxDistance={20}
                autoRotate={!selectedItemId}
                autoRotateSpeed={0.5}
            />
        </>
    );
}

export default function Food3DViewer({ items, selectedItemId, onSelectItem }: Food3DSceneProps) {
    if (items.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900 rounded-2xl">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <p className="text-white text-xl font-semibold mb-2">No Items Yet</p>
                    <p className="text-purple-300">Drag items from the sidebar to see them in 3D</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden">
            <Canvas
                shadows
                camera={{ position: [0, 8, 12], fov: 45 }}
                style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
            >
                <Suspense fallback={null}>
                    <Scene
                        items={items}
                        selectedItemId={selectedItemId}
                        onSelectItem={onSelectItem}
                    />
                </Suspense>
            </Canvas>

            {/* Overlay instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full">
                <p className="text-purple-300 text-sm">
                    🖱️ Drag to rotate • Scroll to zoom • Click plate to select
                </p>
            </div>
        </div>
    );
}
