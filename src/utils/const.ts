export const PACKAGE_OBJECT_ID =
  "0xbc887687170b92c06cef9de722c763011f11c331822bd8287138a8b15c95e714";
export const GAME_STORE_OBJECT_ID =
  "0x6a6458397b77d3c8e762c2e2203b491eabc5f5f655cadeb99b1cf37e4ee20e78";

export const targetNetwork = "devnet";

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

export enum ELevel {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Five = 5,
  Six = 6,
  Seven = 7,
  Eight = 8,
  Nine = 9,
  Ten = 10,
}
export const LevelNameMap = {
  [ELevel.One]: "1st",
  [ELevel.Two]: "2nd",
  [ELevel.Three]: "3rd",
  [ELevel.Four]: "4th",
  [ELevel.Five]: "5th",
  [ELevel.Six]: "6th",
  [ELevel.Seven]: "7th",
  [ELevel.Eight]: "8th",
  [ELevel.Nine]: "9th",
  [ELevel.Ten]: "10th",
};

export const LevelUpExpMap: Record<ELevel, number> = {
  [ELevel.One]: 100,
  [ELevel.Two]: 150,
  [ELevel.Three]: 225,
  [ELevel.Four]: 338,
  [ELevel.Five]: 507,
  [ELevel.Six]: 760,
  [ELevel.Seven]: 1140,
  [ELevel.Eight]: 1709,
  [ELevel.Nine]: 2563,
  [ELevel.Ten]: Infinity,
};
