import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import {
  CanvasTexture,
  CircleGeometry,
  Color,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  SphereGeometry,
  Vector2,
} from "three";
import {
  ARC_ANGLE,
  ARC_RADIUS,
  BAKED_CENTER,
  BAKED_TIP,
  DOUGH_COLOR,
  FAN_SPREAD,
  RIDGE_SKEW,
  SEGMENTS,
} from "@/config/croissant";
import { smoothstep } from "@/lib/math";
import { computeCroissantFrame } from "./camera";
import { createCroissantTextures, createSpiralTexture } from "./textures";

const DOUGH = new Color(DOUGH_COLOR);
const BAKED_CENTER_COLOR = new Color(BAKED_CENTER);
const BAKED_TIP_COLOR = new Color(BAKED_TIP);
const BALL_RADIUS = 1.1;
/** Meio comprimento de cada crista e fração do raio que o corte mantém nas pontas do barril. */
const RIDGE_HALF_LENGTH = 0.5;
const CAP_RATIO = 0.72;
/** Tampas levemente recuadas: no arco fechado ficam escondidas dentro da crista vizinha. */
const CAP_INSET = 0.93;
/** Altura em que as pontas do arco se erguem: dá a curva característica do croissant. */
const TIP_LIFT = 0.2;
const ARC_CENTER_OFFSET = 0.45;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface Ridge {
  /** Posição ao longo do arco (−1 a 1). */
  t: number;
  theta: number;
  radius: number;
  /** 0 no centro, 1 nas pontas: as pontas assam mais. */
  tip: number;
}

const RIDGES: Ridge[] = Array.from({ length: SEGMENTS }, (_, index) => {
  const t = (index - (SEGMENTS - 1) / 2) / ((SEGMENTS - 1) / 2);
  const size = 0.24 + 0.72 * Math.pow(Math.cos((t * Math.PI) / 2), 1.1);
  return { t, theta: t * ARC_ANGLE, radius: size * 0.82, tip: Math.abs(t) };
});

/** Barril unitário (eixo x, meio comprimento 1, raio 1): casca lisa + duas tampas planas. */
function createRidgeGeometries() {
  const profile: Vector2[] = [];
  for (let step = 0; step <= 28; step++) {
    const u = (step / 28) * 2 - 1;
    profile.push(new Vector2(CAP_RATIO + (1 - CAP_RATIO) * Math.pow(1 - u * u, 0.5), u));
  }
  const body = new LatheGeometry(profile, 36).rotateZ(Math.PI / 2);
  const cap = new CircleGeometry(CAP_RATIO, 36);
  return {
    body,
    capFront: cap.clone().rotateY(Math.PI / 2).translate(CAP_INSET, 0, 0),
    capBack: cap.clone().rotateY(-Math.PI / 2).translate(-CAP_INSET, 0, 0),
    dispose: () => {
      body.dispose();
      cap.dispose();
    },
  };
}

/**
 * Croissant procedural: cristas em barril ao longo de um arco. A bola de massa que vem da Cena 02
 * encolhe enquanto as cristas crescem de dentro dela; abertas em leque, cada uma mostra o corte
 * em espiral da massa folhada.
 */
