import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";
import { useMemo } from "react";

interface IBasicAttrProps {
  suiObj: SuiObjectData | null | undefined;
  dynamicFieldsObj: SuiObjectData | undefined | null;
}

enum ERace {
  human,
  elf,
  orcs,
  goblin,
  undead,
}

export function BasicAttr(props: IBasicAttrProps) {
  const { suiObj, dynamicFieldsObj } = props;
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
  return (
    <AttrCard
      title="Basic Attributes"
      data={{
        Name: get(suiObj, "display.data.name"),
        "Serial Number": get(suiObj, "content.fields.serial_number"),
        Size: size,
        Race: race,
        Experience: get(
          dynamicFieldsObj,
          "content.fields.value.fields.experience_pool"
        ),
        Level: get(dynamicFieldsObj, "content.fields.value.fields.level"),
        Description: get(suiObj, "display.data.description"),
      }}
    />
  );
}
