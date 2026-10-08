import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import type { Points, PointsMaterial } from "three";
import { computeCroissantFrame } from "./camera";
import { createSpriteTexture } from "./textures";

interface BurstProps {
  progressRef: RefObject<number>;
  count: number;
  /** Alcance máximo do jorro, em unidades da cena. */
  reach: number;
  size: number;
  /** Qual valor do quadro conduz o jorro (0–1). */
  drive: "burstUnfold" | "burstExplode";
}

/** Direções fixas no hemisfério superior (sequência de Fibonacci), com velocidades variadas. */
function buildDirections(count: number) {
  const directions = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    const y = 0.15 + 0.85 * ((i + 0.5) / count);
    const radius = Math.sqrt(1 - y * y);
    const angle = i * 2.399963;
    directions.set([Math.cos(angle) * radius, y, Math.sin(angle) * radius, 0.55 + ((i * 37) % 100) / 220], i * 4);
  }
  return directions;
}

/**
 * Partículas de farinha e lascas. A posição é função pura do progresso (nada de integração por
 * quadro), então rolar de volta recolhe as partículas exatamente para onde saíram.
 */
export function FlourBurst({ progressRef, count, reach, size, drive }: BurstProps) {
  const points = useRef<Points>(null);
  const directions = useMemo(() => buildDirections(count), [count]);
  const material = useRef<PointsMaterial>(null);
  const initialPositions = useMemo(() => new Float32Array(count * 3), [count]);
  const sprite = useMemo(() => createSpriteTexture(), []);

  useEffect(() => () => sprite.dispose(), [sprite]);

  useFrame(() => {
    const value = computeCroissantFrame(progressRef.current)[drive];
    const attribute = points.current?.geometry.getAttribute("position");
    if (!attribute) return;
    const buffer = attribute.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const speed = (directions[i * 4 + 3] ?? 1) * reach * value;
      buffer[i * 3] = (directions[i * 4] ?? 0) * speed;
      buffer[i * 3 + 1] = (directions[i * 4 + 1] ?? 0) * speed - 0.3 * value * value;
      buffer[i * 3 + 2] = (directions[i * 4 + 2] ?? 0) * speed;
    }
    attribute.needsUpdate = true;
    // Aparecem logo após a partida e se dissipam antes do fim do trajeto.
    if (material.current) material.current.opacity = Math.sin(Math.PI * Math.min(1, value * 1.05)) * 0.9;
    if (points.current) points.current.visible = value > 0.001 && value < 0.999;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
      </bufferGeometry>
      <pointsMaterial ref={material} map={sprite} size={size} transparent depthWrite={false} sizeAttenuation />
    </points>
  );
}