export function CroissantModel({ progressRef }: { progressRef: RefObject<number> }) {
  const group = useRef<Group>(null);
  const ball = useRef<Mesh>(null);
  const ridges = useRef<(Group | null)[]>([]);
  const shadow = useRef<Mesh>(null);
  const shadowMaterial = useRef<MeshBasicMaterial>(null);

  const textures = useMemo(() => createCroissantTextures(), []);
  const spiral = useMemo(() => createSpiralTexture(), []);
  const geometries = useMemo(() => createRidgeGeometries(), []);
  const ballGeometry = useMemo(() => new SphereGeometry(1, 48, 32), []);
  const crustMaterials = useMemo(
    () =>
      RIDGES.map(
        () =>
          new MeshPhysicalMaterial({
            map: textures.map,
            bumpMap: textures.bump,
            bumpScale: 2.4,
            roughness: 0.5,
            clearcoat: 0.25,
            clearcoatRoughness: 0.5,
          }),
      ),
    [textures],
  );
  const capMaterial = useMemo(() => new MeshPhysicalMaterial({ map: spiral, roughness: 0.7, side: DoubleSide }), [spiral]);
  const ballMaterial = useMemo(
    () => new MeshPhysicalMaterial({ map: textures.map, color: DOUGH, roughness: 0.65, clearcoat: 0.15 }),
    [textures],
  );
  const shadowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 128;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponível para a sombra do croissant");
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(73,49,38,0.55)");
    gradient.addColorStop(1, "rgba(73,49,38,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(canvas);
  }, []);

  useEffect(
    () => () => {
      textures.map.dispose();
      textures.bump.dispose();
      spiral.dispose();
      geometries.dispose();
      ballGeometry.dispose();
      crustMaterials.forEach((material) => material.dispose());
      capMaterial.dispose();
      ballMaterial.dispose();
      shadowTexture.dispose();
    },
    [textures, spiral, geometries, ballGeometry, crustMaterials, capMaterial, ballMaterial, shadowTexture],
  );

  useFrame(() => {
    const frame = computeCroissantFrame(progressRef.current);
    if (group.current) group.current.rotation.y = frame.spin;

    if (ball.current) {
      const ballScale = BALL_RADIUS * (1 - smoothstep(0.05, 0.4, frame.unfold));
      ball.current.visible = ballScale > 0.02;
      ball.current.scale.setScalar(Math.max(ballScale, 0.001));
    }

    const grow = smoothstep(0, 0.5, frame.unfold);
    const baked = new Color();
    RIDGES.forEach((ridge, index) => {
      const holder = ridges.current[index];
      const material = crustMaterials[index];
      if (!holder || !material) return;
      holder.visible = grow > 0.01;

      baked.copy(BAKED_CENTER_COLOR).lerp(BAKED_TIP_COLOR, ridge.tip);
      material.color.lerpColors(DOUGH, baked, frame.bake);

      const arcX = ARC_RADIUS * Math.sin(ridge.theta);
      const arcY = TIP_LIFT * ridge.t * ridge.t;
      const arcZ = ARC_RADIUS * (1 - Math.cos(ridge.theta)) - ARC_CENTER_OFFSET;
      const arcYaw = -ridge.theta + RIDGE_SKEW;

      // Leque: as cristas giram para mostrar o corte e se abrem horizontalmente, em ordem de profundidade.
      const fanX = ridge.t * FAN_SPREAD;
      const fanY = 0.22 * Math.sin(index * 1.9);
      const fanZ = -Math.abs(ridge.t) * 0.5;
      const fanYaw = (ridge.t >= 0 ? -Math.PI / 2 : Math.PI / 2) + ridge.t * 0.45;

      holder.position.set(
        lerp(arcX, fanX, frame.explode) * grow,
        lerp(arcY, fanY, frame.explode) * grow,
        lerp(arcZ, fanZ, frame.explode) * grow,
      );
      holder.rotation.y = lerp(arcYaw, fanYaw, frame.explode);
      holder.scale.set(RIDGE_HALF_LENGTH * grow, ridge.radius * grow, ridge.radius * grow);
    });

    if (shadow.current) shadow.current.scale.setScalar(lerp(2.4, 3.8, frame.unfold) * (1 + 0.25 * frame.explode));
    if (shadowMaterial.current) shadowMaterial.current.opacity = 0.9 - 0.4 * frame.explode;
  });

  return (
    <>
      <group ref={group}>
        <mesh ref={ball} geometry={ballGeometry} material={ballMaterial} />
        {RIDGES.map((ridge, index) => (
          <group
            key={ridge.t}
            ref={(holder) => {
              ridges.current[index] = holder;
            }}
          >
            <mesh geometry={geometries.body} material={crustMaterials[index]} />
            <mesh geometry={geometries.capFront} material={capMaterial} />
            <mesh geometry={geometries.capBack} material={capMaterial} />
          </group>
        ))}
      </group>
      <mesh ref={shadow} position={[0, -1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial ref={shadowMaterial} map={shadowTexture} transparent depthWrite={false} side={DoubleSide} />
      </mesh>
    </>
  );
}
