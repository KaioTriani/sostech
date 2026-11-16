"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Lightformer, RoundedBox, ContactShadows } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ---------- texturas desenhadas em canvas (sem downloads) ---------- */

function useScreenTexture(variant: "lock" | "store" = "lock") {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 1060;
    const x = c.getContext("2d")!;
    const bg = x.createLinearGradient(0, 0, 512, 1060);
    bg.addColorStop(0, "#04122e");
    bg.addColorStop(0.5, "#0756C9");
    bg.addColorStop(1, "#01050d");
    x.fillStyle = bg;
    x.fillRect(0, 0, 512, 1060);
    // ondas de luz
    for (let i = 0; i < 6; i++) {
      x.beginPath();
      x.moveTo(-40, 620 + i * 34);
      x.bezierCurveTo(160, 470 + i * 40, 330, 820 - i * 22, 560, 600 + i * 30);
      x.strokeStyle = `rgba(124,196,255,${0.32 - i * 0.045})`;
      x.lineWidth = 26 - i * 3;
      x.stroke();
    }
    const glow = x.createRadialGradient(256, 640, 10, 256, 640, 420);
    glow.addColorStop(0, "rgba(22,138,255,.55)");
    glow.addColorStop(1, "rgba(22,138,255,0)");
    x.fillStyle = glow;
    x.fillRect(0, 0, 512, 1060);
    x.fillStyle = "#fff";
    x.textAlign = "center";
    if (variant === "lock") {
      x.font = "500 26px Inter, sans-serif";
      x.globalAlpha = 0.85;
      x.fillText("segunda-feira, 16 de novembro", 256, 190);
      x.globalAlpha = 1;
      x.font = "600 150px Sora, sans-serif";
      x.fillText("09:41", 256, 330);
      x.font = "600 22px Inter, sans-serif";
      x.globalAlpha = 0.75;
      x.fillText("SOS TECH CEL", 256, 980);
    } else {
      x.font = "700 64px Sora, sans-serif";
      x.fillText("SOS", 256, 300);
      x.font = "500 26px Inter, sans-serif";
      x.globalAlpha = 0.8;
      x.fillText("TECH CEL", 256, 345);
    }
    // ilha
    x.globalAlpha = 1;
    x.fillStyle = "#000";
    roundRect(x, 196, 30, 120, 36, 18);
    x.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, [variant]);
}

