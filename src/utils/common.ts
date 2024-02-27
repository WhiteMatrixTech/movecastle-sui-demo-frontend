import { toast } from "react-toastify";

export function handleUnknownTypeError(e: unknown) {
  if (typeof e === "string") {
    toast.error(e);
  } else if (typeof e === "object") {
    toast.error((e as Error)?.message || "Unknown error");
  } else {
    toast.error("Unknown error");
  }
}

export function abbrAddress(address?: string, digits = 6) {
  if (!address) return "";
  return `${address.slice(0, digits)}...`;
}

/**
 * mock promise
 * @param time 毫秒
 */
export function mockPromise(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("");
    }, time);
  });
}
