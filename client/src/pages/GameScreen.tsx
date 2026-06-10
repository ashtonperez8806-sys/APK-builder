import { useLocation, useRoute } from "wouter";
import PlostGame from "./PlostGame";
import MinersTycoonGame from "./MinersTycoonGame";
import HokshotGame from "./HokshotGame";

export default function GameScreen() {
  const [match, params] = useRoute("/game/:gameId");

  if (!match) {
    return null;
  }

  const gameId = params?.gameId;

  switch (gameId) {
    case "plost":
      return <PlostGame />;
    case "miners-tycoon":
      return <MinersTycoonGame />;
    case "hokshot":
      return <HokshotGame />;
    default:
      return null;
  }
}
