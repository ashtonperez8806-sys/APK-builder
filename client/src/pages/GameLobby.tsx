import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, Gamepad2, Trees, Pickaxe, Crosshair, Home } from "lucide-react";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663738678831/PtDWKfJ9M5i3yQrYAF8bRN/copo-logo-An4obHqncRRgWC6H5BnWXz.webp";

interface GameCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const games: GameCard[] = [
  {
    id: "plost",
    name: "Plost",
    description: "Cut trees, build your empire, and become a lumber tycoon",
    icon: <Trees className="w-8 h-8" />,
    color: "from-green-600 to-emerald-600",
    gradient: "hover:from-green-700 hover:to-emerald-700",
  },
  {
    id: "miners-tycoon",
    name: "Miners Tycoon",
    description: "Mine ore, build drills, and dominate the mining industry",
    icon: <Pickaxe className="w-8 h-8" />,
    color: "from-orange-600 to-yellow-600",
    gradient: "hover:from-orange-700 hover:to-yellow-700",
  },
  {
    id: "hokshot",
    name: "HOKSHOT",
    description: "Intense PvP shooting action with guns and explosives",
    icon: <Crosshair className="w-8 h-8" />,
    color: "from-red-600 to-pink-600",
    gradient: "hover:from-red-700 hover:to-pink-700",
  },
];

export default function GameLobby() {
  const [, navigate] = useLocation();
  const username = sessionStorage.getItem("username") || "Player";
  const isGuest = sessionStorage.getItem("guestId") !== null;

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const handleGameLaunch = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 backdrop-blur-xl bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={LOGO_URL} alt="Copo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-bold text-white">Copo Gaming Hub</h1>
              <p className="text-sm text-slate-400">
                Welcome, <span className="text-cyan-400 font-semibold">{username}</span>
                {isGuest && <span className="text-xs text-slate-500 ml-2">(Guest)</span>}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">Available Games</h2>
          <p className="text-slate-400">Choose a game and start playing</p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card
              key={game.id}
              className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleGameLaunch(game.id)}
            >
              <div className={`h-32 bg-gradient-to-br ${game.color} flex items-center justify-center group-hover:${game.gradient} transition-all duration-300`}>
                <div className="text-white/80 group-hover:text-white transition-colors">
                  {game.icon}
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{game.name}</h3>
                  <p className="text-slate-400 text-sm">{game.description}</p>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGameLaunch(game.id);
                  }}
                  className={`w-full bg-gradient-to-r ${game.color} text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95`}
                >
                  <Gamepad2 className="w-4 h-4 mr-2" />
                  Play Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Playtime</p>
            <p className="text-3xl font-bold text-white">0h 0m</p>
          </Card>
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm mb-2">Total Earnings</p>
            <p className="text-3xl font-bold text-cyan-400">$0</p>
          </Card>
          <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 p-6">
            <p className="text-slate-400 text-sm mb-2">Games Played</p>
            <p className="text-3xl font-bold text-white">0</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
