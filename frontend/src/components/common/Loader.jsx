
import "../../css/loader.css";

export default function Loader({ text = "Betöltés folyamatban..." }) {
  return (
    <div className="min-h-screen flex flex-col items-center pt-20">
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>

        <div className="flex justify-center -mt-2">
          <span className="text-center font-bold text-base sm:text-2xl bg-gradient-to-r from-sky-600 to-purple-600 bg-clip-text text-transparent">
            {text}
          </span>
        </div>
      </div>
    </div>
  );
}
