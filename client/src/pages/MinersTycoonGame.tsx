import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap, Pickaxe } from "lucide-react";
import * as THREE from "three";

export default function MinersTycoonGame() {
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [money, setMoney] = useState(1000);
  const [ore, setOre] = useState(0);
  const [drills, setDrills] = useState(1);
  const [rebirths, setRebirths] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(30, 30);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a4a4a });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Baseplate
    const baseplateGeometry = new THREE.BoxGeometry(10, 0.5, 10);
    const baseplateMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
    const baseplate = new THREE.Mesh(baseplateGeometry, baseplateMaterial);
    baseplate.position.y = 0.25;
    baseplate.castShadow = true;
    baseplate.receiveShadow = true;
    scene.add(baseplate);

    // Create drills
    const createDrill = (x: number, z: number) => {
      const drillGeometry = new THREE.CylinderGeometry(0.5, 0.6, 2, 8);
      const drillMaterial = new THREE.MeshLambertMaterial({ color: 0xff8c00 });
      const drill = new THREE.Mesh(drillGeometry, drillMaterial);
      drill.position.set(x, 1.5, z);
      drill.castShadow = true;
      drill.receiveShadow = true;
      scene.add(drill);

      // Drill head
      const headGeometry = new THREE.ConeGeometry(0.4, 0.8, 8);
      const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffa500 });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.set(x, 2.8, z);
      head.castShadow = true;
      scene.add(head);

      return drill;
    };

    // Add drills
    const drillMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const x = (i - 1) * 2;
        const z = (j - 1) * 2;
        drillMeshes.push(createDrill(x, z));
      }
    }

    // Mining pit
    const pitGeometry = new THREE.CylinderGeometry(8, 10, 4, 32);
    const pitMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
    const pit = new THREE.Mesh(pitGeometry, pitMaterial);
    pit.position.set(0, -2, 0);
    pit.receiveShadow = true;
    scene.add(pit);

    // Ore deposits
    for (let i = 0; i < 20; i++) {
      const oreGeometry = new THREE.OctahedronGeometry(0.3);
      const oreMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
      const ore = new THREE.Mesh(oreGeometry, oreMaterial);
      ore.position.set(
        (Math.random() - 0.5) * 12,
        Math.random() * -3 - 1,
        (Math.random() - 0.5) * 12
      );
      ore.castShadow = true;
      ore.receiveShadow = true;
      scene.add(ore);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate drills
      drillMeshes.forEach((drill) => {
        drill.rotation.z += 0.02;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleMine = () => {
    const oreGained = drills * 5;
    setOre(ore + oreGained);
    setMoney(money + oreGained * 10);
  };

  const handleBuyDrill = () => {
    if (money >= 500) {
      setMoney(money - 500);
      setDrills(drills + 1);
    }
  };

  const handleRebirth = () => {
    if (money >= 5000) {
      setMoney(1000);
      setOre(0);
      setRebirths(rebirths + 1);
      setDrills(Math.floor(drills * 1.5));
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-800/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/lobby")}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">Miners Tycoon</h1>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 flex gap-4 p-4">
        {/* 3D Canvas */}
        <div
          ref={containerRef}
          className="flex-1 rounded-lg overflow-hidden border border-slate-700/50"
          style={{ minHeight: 0 }}
        />

        {/* UI Panel */}
        <div className="w-80 space-y-4">
          {/* Stats */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Money</p>
                <p className="text-2xl font-bold text-cyan-400">${money}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Ore Mined</p>
                <p className="text-2xl font-bold text-yellow-400">{ore} units</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Drills</p>
                <p className="text-2xl font-bold text-orange-400">{drills}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm">Rebirths</p>
                <p className="text-2xl font-bold text-purple-400">{rebirths}</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Mining</h3>
            <Button
              onClick={handleMine}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold py-6"
            >
              <Pickaxe className="w-4 h-4 mr-2" />
              Mine Ore (+{drills * 5})
            </Button>
          </Card>

          {/* Shop */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Shop</h3>
            <Button
              onClick={handleBuyDrill}
              disabled={money < 500}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 disabled:opacity-50"
            >
              Buy Drill ($500)
            </Button>
          </Card>

          {/* Rebirth */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Progression</h3>
            <Button
              onClick={handleRebirth}
              disabled={money < 5000}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 disabled:opacity-50"
            >
              Rebirth ($5000)
            </Button>
            <p className="text-xs text-slate-400">
              Rebirth to expand your base and get 1.5x drills!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
