import { ReactNode } from "react";
import cn from "classnames";
import RadialBattleSVG from "@/assets/radial-battle.svg?react";
import RadialRecruitSVG from "@/assets/radial-recruit.svg?react";

interface IActionButtonLayoutProps {
  type: "engage" | "enlist";
  children: ReactNode;
  className?: string;
}

export function ActionButtonLayout(props: IActionButtonLayoutProps) {
  const { type, children, className } = props;
  return (
    <div
      className={cn(
        "w-full overflow-hidden bg-white px-[4.18%] py-3 sm:py-5 relative flex flex-wrap sm:flex-nowrap gap-4 items-center justify-between",
        className
      )}
    >
      {type === "engage" ? (
        <RadialBattleSVG className="absolute inset-0" />
      ) : (
        <RadialRecruitSVG className="absolute inset-0" />
      )}
      <div className="z-10">
        <h3 className="font-bold text-[#2170C3] my-1">
          {type === "engage" ? "Engage in Conflicts" : "Enlist Reinforcements"}
        </h3>
        <p className="text-[#686B6F] text-sm">
          {type === "engage"
            ? "Initiate a battle between castles."
            : "Increase your castle's military power and get extra-economic power by recruiting soldiers."}
        </p>
      </div>
      {children}
    </div>
  );
}
