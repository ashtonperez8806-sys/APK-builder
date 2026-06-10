import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function GameScreen() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute("/game/:gameId");

  if (!match) {
    return null;
  }

  const gameId = params?.gameId;

  const gameInfo: Record<string, { name: string; color: string }> = {
    plost: { name: "Plost - Tree Cutting Game", color: "from-green-600 to-emerald-600" },
    "miners-tycoon": { name: "Miners Tycoon", color: "from-orange-600 to-yellow-600" },
    hokshot: { name: "HOKSHOT - Shooting Game", color: "from-red-600 to-pink-600" },
  };

  const game = gameInfo[gameId as string] || { name: "Unknown Game", color: "from-slate-600 to-slate-700" };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/lobby")}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-white">{game.name}</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px)]">
        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl p-12 text-center">
          <div className={`h-32 bg-gradient-to-br ${game.color} rounded-lg mb-8 flex items-center justify-center`}>
            <p className="text-white text-4xl font-bold">3D Game</p>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">{game.name}</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            This is a placeholder for the 3D game environment. The full game implementation with Three.js will be added here.
          </p>
          <Button
            onClick={() => navigate("/lobby")}
            className="bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-6 px-8 rounded-lg transition-all duration-300"
          >
            Back to Lobby
          </Button>
        </Card>
      </div>
    </div>
  );
}
