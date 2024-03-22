import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";

// create a client connected to devnet
export const suiClient = new SuiClient({ url: getFullnodeUrl("devnet") });
