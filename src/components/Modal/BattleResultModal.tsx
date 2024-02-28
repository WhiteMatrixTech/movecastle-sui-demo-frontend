import cn from "classnames";
import defaultImg from "@/assets/defeat.png";
import victorImg from "@/assets/victory.png";
import CloseSVG from "@/assets/close.svg?react";
import { ReactNode, useRef } from "react";
import { useClickAway } from "react-use";
import { Button } from "..";
import { Link } from "react-router-dom";

interface IBattleResultModalProps {
  className?: string;
  type: "victory" | "defeat";
  onClose: () => void;
}
export function BattleResultModal(props: IBattleResultModalProps) {
  const { className, type, onClose } = props;
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClose);

  const mockData: Record<string, ReactNode> = {
    "Battle Outcome": type === "defeat" ? "Defeat" : "Victory",
    "Opponent's Castle": (
      <Link
        to="/castles/2"
        className="underline cursor-pointer text-[#55B2FB] z-30"
        onClick={() => {
          onClose();
        }}
      >
        Name
      </Link>
    ),
    "Soldier Losses": 1000,
    "Battle Reparation": type === "defeat" ? "-10" : "+10",
  };
  return (
    <div
      className={cn(
        className,
        "fixed inset-0 z-20 bg-[rgba(0,0,0,.6)] flex items-center justify-center"
      )}
    >
      <div
        ref={ref}
        className="w-[calc(100vw_-_32px)] max-w-[629px] bg-white relative bg-[url('/paperpieces.png')] bg-contain bg-no-repeat"
      >
        <CloseSVG
          onClick={onClose}
          className="absolute right-4 top-1 sm:top-4 w-8 sm:w-[54px] aspect-square cursor-pointer"
        />
        <img
          src={type === "defeat" ? defaultImg : victorImg}
          className={cn("mx-auto h-[30px] sm:h-[44px] my-10")}
        />
        <ul className="w-[calc(100%_-_32px)] max-w-[389px] mx-auto z-30">
          {Object.keys(mockData).map((key, index) => {
            const element = mockData[key];
            const isLast = index === Object.keys(mockData).length - 1;
            return (
              <li
                key={key}
                className={cn(
                  "flex p-[11px] items-center flex-wrap justify-between",
                  !isLast && "border-b-[1px] border-solid border-b-[#d4dce5]"
                )}
              >
                <span className="text-[#686B6F] text-sm">{key}</span>
                <div className="text-sm text-[#07253E]">{element}</div>
              </li>
            );
          })}
        </ul>
        <Button
          type="primary"
          className="w-[223px] h-10 sm:h-12 mx-auto mt-[33px] mb-[54px]"
          onClick={() => {
            onClose();
          }}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
