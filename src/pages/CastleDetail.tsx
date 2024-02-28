/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
import { SuiObjectData } from "@mysten/sui.js/client";
import { suiClient } from "@/utils/suiClient";
import { GAME_STORE_OBJECT_ID } from "@/utils/const";
import { get } from "lodash";

interface IBattleResult {
  isSuccess: boolean;
}

export function CastleDetailPage() {
  const { id } = useParams();
  const { account } = useWallet();
  const [suiObj, setSuiObj] = useState<SuiObjectData | null | undefined>();
  const [gameObj, setGameObj] = useState<SuiObjectData | null | undefined>();
  const [dynamicFieldsObj, setDynamicFieldsObj] = useState<
    SuiObjectData | undefined | null
  >();
  useEffect(() => {
    if (!id) return;
    suiClient
      .getObject({
        id,
        options: {
          showContent: true,
          showDisplay: true,
          showOwner: true,
          showType: true,
        },
      })
      .then((v) => {
        setSuiObj(v?.data);
      })
      .catch(console.error);

    suiClient
      .getObject({
        id: GAME_STORE_OBJECT_ID,
        options: {
          showContent: true,
          showDisplay: true,
          showOwner: true,
          showType: true,
        },
      })
      .then((v) => {
        setGameObj(v?.data);
      })
      .catch(console.error);

    suiClient
      .getDynamicFieldObject({
        parentId: GAME_STORE_OBJECT_ID,
        name: {
          type: "0x2::object::ID",
          value: id,
        },
      })
      .then((v) => {
        setDynamicFieldsObj(v?.data);
      })
      .catch(console.error);
  }, [id]);

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

  console.log(dynamicFieldsObj, gameObj, suiObj);

  const castleImg = useMemo(
    () => get(suiObj, "display.data.image_url"),
    [suiObj]
  );
  const soldiersBonus = useMemo(() => {
    const buff = get(
      dynamicFieldsObj,
      "content.fields.value.fields.economy.fields.soldier_buff.fields"
    ) as unknown as { debuff: boolean; power: string };
    if (buff) {
      return `${buff.debuff ? "+" : "-"}${buff.power}%`;
    }
  }, [dynamicFieldsObj]);

  return (
    <div className="mx-auto w-[calc(100vw_-_32px)] max-w-[862px] py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
        <div className="bg-[#f8f9fb] w-full p-6 flex flex-col justify-between">
          <img
            src={castleImg}
            alt="castle default img"
            className={cn(
              "w-[49%] mx-auto aspect-[0.64]",
              castleImg ? "opacity-100" : "opacity-0"
            )}
          />
          <h2 className="mb-4 mt-12 text-[#07253E] font-bold text-lg">
            {get(suiObj, "display.data.name")}
          </h2>
          <p className="text-[#4D5D69] text-sm sm:text-[17px] break-all sm:leading-[30px] mb-1">
            {suiObj?.objectId}
          </p>
        </div>
        <AttrCard
          title="Basic Attributes"
          data={{
            Name: get(suiObj, "display.data.name"),
            "Serial Number": get(suiObj, "content.fields.serial_number"),
            Size: get(dynamicFieldsObj, "content.fields.value.fields.size"),
            //TODO: 要做映射
            // Race: get(dynamicFieldsObj, "content.fields.value.fields.race"),
            Race: "TODO",
            Experience: get(
              dynamicFieldsObj,
              "content.fields.value.fields.experience_pool"
            ),
            Level: get(dynamicFieldsObj, "content.fields.value.fields.level"),
            Description: get(suiObj, "display.data.description"),
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AttrCard
          title="Economic Attributes"
          data={{
            Treasury: get(
              dynamicFieldsObj,
              "content.fields.value.fields.economy.fields.treasury"
            ),
            "Base Economic Power": get(
              dynamicFieldsObj,
              "content.fields.value.fields.economy.fields.base_power"
            ),
            "Bonus From Soldiers": soldiersBonus,
            "Battle Reparations": "TODO",
            "Total Economic Power": "TODO",
          }}
        />
        <AttrCard
          title="Military Attributes"
          data={{
            "Attack Power": get(
              dynamicFieldsObj,
              "content.fields.value.fields.millitary.fields.attack_power"
            ),
            Soldiers: get(
              dynamicFieldsObj,
              "content.fields.value.fields.millitary.fields.soldiers"
            ),
            "Defence Power": get(
              dynamicFieldsObj,
              "content.fields.value.fields.millitary.fields.defence_power"
            ),
            "Battle Cooldown": "TODO",
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