function useCircuitTexture() {
  return useMemo(() => {
    const s = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const x = c.getContext("2d")!;
    x.fillStyle = "#000";
    x.fillRect(0, 0, s, s);
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    x.lineCap = "round";
    for (let i = 0; i < 90; i++) {
      let px = Math.round(rnd() * 32) * 32;
      let py = Math.round(rnd() * 32) * 32;
      x.beginPath();
      x.moveTo(px, py);
      const steps = 2 + Math.floor(rnd() * 4);
      for (let k = 0; k < steps; k++) {
        const len = (1 + Math.floor(rnd() * 5)) * 32;
        const dir = Math.floor(rnd() * 4);
        if (dir === 0) px += len;
        else if (dir === 1) py += len;
        else if (dir === 2) { px += len * 0.7; py += len * 0.7; }
        else { px -= len * 0.7; py += len * 0.7; }
        x.lineTo(px, py);
      }
      const a = 0.25 + rnd() * 0.6;
      x.strokeStyle = `rgba(22,138,255,${a})`;
      x.lineWidth = rnd() > 0.85 ? 3 : 1.6;
      x.stroke();
      x.beginPath();
      x.arc(px, py, 4.5, 0, Math.PI * 2);
      x.fillStyle = `rgba(124,196,255,${a})`;
      x.fill();
    }
    // chips
    for (let i = 0; i < 6; i++) {
      const w = 60 + rnd() * 80;
      const px = rnd() * (s - w);
      const py = rnd() * (s - w);
      x.strokeStyle = "rgba(124,196,255,.45)";
      x.lineWidth = 2;
      x.strokeRect(px, py, w, w);
      for (let p = 6; p < w; p += 12) {
        x.fillStyle = "rgba(124,196,255,.35)";
        x.fillRect(px + p, py - 8, 4, 8);
        x.fillRect(px + p, py + w, 4, 8);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(2, 2);
    return t;
  }, []);
}

function roundRect(x: CanvasRenderingContext2D, px: number, py: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(px + r, py);
  x.arcTo(px + w, py, px + w, py + h, r);
  x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r);
  x.arcTo(px, py, px + w, py, r);
  x.closePath();
}

/* ---------- modelo de smartphone procedural ---------- */

const W = 0.78, H = 1.62, D = 0.085;

function Phone({ frame = "#2a3140", back = "#121722", variant = "lock" as "lock" | "store" }) {
  const screen = useScreenTexture(variant);
  return (
    <group>
      {/* moldura metálica */}
      <RoundedBox args={[W, H, D]} radius={0.11} smoothness={6} castShadow>
        <meshPhysicalMaterial color={frame} metalness={1} roughness={0.22} clearcoat={1} clearcoatRoughness={0.15} />
      </RoundedBox>
      {/* tela */}
      <mesh position={[0, 0, D / 2 + 0.0015]}>
        <planeGeometry args={[W - 0.06, H - 0.06]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      {/* vidro da tela */}
      <mesh position={[0, 0, D / 2 + 0.003]}>
        <planeGeometry args={[W - 0.03, H - 0.03]} />
        <meshPhysicalMaterial transparent opacity={0.12} roughness={0.02} metalness={0} clearcoat={1} color="#ffffff" />
      </mesh>
      {/* traseira em vidro fosco */}
      <mesh position={[0, 0, -D / 2 - 0.0015]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 0.04, H - 0.04]} />
        <meshPhysicalMaterial color={back} roughness={0.35} metalness={0.4} clearcoat={0.6} />
      </mesh>
      {/* módulo de câmera */}
      <group position={[0.17, 0.56, -D / 2 - 0.02]}>
        <RoundedBox args={[0.34, 0.34, 0.04]} radius={0.07} smoothness={4}>
          <meshPhysicalMaterial color={back} metalness={0.6} roughness={0.25} clearcoat={1} />
        </RoundedBox>
        {[
          [-0.075, 0.075],
          [0.075, -0.075],
          [-0.075, -0.075],
        ].map(([lx, ly], i) => (
          <group key={i} position={[lx, ly, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.058, 0.058, 0.03, 40]} />
              <meshStandardMaterial color="#9aa3b2" metalness={1} roughness={0.2} />
            </mesh>
            <mesh position={[0, -0.016, 0]}>
              <cylinderGeometry args={[0.045, 0.045, 0.004, 40]} />
              <meshPhysicalMaterial color="#05070c" metalness={0.2} roughness={0.05} clearcoat={1} />
            </mesh>
          </group>
        ))}
        <mesh position={[0.075, 0.075, -0.022]}>
          <circleGeometry args={[0.022, 24]} />
          <meshBasicMaterial color="#fff6dc" side={THREE.DoubleSide} />
        </mesh>
      </group>
      {/* botões laterais */}
      <mesh position={[W / 2 + 0.006, 0.3, 0]}>
        <boxGeometry args={[0.012, 0.22, 0.03]} />
        <meshStandardMaterial color={frame} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[-W / 2 - 0.006, 0.38, 0]}>
        <boxGeometry args={[0.012, 0.13, 0.03]} />
        <meshStandardMaterial color={frame} metalness={1} roughness={0.25} />
      </mesh>
      <mesh position={[-W / 2 - 0.006, 0.18, 0]}>
        <boxGeometry args={[0.012, 0.13, 0.03]} />
        <meshStandardMaterial color={frame} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  );
}

