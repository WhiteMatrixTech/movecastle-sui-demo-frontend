import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { targetNetwork } from "./const";

export const suiClient = new SuiClient({ url: getFullnodeUrl(targetNetwork) });
