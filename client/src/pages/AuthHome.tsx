import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663738678831/PtDWKfJ9M5i3yQrYAF8bRN/copo-logo-An4obHqncRRgWC6H5BnWXz.webp";

export default function AuthHome() {
  const [, navigate] = useLocation();
  const createGuestMutation = trpc.auth.createGuest.useMutation();

  const handlePlayAsGuest = async () => {
    try {
      const result = await createGuestMutation.mutateAsync();
      if (result.success) {
        sessionStorage.setItem("guestId", result.guestId);
        navigate("/lobby");
      }
    } catch (error) {
      toast.error("Failed to create guest session");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-12">
          <img
            src={LOGO_URL}
            alt="Copo Logo"
            className="w-48 h-48 object-contain drop-shadow-2xl"
          />
        </div>

        <Card className="bg-slate-800/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
          <div className="p-8 space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                Copo
              </h1>
              <p className="text-slate-400 text-sm">Enter the Gaming Universe</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Log In
              </Button>

              <Button
                onClick={() => navigate("/register")}
                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Create Account
              </Button>

              <Button
                onClick={handlePlayAsGuest}
                disabled={createGuestMutation.isPending}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-6 rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {createGuestMutation.isPending ? "Creating Session..." : "Play as Guest"}
              </Button>
            </div>

            <p className="text-center text-xs text-slate-500 pt-4 border-t border-slate-700/50">
              Experience epic gaming on PC, Mobile, and Console
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
