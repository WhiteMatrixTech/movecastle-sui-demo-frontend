import cn from "classnames";
import CloseSVG from "@/assets/close.svg?react";
import { useRef } from "react";
import { useClickAway } from "react-use";
import { Button } from "..";
import ExclamationMarkSVG from "@/assets/exclamation-mark.svg?react";

interface IInitOrRecruitFailedModalProps {
  className?: string;
  type: "battle" | "recruit";
  onClose: () => void;
  reason?: string;
}
export function InitOrRecruitFailedModal(
  props: IInitOrRecruitFailedModalProps
) {
  const { className, type, reason = "Insufficient Resources", onClose } = props;
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClose);

  return (
    <div
      className={cn(
        className,
        "fixed inset-0 z-20 bg-[rgba(0,0,0,.6)] flex items-center justify-center"
      )}
    >
      <div
        ref={ref}
        className="pt-[56px] pb-[61px] w-[calc(100vw_-_32px)] max-w-[629px] bg-white relative bg-[linear-gradient(180deg,#FFCEBE_0%,#FFF4F1_20.27%,#FFF5F2_20.28%,#FFFFFF_43.17%,#FFFFFF_53.6%)]"
      >
        <CloseSVG
          onClick={onClose}
          className="absolute right-4 top-1 sm:top-4 w-8 sm:w-[54px] aspect-square cursor-pointer"
        />
        <h3 className="text-center text-lg text-[#07253E] font-bold sm:text-2xl">
          {type === "battle" ? "Initiation Failed" : "Recruit Failed"}
        </h3>
        <ExclamationMarkSVG className="mx-auto mt-[52px] mb-4" />
        <p className="text-center mb-[72px] font-medium text-[#4D5D69] text-base sm:text-xl">
          {reason}
        </p>
        <Button
          type="primary"
          className="w-[223px] h-10 sm:h-12 mx-auto"
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
