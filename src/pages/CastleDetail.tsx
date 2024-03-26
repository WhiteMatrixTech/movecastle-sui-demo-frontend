import { useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import cn from "classnames";
import {
  ActionButtonLayout,
  BasicAttr,
  BattleResultModal,
  Button,
  EconomicAttr,
  MilitaryAttr,
  RecruitModal,
} from "@/components";
import { useWallet } from "@suiet/wallet-kit";
import { toast } from "react-toastify";
import { SuiObjectData } from "@mysten/sui.js/client";
import { suiClient } from "@/utils/suiClient";
import {
  CastleSoliderLimitMap,
  CLOCK_OBJ_ID,
  ECastleSize,
  GAME_STORE_OBJECT_ID,
  PACKAGE_OBJECT_ID,
  treasuriesPerSolider,
} from "@/utils/const";
import { get } from "lodash";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getErrorDisplayText } from "@/utils/common";

export interface IBattleResult {
  attacker: string;
  battle_time: string;
  loser: string;
  loser_soldiers_lost: string;
  reparation_economic_power: string;
  reparation_end_time: string;
  winner: string;
  winner_soldiers_lost: string;
}

export function CastleDetailPage() {
  const { id } = useParams();
  const { account, signAndExecuteTransactionBlock } = useWallet();

  const [suiObj, setSuiObj] = useState<SuiObjectData | null | undefined>();
  const [dynamicFieldsObj, setDynamicFieldsObj] = useState<
    SuiObjectData | undefined | null
  >();

  const fetchSuiObj = useCallback(() => {
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
  }, [id]);

  const fetchDynamicFieldObject = useCallback(() => {
    if (!id) return;
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

  useEffect(() => {
    fetchSuiObj();
    fetchDynamicFieldObject();
  }, [fetchDynamicFieldObject, fetchSuiObj, id]);

  const [battleResult, setBattleResult] = useState<IBattleResult>();
  const [isBattling, setBattling] = useState(false);
  const handleBattle = useCallback(async () => {
    if (!account?.address) {
      toast.error("Please sign in!");
      return;
    }
    // check is in cooldown
    const cooldown = get(
      dynamicFieldsObj,
      "content.fields.value.fields.millitary.fields.battle_cooldown"
    );
    if (cooldown) {
      const before = Number(cooldown);
      if (Date.now() <= before) {
        toast.error("Cooling down, please try again later!");
        return;
      }
    }
    setBattling(true);
    try {
      const txb = new TransactionBlock();
      const args = [
        txb.pure(id),
        txb.pure(CLOCK_OBJ_ID),
        txb.pure(GAME_STORE_OBJECT_ID),
      ];
      txb.moveCall({
        target: `${PACKAGE_OBJECT_ID}::battle::battle`,
        arguments: args,
      });
      const exeRes = await signAndExecuteTransactionBlock({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transactionBlock: txb as any,
      });
      const waitRes = await suiClient.waitForTransactionBlock({
        digest: exeRes.digest,
        options: {
          showObjectChanges: true,
          showEvents: true,
        },
      });
      const result = waitRes.events?.find(
        (event) =>
          event.type === `${PACKAGE_OBJECT_ID}::battle::CastleBattleLog`
      )?.parsedJson;
      fetchDynamicFieldObject();
      fetchSuiObj();
      setBattleResult(result as IBattleResult);
    } catch (e) {
      console.error(e);
      toast.error(
        <p className="line-clamp-5">
          {getErrorDisplayText(e, "Failed to start battle!")}
        </p>
      );
    }
    setBattling(false);
  }, [
    account?.address,
    dynamicFieldsObj,
    fetchDynamicFieldObject,
    fetchSuiObj,
    id,
    signAndExecuteTransactionBlock,
  ]);

  const [showRecruitModal, setShowRecruitModal] = useState(false);

  const treasuryBalance = useMemo(
    () =>
      get(
        dynamicFieldsObj,
        "content.fields.value.fields.economy.fields.treasury"
      ),
    [dynamicFieldsObj]
  );

  const recruitLimit = useMemo(() => {
    const castleSize = Number(
      get(dynamicFieldsObj, "content.fields.value.fields.size")
    ) as ECastleSize;
    if (!treasuryBalance) return;
    const castleMaxSoldiers = CastleSoliderLimitMap[castleSize];
    const currentSoldiers = Number(
      get(
        dynamicFieldsObj,
        "content.fields.value.fields.millitary.fields.soldiers"
      )
    );
    return Math.min(
      Math.floor(Number(treasuryBalance) / treasuriesPerSolider),
      castleMaxSoldiers - currentSoldiers
    );
  }, [dynamicFieldsObj, treasuryBalance]);

  const castleImg = useMemo(
    () => get(suiObj, "display.data.image_url"),
    [suiObj]
  );

  return (
    <div className="mx-auto w-[calc(100vw_-_32px)] max-w-[862px] py-8 sm:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 mb-4">
        <div className="bg-[#f8f9fb] w-full p-6 flex flex-col justify-between">
          <img
            src={castleImg}
            alt="castle default img"
            className={cn(
              "w-full mx-auto aspect-square rounded-lg",
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
        <BasicAttr
          onRefresh={() => {
            fetchSuiObj();
            fetchDynamicFieldObject();
          }}
          suiObj={suiObj}
          dynamicFieldsObj={dynamicFieldsObj}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <EconomicAttr dynamicFieldsObj={dynamicFieldsObj} />
        <MilitaryAttr dynamicFieldsObj={dynamicFieldsObj} />
      </div>
      <ActionButtonLayout type="engage" className="my-4">
        <Button
          type="primary"
          className="w-full sm:w-[223px] h-12 z-10"
          onClick={handleBattle}
          loading={isBattling}
        >
          Start Battle
        </Button>
      </ActionButtonLayout>
      <ActionButtonLayout type="enlist">
        <Button
          type="primary"
          className="w-full sm:w-[223px] h-12 z-10 shrink-0"
          onClick={() => {
            if (!account?.address) {
              toast.error("Please sign in!");
              return;
            }
            if (!treasuryBalance || Number(treasuryBalance) === 0) {
              toast.error("Insufficient treasury balance!");
              return;
            }
            setShowRecruitModal(true);
          }}
        >
          Recruit Soiliers
        </Button>
      </ActionButtonLayout>
      {battleResult && (
        <BattleResultModal
          result={battleResult}
          onClose={() => {
            setBattleResult(undefined);
          }}
        />
      )}
      {showRecruitModal && (
        <RecruitModal
          id={id || ""}
          limit={recruitLimit}
          onClose={() => {
            setShowRecruitModal(false);
          }}
          onRefresh={() => {
            fetchDynamicFieldObject();
            fetchSuiObj();
          }}
        />
      )}
    </div>
  );
}
