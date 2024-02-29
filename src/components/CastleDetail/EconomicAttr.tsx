import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";
import { useMemo } from "react";

interface IEconomicAttrProps {
  dynamicFieldsObj: SuiObjectData | undefined | null;
}
export function EconomicAttr(props: IEconomicAttrProps) {
  const { dynamicFieldsObj } = props;

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
  );
}
