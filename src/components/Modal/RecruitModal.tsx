import cn from "classnames";
import CloseSVG from "@/assets/close.svg?react";
import { useCallback, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button } from "..";
import { toast } from "react-toastify";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { GAME_STORE_OBJECT_ID, PACKAGE_OBJECT_ID } from "@/utils/const";
import { suiClient } from "@/utils/suiClient";
import { useWallet } from "@suiet/wallet-kit";

interface IRecruitModalProps {
  className?: string;
  onClose: () => void;
  treasuryBalance?: number;
  limit?: number;
  id: string;
  onRefresh: () => void;
}
export function RecruitModal(props: IRecruitModalProps) {
  const [value, setValue] = useState("");
  const { className, onClose, onRefresh, treasuryBalance, limit, id } = props;
  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, onClose);

  const { signAndExecuteTransactionBlock } = useWallet();
  const [isRecruiting, setRecruiting] = useState(false);
  const handleRecruit = useCallback(async () => {
    if (value && !Number.isNaN(Number(value))) {
      setRecruiting(true);
      try {
        const txb = new TransactionBlock();
        const args = [
          txb.pure(id),
          txb.pure(value),
          txb.pure("0x6"),
          txb.pure(GAME_STORE_OBJECT_ID),
        ];
        txb.moveCall({
          target: `${PACKAGE_OBJECT_ID}::castle::recruit_soldiers`,
          arguments: args,
        });
        const exeRes = await signAndExecuteTransactionBlock({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          transactionBlock: txb as any,
        });
        await suiClient.waitForTransactionBlock({
          digest: exeRes.digest,
          options: { showObjectChanges: true },
        });
        onRefresh();
        onClose();
      } catch (e) {
        toast.error("Failed to recruit soldiers");
        console.error(e);
      }
      setRecruiting(false);
    } else {
      toast.error("Please input a valid number");
    }
  }, [id, onClose, onRefresh, signAndExecuteTransactionBlock, value]);

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
          <span className="text-[#07253E] font-medium"> {treasuryBalance}</span>
        </div>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Enter your pay amount"
          className="w-full p-4 bg-[#ECF1F4] placeholder:text-[#9DA1A4] text-sm outline-none"
        />
        <div className="mt-2 mb-[30px] text-xs text-[#A0B5C4]">
          Please enter a value between 1 and {limit}.
        </div>
        <Button
          type="primary"
          className="w-[223px] h-10 sm:h-12 mx-auto"
          loading={isRecruiting}
          onClick={handleRecruit}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
