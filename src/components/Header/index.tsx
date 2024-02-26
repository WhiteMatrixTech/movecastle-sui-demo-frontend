import LeftArrow from "@/assets/left-arrow.svg?react";
import { useWallet } from "@suiet/wallet-kit";
import { useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { handleUnknownTypeError } from "@/utils/common";
import { Account } from "./Account";

export function Header() {
  const { select, allAvailableWallets, account } = useWallet();

  const suiWallet = useMemo(
    () => allAvailableWallets.find((item) => item.name === "Sui Wallet"),
    [allAvailableWallets]
  );

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
    <header className="sticky hover:text-[#C0CBDF] duration-200 text-white bg-[#001731] top-0 inset-x-0 h-[72px] px-[4.16vw] flex items-center justify-between">
      {/* left */}
      <a
        href="https://edu-develop-b702b03e93.chainide.com/courses/105/"
        className="flex items-center gap-x-[10px]"
      >
        <LeftArrow />
        <span className="text-lg">Web3 Course 105 - Sui</span>
      </a>

      {/* right */}
      {account?.address ? (
        <Account />
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </header>
  );
}
