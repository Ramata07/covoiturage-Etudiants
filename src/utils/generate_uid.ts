import ksuid from "ksuid";

export const generateUid = (prefix: string): string => {
  const generated = ksuid.randomSync().string;
  return `${prefix}_${generated}`;
};