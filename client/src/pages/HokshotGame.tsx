import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Crosshair, ShoppingCart, Settings } from "lucide-react";
import * as THREE from "three";

export default function HokshotGame() {
  const [, navigate] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [money, setMoney] = useState(1000);
  const [kills, setKills] = useState(0);
  const [deaths, setDeaths] = useState(0);
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xff0000, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Arena floor
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Arena walls
    const createWall = (x: number, z: number, width: number, depth: number) => {
      const wallGeometry = new THREE.BoxGeometry(width, 5, depth);
      const wallMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a4a });
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      wall.position.set(x, 2.5, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      scene.add(wall);
    };

    createWall(20, 0, 2, 40);
    createWall(-20, 0, 2, 40);
    createWall(0, 20, 40, 2);
    createWall(0, -20, 40, 2);

    // Player spawn points
    const createSpawnPoint = (x: number, z: number) => {
      const spawnGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 32);
      const spawnMaterial = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
      const spawn = new THREE.Mesh(spawnGeometry, spawnMaterial);
      spawn.position.set(x, 0.05, z);
      spawn.receiveShadow = true;
      scene.add(spawn);
    };

    createSpawnPoint(-10, -10);
    createSpawnPoint(10, 10);
    createSpawnPoint(-10, 10);
    createSpawnPoint(10, -10);

    // Obstacles
    for (let i = 0; i < 8; i++) {
      const obstacleGeometry = new THREE.BoxGeometry(2, 3, 2);
      const obstacleMaterial = new THREE.MeshLambertMaterial({ color: 0xff6b6b });
      const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
      obstacle.position.set(
        (Math.random() - 0.5) * 30,
        1.5,
        (Math.random() - 0.5) * 30
      );
      obstacle.castShadow = true;
      obstacle.receiveShadow = true;
      scene.add(obstacle);
    }

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

  const handleShoot = () => {
    setKills(kills + 1);
    setMoney(money + 100);
  };

  const handleDeath = () => {
    setDeaths(deaths + 1);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-slate-900">
      {/* Header */}
      <div className="border-b border-red-700/50 backdrop-blur-xl bg-slate-800/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate("/lobby")}
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              HOKSHOT
            </h1>
            <p className="text-xs text-slate-400">Intense PvP Shooting Action</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowShop(!showShop)}
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Shop
          </Button>
          <Button
            variant="ghost"
            className="text-slate-400 hover:text-white"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Game Container */}
      <div className="flex-1 flex gap-4 p-4">
        {/* 3D Canvas */}
        <div
          ref={containerRef}
          className="flex-1 rounded-lg overflow-hidden border border-red-700/50"
          style={{ minHeight: 0 }}
        />

        {/* UI Panel */}
        <div className="w-80 space-y-4">
          {/* Crosshair */}
          <div className="flex justify-center">
            <Crosshair className="w-12 h-12 text-red-500 animate-pulse" />
          </div>

          {/* Stats */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-red-700/50 p-4">
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">Money</p>
                <p className="text-2xl font-bold text-cyan-400">${money}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Kills</p>
                  <p className="text-2xl font-bold text-green-400">{kills}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Deaths</p>
                  <p className="text-2xl font-bold text-red-400">{deaths}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-red-700/50 p-4 space-y-3">
            <h3 className="text-white font-semibold">Combat</h3>
            <Button
              onClick={handleShoot}
              className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-semibold py-6"
            >
              <Crosshair className="w-4 h-4 mr-2" />
              Shoot (+100 money)
            </Button>
            <Button
              onClick={handleDeath}
              variant="outline"
              className="w-full text-red-400 border-red-700/50 hover:bg-red-900/20"
            >
              Respawn
            </Button>
          </Card>

          {/* Shop */}
          {showShop && (
            <Card className="bg-slate-800/80 backdrop-blur-xl border-red-700/50 p-4 space-y-3">
              <h3 className="text-white font-semibold">Shop</h3>
              <div className="space-y-2">
                <Button
                  disabled
                  className="w-full bg-slate-700/50 text-slate-400 py-4"
                >
                  Assault Rifle ($500)
                </Button>
                <Button
                  disabled
                  className="w-full bg-slate-700/50 text-slate-400 py-4"
                >
                  Shotgun ($750)
                </Button>
                <Button
                  disabled
                  className="w-full bg-slate-700/50 text-slate-400 py-4"
                >
                  Grenade ($300)
                </Button>
                <Button
                  disabled
                  className="w-full bg-slate-700/50 text-slate-400 py-4"
                >
                  Gamepass - LATER ON FOR NEXT UPDATE
                </Button>
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-slate-800/80 backdrop-blur-xl border-red-700/50 p-4">
            <p className="text-xs text-slate-400">
              Eliminate opponents to earn money. Upgrade your weapons and unlock new gamepasses!
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
