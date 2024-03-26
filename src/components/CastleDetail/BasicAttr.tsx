/* eslint-disable @typescript-eslint/no-explicit-any */
import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";
import { useMemo } from "react";
import {
  ELevel,
  GAME_STORE_OBJECT_ID,
  LevelNameMap,
  LevelUpExpMap,
  PACKAGE_OBJECT_ID,
} from "@/utils/const";
import UpgradeSVG from "@/assets/upgrade.svg?react";
import LoadingSVG from "@/assets/loading.svg?react";

import { useAsyncFn } from "react-use";
import { useWallet } from "@suiet/wallet-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useParams } from "react-router-dom";
import { suiClient } from "@/utils/suiClient";
import { toast } from "react-toastify";
interface IBasicAttrProps {
  suiObj: SuiObjectData | null | undefined;
  dynamicFieldsObj: SuiObjectData | undefined | null;
  onRefresh: () => void;
}

enum ERace {
  human,
  elf,
  orcs,
  goblin,
  undead,
}

export function BasicAttr(props: IBasicAttrProps) {
  const { suiObj, dynamicFieldsObj, onRefresh } = props;
  const race = useMemo(() => {
    const raceId = get(dynamicFieldsObj, "content.fields.value.fields.race");
    if (raceId !== undefined) {
      return ERace[raceId];
    }
  }, [dynamicFieldsObj]);
  const size = useMemo(() => {
    const value = get(dynamicFieldsObj, "content.fields.value.fields.size");
    if (value === "3") {
      return "big";
    } else if (value === "2") {
      return "middle";
    } else {
      return "small";
    }
  }, [dynamicFieldsObj]);

  const level = useMemo(
    () =>
      Number(
        get(dynamicFieldsObj, "content.fields.value.fields.level")
      ) as ELevel,
    [dynamicFieldsObj]
  );

  const exp = useMemo(
    () =>
      Number(
        get(dynamicFieldsObj, "content.fields.value.fields.experience_pool")
      ),
    [dynamicFieldsObj]
  );
  const { account, signAndExecuteTransactionBlock } = useWallet();
  const showUpgrade = useMemo(
    () =>
      exp >= LevelUpExpMap[level] &&
      account?.address &&
      account.address === get(suiObj, "owner.AddressOwner"),
    [account, exp, level, suiObj]
  );

  const { id } = useParams();

  const [upgradeResult, doUpgrade] = useAsyncFn(async () => {
    try {
      const txb = new TransactionBlock();
      const args = [txb.pure(id), txb.pure(GAME_STORE_OBJECT_ID)];
      txb.moveCall({
        target: `${PACKAGE_OBJECT_ID}::castle::upgrade_castle`,
        arguments: args,
      });
      const exeRes = await signAndExecuteTransactionBlock({
        transactionBlock: txb as any,
      });
      await suiClient.waitForTransactionBlock({
        digest: exeRes.digest,
      });
      onRefresh();
      toast.success("Update succeed!");
    } catch (e) {
      console.error(e);
      toast.error("Upgrade failed!");
    }
  }, [id, signAndExecuteTransactionBlock, onRefresh]);

  return (
    <AttrCard
      title="Basic Attributes"
      data={{
        Name: get(suiObj, "display.data.name"),
        "Serial Number": get(suiObj, "content.fields.serial_number"),
        Size: size,
        Race: race,
        Experience: exp,
        Level: (
          <div className="flex items-center text-[#FF7A00] gap-x-1 font-bold">
            <span>{LevelNameMap[level]}</span>
            {upgradeResult.loading ? (
              <LoadingSVG className="w-5" />
            ) : showUpgrade ? (
              <UpgradeSVG
                onClick={doUpgrade}
                className="cursor-pointer animate-pulse"
              />
            ) : (
              <></>
            )}
          </div>
        ),
        Description: get(suiObj, "display.data.description"),
      }}
    />
  );
}
