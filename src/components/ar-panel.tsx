import { useEffect, useRef, useState } from "react";
import { Camera, Footprints, Pause } from "lucide-react";
import * as THREE from "three";
import { AGENTS } from "@/lib/catalog";
import { useGuide } from "@/lib/store";
import { Button } from "@/components/ui/button";

function keyFrame(ctx: CanvasRenderingContext2D, video: HTMLVideoElement, w: number, h: number) {
  if (video.readyState < 2) return;
  ctx.drawImage(video, 0, 0, w, h);
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const dist = Math.hypot(r - 200, g - 26, b - 96);
    if (g < 70 && dist < 110) {
      d[i + 3] = 0;
    } else if (g < 95 && dist < 150) {
      d[i + 3] = Math.max(0, Math.min(255, ((dist - 110) / 40) * 255));
    }
  }
  ctx.putImageData(img, 0, 0);
}

export function ArPanel() {
  const agentId = useGuide((s) => s.agentId)!;
  const agent = AGENTS[agentId];
  const hostRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLVideoElement>(null);
  const walkingRef = useRef(true);
  const [walking, setWalking] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [hint, setHint] = useState("Dotknij ziemi, żeby przestawić beboka.");
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    walkingRef.current = walking;
  }, [walking]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
    camera.position.set(0, 1.15, 4.2);
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 28),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.32 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01;
    scene.add(shadow);

    const video = document.createElement("video");
    video.src = `/beboki/ar/${agentId}.mp4`;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = "anonymous";
    void video.play().catch(() => undefined);

    const cnv = document.createElement("canvas");
    cnv.width = 320;
    cnv.height = 480;
    const ctx = cnv.getContext("2d", { willReadFrequently: true })!;
    const tex = new THREE.CanvasTexture(cnv);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;

    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 1.08), mat);
    mesh.position.set(0, 0.54, 0);
    scene.add(mesh);

    let last = performance.now();
    let phase = 0;
    let raf = 0;
    let alive = true;
    const target = new THREE.Vector3(0, 0, 0);

    const fit = () => {
      const w = host.clientWidth || 1;
      const h = host.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(host);

    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const hit = new THREE.Vector3();

    const onTap = (ev: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      if (ray.ray.intersectPlane(ground, hit)) {
        target.set(
          THREE.MathUtils.clamp(hit.x, -1.1, 1.1),
          0,
          THREE.MathUtils.clamp(hit.z, -1.2, 0.5),
        );
        walkingRef.current = false;
      }
    };
    host.addEventListener("pointerdown", onTap);

    const loop = () => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      const now = performance.now();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      if (walkingRef.current) {
        phase += dt * 0.9;
        target.x = Math.sin(phase) * 0.7;
        target.z = Math.cos(phase) * 0.22;
        mesh.scale.x = Math.cos(phase) >= 0 ? 1 : -1;
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
      mesh.position.x += (target.x - mesh.position.x) * Math.min(1, dt * 5);
      mesh.position.z += (target.z - mesh.position.z) * Math.min(1, dt * 5);
      const bob = walkingRef.current
        ? Math.abs(Math.sin(phase * 5)) * 0.03
        : Math.sin(now / 500) * 0.012;
      mesh.position.y = 0.54 + bob;
      shadow.position.x = mesh.position.x;
      shadow.position.z = mesh.position.z;
      keyFrame(ctx, video, cnv.width, cnv.height);
      tex.needsUpdate = true;
      renderer.render(scene, camera);
    };
    loop();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointerdown", onTap);
      video.pause();
      video.src = "";
      tex.dispose();
      mesh.geometry.dispose();
      mat.dispose();
      shadow.geometry.dispose();
      (shadow.material as THREE.Material).dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [agentId]);

  async function enableCam() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      if (camRef.current) {
        camRef.current.srcObject = stream;
        await camRef.current.play();
      }
      setCamOn(true);
      setHint("Kamera włączona. Bebok chodzi po Twoim świecie.");
    } catch {
      setHint("Brak zgody na kamerę — zostaje demo ulicy.");
    }
  }

  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  return (
    <div className="relative min-h-0 flex-1 overflow-hidden bg-bg">
      <img
        src="/beboki/ar/street.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        hidden={camOn}
      />
      <video
        ref={camRef}
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        muted
        hidden={!camOn}
      />
      <div ref={hostRef} className="absolute inset-0" />
      <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center px-3">
        <p className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-foreground">
          {agent.name} w AR · {hint}
        </p>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-wrap gap-2 bg-gradient-to-t from-bg to-transparent p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Button variant={camOn ? "default" : "secondary"} onClick={() => void enableCam()}>
          <Camera className="size-4" />
          Kamera
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            const next = !walkingRef.current;
            walkingRef.current = next;
            setWalking(next);
          }}
        >
          {walking ? <Pause className="size-4" /> : <Footprints className="size-4" />}
          {walking ? "Stój" : "Biegaj"}
        </Button>
      </div>
    </div>
  );
}
