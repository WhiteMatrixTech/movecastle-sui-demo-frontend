import cn from "classnames";
import CloseSVG from "@/assets/close.svg?react";
import { useRef } from "react";
import { useClickAway } from "react-use";
import { Button } from "..";

interface IRecruitModalProps {
  className?: string;
  onClose: () => void;
}
export function RecruitModal(props: IRecruitModalProps) {
  const { className, onClose } = props;
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
        className="px-4 sm:px-[90px] w-[calc(100vw_-_32px)] max-w-[629px] bg-[linear-gradient(180deg,#EAF4FC_0%,#F8FCFF_20.28%,#F9FCFF_43.17%)] relative py-12"
      >
        <CloseSVG
          onClick={onClose}
          className="absolute right-4 top-1 sm:top-4 w-8 sm:w-[54px] aspect-square cursor-pointer"
        />
        <h2 className="text-center text-lg sm:text-2xl text-[#07253E] font-bold">
          Recruitment Treasury
        </h2>
        <div className="text-sm mt-8 mb-4">
          <span className="text-[#686B6F]">Treasury Balance:</span>
          <span className="text-[#07253E] font-medium">10000</span>
        </div>
        <input
          placeholder="Enter your pay amount"
          className="w-full p-4 bg-[#ECF1F4] placeholder:text-[#9DA1A4] text-sm outline-none"
        />
        <div className="mt-2 mb-[30px] text-xs text-[#A0B5C4]">
          Please enter a value between 1 and xxx.
        </div>
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
