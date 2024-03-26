export const PACKAGE_OBJECT_ID =
  "0x6606c3dc6fefbd2a6756057368fde031579aa0f39dc5cf1e07e595e50a6c2073";
export const GAME_STORE_OBJECT_ID =
  "0x97fcf06e86934ca9f186d5a3fe4bc092f59426dec42db8f1d690483685fd4e82";

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
