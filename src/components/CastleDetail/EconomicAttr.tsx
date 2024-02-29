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
    if (buff) {
      if (buff.power === "0") {
        return "None";
      }
      return `${buff.debuff ? "-" : "+"}${buff.power}%`;
    }
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
        "Bonus From Soldiers": soldiersBonus,
        "Battle Reparations": (
          <div className="flex items-center gap-x-2 shrink-0">
            {buffs.map((buff) => {
              if (currentTime > Number(buff.end) || currentTime === 0) {
                //buff结束了
                return <></>;
              }
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
            })}
          </div>
        ),
        "Total Economic Power": "TODO",
      }}
    />
  );
}
