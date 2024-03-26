import { Button } from "@/components";
import { Link, useNavigate } from "react-router-dom";
import PlusSVG from "@/assets/plus.svg?react";
import { useWallet } from "@suiet/wallet-kit";
import { useEffect, useState } from "react";
import { suiClient } from "@/utils/suiClient";
import { SuiObjectResponse } from "@mysten/sui.js/client";
import { PACKAGE_OBJECT_ID } from "@/utils/const";
import { get } from "lodash";
import cn from "classnames";

export function ProfilePage() {
  const navigate = useNavigate();
  const { account } = useWallet();
  const [ownCastleObjs, setOwnCastleObjs] = useState<SuiObjectResponse[]>([]);

  useEffect(() => {
    if (!account?.address) return;
    suiClient
      .getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
        },
      })
      .then((v) => {
        setOwnCastleObjs(
          v.data?.filter(
            (item) =>
              get(item, "data.content.type") ===
              `${PACKAGE_OBJECT_ID}::castle::Castle`
          )
        );
      })
      .catch(console.error);
  }, [account?.address]);

  return (
    <div className="mx-auto px-4 sm:px-[5.83%] pt-8 pb-4 sm:pt-16 sm:pb-8">
      <h1 className="text-lg sm:text-2xl font-semibold text-[#07253E] capitalize">
        This is a list of castles that you have cast:
      </h1>
      <ul className="flex flex-wrap gap-4 mt-6 sm:mt-7">
        <li
          onClick={() => {
            navigate("/create-castle");
          }}
          className="w-full cursor-pointer flex-col mx-auto sm:mx-0 gap-y-4 max-w-[320px] sm:w-[320px] aspect-square flex items-center justify-center bg-white box-border border-[1px] border-solid border-[#4DA3FF] text-[#4DA3FF]"
        >
          <PlusSVG />
          <span className=" font-medium text-xl">Create New Castle</span>
        </li>

        {ownCastleObjs.map((castle, index) => {
          const imgId = `${get(castle, "data.content.fields.image_id")}`;
          return (
            <li
              key={index}
              className="w-full p-4 flex-col mx-auto sm:mx-0 max-w-[320px] sm:w-[320px] aspect-square flex items-center justify-center bg-white"
            >
              <img
                src={`https://images.movecastle.info/static/media/castles/${imgId}.png`}
                className={cn(
                  "w-[calc(100%_-_32px)] rounded mx-auto aspect-square"
                )}
                alt="castle default"
              />
              <span className="mt-3 mb-[30px] font-bold">
                {get(castle, "data.content.fields.name")}
              </span>
              <Link to={`/castles/${castle.data?.objectId}`} className="w-full">
                <Button type="primary" className="h-10 sm:h-12 w-[70%] mx-auto">
                  Explore
                </Button>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
