import LeftArrow from "@/assets/left-arrow.svg?react";
import { useWallet } from "@suiet/wallet-kit";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Account } from "./Account";
import { targetNetwork } from "@/utils/const";

export function Header() {
  const { select, allAvailableWallets, account, chain } = useWallet();

  const suiWallet = useMemo(
    () => allAvailableWallets.find((item) => item.name === "Sui Wallet"),
    [allAvailableWallets]
  );

  useEffect(() => {
    if (account?.address && chain?.id && chain?.id !== `sui:${targetNetwork}`) {
      toast.error(`Please switch to sui ${targetNetwork}!`);
    }
  }, [account?.address, chain]);

  const handleSignIn = useCallback(async () => {
    if (!suiWallet || !suiWallet?.installed) {
      toast.error(
        <div>
          <span>
            No{" "}
            <a
              href="https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
              target="_blank"
              className="text-[#4ca2ff]"
            >
              Sui Wallet
            </a>{" "}
            detected!
          </span>
        </div>
      );
      return;
    } else {
      try {
        await select(suiWallet.name);
      } catch (e: unknown) {
        console.error(e);
        toast.error("Sign in failed!");
      }
    }
  }, [select, suiWallet]);

  return (
    <header className="sticky bg-[#001731] top-0 z-50 inset-x-0 h-16 sm:h-[72px] px-4 sm:px-[4.16vw] flex items-center justify-between">
      {/* left */}
      <a
        href="https://edu-staging-e64a0cba6d.chainide.com/courses/105/"
        className="flex items-center gap-x-1 sm:gap-x-[10px] hover:text-[#C0CBDF] duration-200 text-white"
      >
        <LeftArrow className="w-4 sm:w-6" />
        <span className="text-sm sm:text-lg">Web3 Course 105 - Sui</span>
      </a>

      {/* right */}
      {account?.address ? (
        <Account />
      ) : (
        <button
          className="hover:text-[#C0CBDF] duration-200 text-white"
          onClick={handleSignIn}
        >
          Sign In
        </button>
      )}
    </header>
  );
}
