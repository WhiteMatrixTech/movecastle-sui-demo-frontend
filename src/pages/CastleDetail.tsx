import { useParams } from "react-router-dom";
import castleDefaultImg from "@/assets/castle-default.png";
import { ReactNode, useCallback, useState } from "react";
import cn from "classnames";
import {
  BattleResultModal,
  Button,
  InitOrRecruitFailedModal,
  RecruitModal,
} from "@/components";
import { mockPromise } from "@/utils/common";

import RadialBattleSVG from "@/assets/radial-battle.svg?react";
import RadialRecruitSVG from "@/assets/radial-recruit.svg?react";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";

interface IBattleResult {
  isSuccess: boolean;
}

export function CastleDetailPage() {
  const { id } = useParams();
  const { account } = useWallet();

  const [failedModalType, setFailedModalType] = useState<
    "battle" | "recruit"
  >();

  const [battleResult, setBattleResult] = useState<IBattleResult>();
  const [isBattling, setBattling] = useState(false);
  const handleBattle = useCallback(async () => {
    if (!account?.address) {
      toast.error("Please sign in!");
      return;
    }
    setBattling(true);
    try {
      await mockPromise(3000);
      setBattleResult({ isSuccess: true });
    } catch (e) {
      console.error(e);
      setFailedModalType("battle");
    }
    setBattling(false);
  }, [account?.address]);

  const [showRecruitModal, setShowRecruitModal] = useState(false);

  return (
    <div className="mx-auto w-[calc(100vw_-_32px)] max-w-[862px] py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
        <div className="bg-[#f8f9fb] w-full p-6 flex flex-col justify-between">
          <img
            src={castleDefaultImg}
            alt="castle default img"
            className="w-[49%] mx-auto"
          />
          <h2 className="mb-4 mt-12 text-[#07253E] font-bold text-lg">
            Castle {id}
          </h2>
          <p className="text-[#4D5D69] text-sm sm:text-[17px] break-all sm:leading-[30px] mb-1">
            0x04aca8bad5343259cf5ebb944f440946bf8d8dd203d4c541b4032adf9e2ec147
          </p>
        </div>
        <AttrCard
          title="Basic Attributes"
          data={{
            Name: "Project 09865428",
            "Serial Number": "989897979797979",
            Size: 100,
            Race: "Random",
            Experience: "Random",
            Level: "High",
            Description:
              "Situated majestically atop the rolling hills of the Sui blockchain, the Castle of Ethereal Fortitude stands as a beacon of digital craftsmanship. ",
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AttrCard
          title="Economic Attributes"
          data={{
            Treasury: 10000,
            "Base Economic Power": 1000,
            "Bonus From Soldiers": "10%",
            "Battle Reparations": "TODO",
            "Total Economic Power": 1000,
          }}
        />
        <AttrCard
          title="Military Attributes"
          data={{
            "Base Attack Power": 1000,
            Soldiers: 30,
            "Total Attack Power": 100,
            "Battle Cooldown": "Until 5 Minutes Later",
          }}
        />
      </div>
      <div className="w-full overflow-hidden bg-white my-4 px-[4.18%] py-3 sm:py-5 relative flex flex-wrap gap-4 items-center justify-between">
        <RadialBattleSVG className="absolute inset-0" />
        <div className="z-10">
          <h3 className="font-bold text-[#2170C3] my-1">Engage in Conflicts</h3>
          <p className="text-[#686B6F] text-sm">
            Initiate a battle between castles.
          </p>
        </div>
        <Button
          type="primary"
          className="w-full sm:w-[223px] h-12 z-10"
          onClick={handleBattle}
          loading={isBattling}
        >
          Start Battle
        </Button>
      </div>
      <div className="w-full overflow-hidden bg-white px-[4.18%] py-3 sm:py-5 relative flex flex-wrap sm:flex-nowrap gap-4 items-center justify-between">
        <RadialRecruitSVG className="absolute inset-0" />
        <div className="z-10">
          <h3 className="font-bold text-[#2170C3] my-1">
            Enlist Reinforcements
          </h3>
          <p className="text-[#686B6F] text-sm">
            Increase your castle's military power and get extra-economic power
            by recruiting soldiers.
          </p>
        </div>
        <Button
          type="primary"
          className="w-full sm:w-[223px] h-12 z-10 shrink-0"
          disable={isBattling}
          onClick={() => {
            if (!account?.address) {
              toast.error("Please sign in!");
              return;
            }
            setShowRecruitModal(true);
          }}
        >
          Recruit Soiliers
        </Button>
      </div>
      {battleResult && (
        <BattleResultModal
          type={battleResult.isSuccess ? "victory" : "defeat"}
          onClose={() => {
            setBattleResult(undefined);
          }}
        />
      )}
      {failedModalType && (
        <InitOrRecruitFailedModal
          type={failedModalType}
          onClose={() => {
            setFailedModalType(undefined);
          }}
        />
      )}
      {showRecruitModal && (
        <RecruitModal
          onClose={() => {
            setShowRecruitModal(false);
          }}
        />
      )}
    </div>
  );
}

interface IAttrCardProps {
  className?: string;
  title: string;
  data: Record<string, ReactNode>;
}
function AttrCard(props: IAttrCardProps) {
  const { className, title, data } = props;
  return (
    <div className={cn(className, "bg-[#fff] w-full p-6")}>
      <h3 className="text-[#07253E] text-base font-bold">{title}</h3>
      <ul className="mt-4">
        {Object.keys(data).map((key, index) => {
          const element = data[key];
          const isLast = index === Object.keys(data).length - 1;
          return (
            <li
              key={key}
              className={cn(
                "flex flex-wrap items-center gap-[10px] justify-between p-[11px]",
                !isLast && "border-b-[1px] border-solid border-b-[#d4dce5]"
              )}
            >
              <span className="text-[#686B6F] text-sm">{key}</span>
              <div className="text-sm text-[#07253E]">{element}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
