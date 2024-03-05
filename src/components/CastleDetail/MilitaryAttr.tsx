import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";
import { useMemo } from "react";
import dayjs from "dayjs";

interface IMilitaryAttrProps {
  dynamicFieldsObj: SuiObjectData | undefined | null;
}
export function MilitaryAttr(props: IMilitaryAttrProps) {
  const { dynamicFieldsObj } = props;

  const battleCooldown = useMemo(() => {
    const cooldown = get(
      dynamicFieldsObj,
      "content.fields.value.fields.millitary.fields.battle_cooldown"
    );
    if (cooldown) {
      const before = Number(cooldown);
      if (Date.now() > before) {
        return "None";
      }
      return dayjs().to(new Date(Number(cooldown)));
    }
  }, [dynamicFieldsObj]);

  return (
    <AttrCard
      title="Military Attributes"
      data={{
        "Base Attack Power / Defence Power": `${get(
          dynamicFieldsObj,
          "content.fields.value.fields.millitary.fields.attack_power"
        )} / ${get(
          dynamicFieldsObj,
          "content.fields.value.fields.millitary.fields.defense_power"
        )}`,
        Soldiers: get(
          dynamicFieldsObj,
          "content.fields.value.fields.millitary.fields.soldiers"
        ),
        "Total Attack Power / Defence Power": `${get(
          dynamicFieldsObj,
          "content.fields.value.fields.millitary.fields.total_attack_power"
        )} / ${get(
          dynamicFieldsObj,
          "content.fields.value.fields.millitary.fields.total_defense_power"
        )}`,
        "Battle Cooldown": battleCooldown,
      }}
    />
  );
}
