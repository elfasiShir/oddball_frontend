import "./title.css";
import { PawPrint } from "lucide-react";
export function Title() {
  // title component of the game
  return (
    <>
      <h1 className="GameTitle">
        Odd-Ball Animal
        <PawPrint size={30} color="white" />
      </h1>
    </>
  );
}
