import "./title.css";
import { phases } from "../../const";
import { PawPrint } from "lucide-react";
export function Title({state}) {
  // title component of the game
  return (
    <>
      {state != phases.JoinGame}<h1 className="GameTitle" style={{
        marginBottom: state == phases.JoinGame ? 'auto' : '',
      }}>
        Odd-Ball Animal
        <PawPrint size={30} color="white" />
      </h1>
      {state == phases.JoinGame && <div className="GameSubtitle">
        A party game where everyone must vote out an odd-ball player
      </div>}
    </>
  );
}
