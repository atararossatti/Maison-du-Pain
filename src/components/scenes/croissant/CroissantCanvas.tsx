"use client";

import { Canvas, useFrame, useStore } from "@react-three/fiber";
import { useEffect, type RefObject } from "react";
import { PMREMGenerator } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { CAMERA, FLOUR_PARTICLES, SHARD_PARTICLES } from "@/config/croissant";
import { computeCroissantFrame } from "./camera";
import { CroissantModel } from "./CroissantModel";
import { FlourBurst } from "./FlourBurst";

interface CanvasProps {
  progressRef: RefObject<number>;
  /** Quando falso, o laço de renderização é pausado (cena fora da tela). */
  active: boolean;
  lowPower: boolean;
}

/** Iluminação de estúdio gerada em código: dispensa baixar um HDR externo. */
function StudioEnvironment() {
  const store = useStore();

  useEffect(() => {
    const { gl, scene } = store.getState();
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.5;
    generator.dispose();
    return () => {
      scene.environment = null;
      target.dispose();
    };
  }, [store]);

  return null;
}

function CameraRig({ progressRef }: { progressRef: RefObject<number> }) {
  useFrame(({ camera }) => {
    const { distance, elevation } = computeCroissantFrame(progressRef.current).camera;
    camera.position.set(0, Math.sin(elevation) * distance, Math.cos(elevation) * distance);
    camera.lookAt(0, 0.05, 0);
  });
  return null;
}

export default function CroissantCanvas({ progressRef, active, lowPower }: CanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={lowPower ? 1 : [1, 1.5]}
      gl={{ alpha: true, antialias: !lowPower, powerPreference: "high-performance" }}
      camera={{ fov: CAMERA.fov, near: 0.1, far: 40, position: [0, 3, 6] }}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.35} color="#ffe9c9" />
      <directionalLight position={[3, 5, 3]} intensity={2.6} color="#ffd9a0" />
      <directionalLight position={[-4, 2, -3]} intensity={1.1} color="#f3d2bc" />
      <CameraRig progressRef={progressRef} />
      <CroissantModel progressRef={progressRef} />
      <FlourBurst progressRef={progressRef} count={FLOUR_PARTICLES} reach={3.6} size={0.16} drive="burstUnfold" />
      <FlourBurst progressRef={progressRef} count={SHARD_PARTICLES} reach={2.4} size={0.1} drive="burstExplode" />
    </Canvas>
  );
}
