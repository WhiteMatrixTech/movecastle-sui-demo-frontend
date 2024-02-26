import LeftArrow from "@/assets/left-arrow.svg?react";
import { useWallet } from "@suiet/wallet-kit";
import { useCallback, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { handleUnknownTypeError } from "@/utils/common";
import { Account } from "./Account";

export function Header() {
  const { select, allAvailableWallets, account, chain } = useWallet();

  const suiWallet = useMemo(
    () => allAvailableWallets.find((item) => item.name === "Sui Wallet"),
    [allAvailableWallets]
  );

  useEffect(() => {
    console.log(chain);
    if (account?.address && chain?.id && chain?.id !== "sui:testnet") {
      toast.error("Please switch to Sui Testnet!");
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
        handleUnknownTypeError(e);
      }
    }
  }, [select, suiWallet]);

  return (
    <header className="sticky bg-[#001731] top-0 inset-x-0 h-16 sm:h-[72px] sm:px-[4.16vw] flex items-center justify-between">
      {/* left */}
      <a
        href="https://edu-develop-b702b03e93.chainide.com/courses/105/"
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