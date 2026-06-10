import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Zap } from "lucide-react";
import * as THREE from "three";

export default function PlostGame() {
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [money, setMoney] = useState(1000);
  const [wood, setWood] = useState(0);

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
    camera.position.set(0, 5, 8);
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
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create trees
    const createTree = (x: number, z: number) => {
      // Trunk
      const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
      const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
      const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
      trunk.position.set(x, 1.5, z);
      trunk.castShadow = true;
      trunk.receiveShadow = true;
      scene.add(trunk);

      // Foliage
      const foliageGeometry = new THREE.ConeGeometry(2, 4, 8);
      const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
      const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
      foliage.position.set(x, 4, z);
      foliage.castShadow = true;
      foliage.receiveShadow = true;
      scene.add(foliage);

      return { trunk, foliage };
    };

    // Add trees to scene
    const trees: Array<{ trunk: THREE.Mesh; foliage: THREE.Mesh }> = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        const x = (i - 2) * 3;
        const z = (j - 2) * 3;
        trees.push(createTree(x, z));
      }
    }

    // Lumber store building
    const buildingGeometry = new THREE.BoxGeometry(4, 3, 4);
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(8, 1.5, 0);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(3, 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0xa0522d });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(8, 4, 0);
    roof.castShadow = true;
    scene.add(roof);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
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

  const handleCutTree = () => {
    setWood(wood + 10);
    setMoney(money + 50);
  };

  const handleSellWood = () => {
    if (wood > 0) {
      setMoney(money + wood * 10);
      setWood(0);
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
          <h1 className="text-2xl font-bold text-white">Plost - Tree Cutting Game</h1>
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
                <p className="text-slate-400 text-sm">Wood</p>
                <p className="text-2xl font-bold text-green-400">{wood} units</p>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Actions</h3>
            <Button
              onClick={handleCutTree}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-6"
            >
              <Zap className="w-4 h-4 mr-2" />
              Cut Tree (+10 wood)
            </Button>
            <Button
              onClick={handleSellWood}
              disabled={wood === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 disabled:opacity-50"
            >
              Sell Wood (+{wood * 10} money)
            </Button>
          </Card>

          {/* Stores */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Stores</h3>
            <Button
              className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-white font-semibold py-4"
              disabled
            >
              Lumber Store (Coming Soon)
            </Button>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4"
              disabled
            >
              Land Store - Jason (Coming Soon)
            </Button>
          </Card>

          {/* Info */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-4">
            <p className="text-xs text-slate-400">
              Cut trees to collect wood. Sell wood for money. Use money to buy land and cars!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
