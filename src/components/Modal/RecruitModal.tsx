import cn from "classnames";
import CloseSVG from "@/assets/close.svg?react";
import RefreshSVG from "@/assets/refresh.svg?react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useClickAway } from "react-use";
import { Button } from "..";
import { toast } from "react-toastify";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  CLOCK_OBJ_ID,
  GAME_STORE_OBJECT_ID,
  PACKAGE_OBJECT_ID,
} from "@/utils/const";
import { suiClient } from "@/utils/suiClient";
import { useWallet } from "@suiet/wallet-kit";
import tipImg from "@/assets/recruit_tip.png";
import { get } from "lodash";

interface IRecruitModalProps {
  className?: string;
  onClose: () => void;
  limit?: number;
  id: string;
  onRefresh: () => void;
}
export function RecruitModal(props: IRecruitModalProps) {
  const [value, setValue] = useState("");
  const { className, onClose, onRefresh, limit, id } = props;
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
          txb.pure(CLOCK_OBJ_ID),
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
        console.error(e);
        toast.error(
          <p className="line-clamp-5">Failed to recruit soldiers!</p>
        );
      }
      setRecruiting(false);
    } else {
      toast.error("Please input a valid number");
    }
  }, [id, onClose, onRefresh, signAndExecuteTransactionBlock, value]);

  const [displayTreasuryBalance, setDisplayTreasuryBalance] =
    useState<number>();

  useEffect(() => {}, []);
  const [isRefreshed, setRefreshed] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const txb = new TransactionBlock();
      const args = [
        txb.pure(id),
        txb.pure(CLOCK_OBJ_ID),
        txb.pure(GAME_STORE_OBJECT_ID),
      ];
      txb.moveCall({
        target: `${PACKAGE_OBJECT_ID}::castle::settle_castle_economy`,
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
      const dynamicFieldsObj = await suiClient.getDynamicFieldObject({
        parentId: GAME_STORE_OBJECT_ID,
        name: {
          type: "0x2::object::ID",
          value: id,
        },
      });
      const treasury = get(
        dynamicFieldsObj.data,
        "content.fields.value.fields.economy.fields.treasury"
      );
      setDisplayTreasuryBalance(Number(treasury));
      onRefresh();
      setRefreshed(true);
    } catch (e) {
      console.error(e);
    }
    setRefreshing(false);
  }, [id, onRefresh, signAndExecuteTransactionBlock]);

  const buttonDisabled = useMemo(
    () => isRecruiting || !isRefreshed,
    [isRecruiting, isRefreshed]
  );

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
        <h2 className="text-center text-lg mb-10 sm:text-2xl text-[#07253E] font-bold">
          Recruitment Treasury
        </h2>
        <div className="text-sm mt-8 mb-4 flex items-center">
          <span className="text-[#686B6F]">Treasury Balance:</span>
          <span className="text-[#07253E] font-medium">
            {" "}
            &nbsp;
            {displayTreasuryBalance || "--"}
          </span>
          <div className="relative">
            <RefreshSVG
              onClick={handleRefresh}
              className={cn(
                "w-6 h-6 ml-2 cursor-pointer",
                isRefreshing && "animate-spin"
              )}
            />
            {!isRefreshed && (
              <img
                src={tipImg}
                alt="tip"
                className="min-w-[180px] sm:min-w-[218px] absolute right-6 sm:right-2 translate-x-full -top-7"
              />
            )}
          </div>
        </div>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder="Enter your pay amount"
          className="w-full p-4 bg-[#ECF1F4] placeholder:text-[#9DA1A4] text-sm outline-none"
        />
        {displayTreasuryBalance !== undefined ? (
          <div className="mt-2 text-xs text-[#A0B5C4] capitalize">
            please enter a value between 1 and {limit}. one soldier costs 100
            treasuries.
          </div>
        ) : (
          <></>
        )}
        <Button
          type="primary"
          disable={buttonDisabled}
          className={cn(
            "w-[223px] h-10 sm:h-12 mx-auto mt-[30px]",
            buttonDisabled && "!opacity-50 !cursor-not-allowed"
          )}
          loading={isRecruiting}
          onClick={handleRecruit}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}
