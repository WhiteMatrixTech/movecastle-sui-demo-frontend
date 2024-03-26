export const PACKAGE_OBJECT_ID =
  "0x3153686f8d1f27b73f2407a8fc5289e4032d04c077531a47d3a02c751607f3a6";
export const GAME_STORE_OBJECT_ID =
  "0x065bec26b0c3582b3f4c12bee474575650197b663af9d6c73261efe0890e5309";

export enum ECastleSize {
  BIG = 3,
  MIDDLE = 2,
  SMALL = 1,
}

export const CastleNameMap = {
  [ECastleSize.BIG]: "big",
  [ECastleSize.MIDDLE]: "middle",
  [ECastleSize.SMALL]: "small",
};

export const CastleSoliderLimitMap = {
  [ECastleSize.BIG]: 2000,
  [ECastleSize.MIDDLE]: 1000,
  [ECastleSize.SMALL]: 500,
};

export const treasuriesPerSolider = 100;

export const CLOCK_OBJ_ID = "0x6";
