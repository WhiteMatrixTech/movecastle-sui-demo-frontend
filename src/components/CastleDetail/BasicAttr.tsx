import { SuiObjectData } from "@mysten/sui.js/client";
import { AttrCard } from "./AttrCard";
import { get } from "lodash";

interface IBasicAttrProps {
  suiObj: SuiObjectData | null | undefined;
  dynamicFieldsObj: SuiObjectData | undefined | null;
}
export function BasicAttr(props: IBasicAttrProps) {
  const { suiObj, dynamicFieldsObj } = props;
  return (
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
  );
}
