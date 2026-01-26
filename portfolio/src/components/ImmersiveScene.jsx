import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useLanguage } from '../context/LanguageContext';

export default function ImmersiveScene() {
  const { t } = useLanguage();
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const captureRef = useRef(null);
  const motionRef = useRef(0);
  const [motionIntensity, setMotionIntensity] = useState(0);
  const [visionEnabled, setVisionEnabled] = useState(false);
  const [visionStatus, setVisionStatus] = useState('idle');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    motionRef.current = motionIntensity;
  }, [motionIntensity]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const update = () => setIsDesktop(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xfdf2f8, 10, 40);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    const pointLight = new THREE.PointLight(0xec4899, 1.2, 100);
    pointLight.position.set(4, 6, 8);
    scene.add(ambient, pointLight);

    const group = new THREE.Group();
    scene.add(group);

    const coreGeometry = new THREE.IcosahedronGeometry(2.6, 1);
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      metalness: 0.2,
      roughness: 0.35,
      emissive: 0xec4899,
      emissiveIntensity: 0.35,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    group.add(core);

    const ringGeometry = new THREE.TorusGeometry(4.2, 0.05, 16, 120);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbcfe8,
      emissive: 0xf9a8d4,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2.5;
    group.add(ring);

    const haloGeometry = new THREE.TorusKnotGeometry(1.8, 0.2, 120, 12);
    const haloMaterial = new THREE.MeshStandardMaterial({
      color: 0xf9a8d4,
      emissive: 0xec4899,
      emissiveIntensity: 0.2,
    });
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.set(-3, -1.5, -2);
    group.add(halo);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 350;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      starPositions[i3] = (Math.random() - 0.5) * 50;
      starPositions[i3 + 1] = (Math.random() - 0.5) * 40;
      starPositions[i3 + 2] = (Math.random() - 0.5) * 40;
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xfbcfe8,
      size: 0.15,
      transparent: true,
      opacity: 0.75,
    });
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    gsap.fromTo(
      camera.position,
      { z: 22 },
      { z: 14, duration: 2.6, ease: 'power3.out' },
    );
    gsap.to(ring.rotation, {
      y: Math.PI * 2,
      duration: 18,
      repeat: -1,
      ease: 'none',
    });
    gsap.to(halo.position, {
      y: 1.4,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    let animationFrame;
    const animate = () => {
      const intensity = motionRef.current;
      core.rotation.y += 0.003;
      core.rotation.x += 0.002;
      ring.rotation.z += 0.001 + intensity * 0.004;
      halo.rotation.y -= 0.002;
      group.position.y = Math.sin(Date.now() * 0.0006) * (0.5 + intensity);
      pointLight.intensity = 1.1 + intensity * 1.5;
      coreMaterial.emissiveIntensity = 0.35 + intensity * 0.8;
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      haloGeometry.dispose();
      haloMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!visionEnabled || !isDesktop) return undefined;
    let rafId;
    let stream;
    let prevFrame;
    const width = 160;
    const height = 120;
    const video = videoRef.current;
    const canvas = captureRef.current;

    if (!video || !canvas) return undefined;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = width;
    canvas.height = height;

    const stopStream = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (rafId) cancelAnimationFrame(rafId);
    };

    navigator.mediaDevices
      .getUserMedia({ video: { width, height } })
      .then((mediaStream) => {
        stream = mediaStream;
        video.srcObject = mediaStream;
        return video.play();
      })
      .then(() => {
        setVisionStatus('active');
        const tick = () => {
          ctx.drawImage(video, 0, 0, width, height);
          const frame = ctx.getImageData(0, 0, width, height).data;
          if (prevFrame) {
            let diff = 0;
            let samples = 0;
            for (let i = 0; i < frame.length; i += 16) {
              diff += Math.abs(frame[i] - prevFrame[i]);
              samples += 1;
            }
            const normalized = samples ? diff / (samples * 255) : 0;
            setMotionIntensity(Math.min(1, normalized * 2.2));
          }
          prevFrame = new Uint8ClampedArray(frame);
          rafId = requestAnimationFrame(tick);
        };
        tick();
      })
      .catch(() => {
        setVisionStatus('denied');
      });

    return () => {
      stopStream();
    };
  }, [visionEnabled, isDesktop]);

  const visionCopy = () => {
    if (!isDesktop) return t.visionUnavailable;
    if (visionStatus === 'denied') return t.visionDenied;
    if (visionStatus === 'active') return t.visionActive;
    return t.visionHint;
  };

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={containerRef} className="absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white/70 via-white/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-white/80 via-white/30 to-transparent pointer-events-none" />

      <div className="absolute top-24 right-6 sm:right-10 z-20 pointer-events-auto max-w-xs">
        <div className="backdrop-blur-md bg-white/70 border border-pink-100 rounded-2xl px-4 py-4 shadow-lg">
          <p className="text-xs uppercase tracking-[0.2em] text-pink-400 font-semibold">
            {t.immersiveKicker}
          </p>
          <h3 className="text-lg font-bold text-pink-600 mt-1">
            {t.immersiveTitle}
          </h3>
          <p className="text-xs text-gray-600 mt-2">
            {t.immersiveDescription}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
              Three.js
            </span>
            <span className="text-[11px] font-medium bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
              GSAP
            </span>
            <span className="text-[11px] font-medium bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
              Vision
            </span>
          </div>
          <div className="mt-4 border-t border-pink-100 pt-3">
            <p className="text-xs text-gray-600">{visionCopy()}</p>
            <button
              type="button"
              onClick={() => {
                setVisionEnabled(true);
                setVisionStatus('pending');
              }}
              disabled={!isDesktop || visionStatus === 'active'}
              className="mt-2 w-full text-xs font-semibold bg-pink-500 text-white py-2 rounded-full disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
            >
              {visionStatus === 'active' ? t.visionActiveLabel : t.visionEnable}
            </button>
          </div>
        </div>
      </div>

      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={captureRef} className="hidden" />
    </div>
  );
}