function HeroRig({ simple }: { simple: boolean }) {
  const main = useRef<THREE.Group>(null);
  const board = useRef<THREE.MeshBasicMaterial>(null);
  const circuit = useCircuitTexture();
  const { pointer, viewport } = useThree();
  const narrow = viewport.width < 3.2;

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    if (main.current) {
      // gira mostrando frente e verso, com leve resposta ao ponteiro
      const targetY = Math.sin(t * 0.35) * 0.75 + (simple ? 0 : pointer.x * 0.35);
      const targetX = -0.08 + (simple ? 0 : -pointer.y * 0.18);
      main.current.rotation.y = THREE.MathUtils.damp(main.current.rotation.y, targetY, 3, dt);
      main.current.rotation.x = THREE.MathUtils.damp(main.current.rotation.x, targetX, 3, dt);
    }
    if (board.current) {
      circuit.offset.y = (t * 0.02) % 1;
      board.current.opacity = 0.5 + Math.sin(t * 1.2) * 0.12;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#050505", 6, 12]} />
      <ambientLight intensity={0.25} />
      <spotLight position={[3, 4, 3]} angle={0.4} penumbra={1} intensity={60} color="#cfe6ff" castShadow={!simple} />
      <pointLight position={[-2.5, 0.5, 1.5]} intensity={18} color="#168AFF" />
      <pointLight position={[2, -1.5, -1.5]} intensity={22} color="#0756C9" />

      <group position={[narrow ? 0 : 0.2, narrow ? 0.05 : 0, 0]} scale={narrow ? 0.95 : 1.12}>
        <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5} floatingRange={[-0.05, 0.08]}>
          <group ref={main} rotation={[-0.08, -0.4, 0.05]}>
            <Phone />
          </group>
        </Float>

        {!simple && (
          <>
            <Float speed={1.1} rotationIntensity={0.25} floatIntensity={0.8}>
              <group position={[-1.02, -0.32, -0.9]} rotation={[0.1, 0.7, 0.12]} scale={0.78}>
                <Phone frame="#c9c2b6" back="#d9d3c7" variant="store" />
              </group>
            </Float>
            <Float speed={1.25} rotationIntensity={0.25} floatIntensity={0.7}>
              <group position={[1.1, 0.18, -1.3]} rotation={[-0.1, -2.5, -0.1]} scale={0.72}>
                <Phone frame="#1d2a3d" back="#0e1a2e" />
              </group>
            </Float>
          </>
        )}
      </group>

      {/* placa de circuito luminosa como piso */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.25, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial ref={board} map={circuit} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <ContactShadows position={[0, -1.24, 0]} opacity={0.65} scale={6} blur={2.6} far={2.5} resolution={simple ? 256 : 512} color="#000" />

      <Environment resolution={simple ? 64 : 256}>
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[0, 4, 3]} scale={[6, 1.2, 1]} />
        <Lightformer form="rect" intensity={6} color="#168AFF" position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[4, 0.5, 1]} />
        <Lightformer form="rect" intensity={4} color="#7CC4FF" position={[4, 1, -1]} rotation-y={-Math.PI / 2} scale={[4, 0.4, 1]} />
        <Lightformer form="ring" intensity={2} color="#0756C9" position={[0, 0, -5]} scale={3} />
      </Environment>
    </>
  );
}

export default function PhoneScene({ simple, onReady }: { simple: boolean; onReady?: () => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  // pausa a renderização quando o hero sai da tela (economia de bateria e GPU)
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={simple ? [1, 1.4] : [1, 1.8]}
        shadows={!simple}
        camera={{ position: [0, 0.15, 4.2], fov: 32 }}
        gl={{ antialias: !simple, powerPreference: "high-performance", alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          requestAnimationFrame(() => onReady?.());
        }}
      >
        <HeroRig simple={simple} />
      </Canvas>
    </div>
  );
}
