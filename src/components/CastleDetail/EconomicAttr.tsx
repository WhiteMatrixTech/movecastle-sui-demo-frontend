import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface IEconomicAttrProps {
  dynamicFieldsObj: SuiObjectData | undefined | null;
}

interface IBattleBuff {
  debuff: boolean;
  end: string;
  power: string;
  start: string;
}

export function EconomicAttr(props: IEconomicAttrProps) {
  const { dynamicFieldsObj } = props;

  const soldiersBonus = useMemo(() => {
    const buff = get(
      dynamicFieldsObj,
      "content.fields.value.fields.economy.fields.soldier_buff.fields"
    ) as unknown as { debuff: boolean; power: string };
    if (buff && buff.power !== "0") {
      return `${buff.debuff ? "-" : "+"}${buff.power}`;
    }
    return 0;
  }, [dynamicFieldsObj]);

  const buffs = useMemo(() => {
    return (
      get(
        dynamicFieldsObj,
        "content.fields.value.fields.economy.fields.battle_buff"
      ) || []
    ).map((item) => (item as { fields: IBattleBuff }).fields);
  }, [dynamicFieldsObj]);

  const [currentTime, setCurrentTime] = useState<number>(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCurrentTime(Date.now());
    }, 2000);
    return () => {
      clearInterval(id);
    };
  }, []);

  const hasBattleBuff = useMemo(() => {
    return !!buffs.find(
      (item) =>
        currentTime <= Number(item.end) && currentTime >= Number(item.start)
    );
  }, [buffs, currentTime]);

  const totalEconomicPower = useMemo(() => {
    const basePower = Number(
      get(
        dynamicFieldsObj,
        "content.fields.value.fields.economy.fields.base_power"
      )
    );
    const availableBuffs = buffs.filter(
      (item) =>
        currentTime <= Number(item.end) && currentTime >= Number(item.start)
    );
    let totalPower = basePower + Number(soldiersBonus);
    for (const buff of availableBuffs) {
      totalPower += Number(`${buff.debuff ? "-" : "+"}${buff.power}`);
    }
    return totalPower;
  }, [dynamicFieldsObj, buffs, soldiersBonus, currentTime]);

  return (
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
        "Bonus From Soldiers": soldiersBonus || "None",
        "Battle Reparations": (
          <div className="flex items-center gap-x-2 shrink-0">
            {hasBattleBuff
              ? buffs.map((buff) => {
                  const percentage =
                    (currentTime - Number(buff.start)) /
                    (Number(buff.end) - Number(buff.start));

                  const text = `${buff.debuff ? "-" : "+"}${buff.power}`;
                  return (
                    <div key={buff.start} className="w-6 sm:w-8 aspect-square">
                      <CircularProgressbar
                        value={(1 - percentage) * 100}
                        text={text}
                      />
                    </div>
                  );
                })
              : "None"}
          </div>
        ),
        "Total Economic Power": totalEconomicPower,
      }}
    />
  );
}
