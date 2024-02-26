import { abbrAddress } from "@/utils/common";
import { useWallet } from "@suiet/wallet-kit";
import CopySVG from "@/assets/copy.svg?react";
import DefaultAvatar from "@/assets/default_avatar.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";

export function Account() {
  const { account, disconnect } = useWallet();
  const navigate = useNavigate();
  return (
    <div className="group cursor-pointer py-3 relative hover:text-[#C0CBDF] duration-200 text-white">
      <div
        className="flex items-center gap-x-1 sm:gap-x-2"
        onClick={() => {
          navigate("/profile");
        }}
      >
        <img src={DefaultAvatar} className="w-8 sm:w-12" />
        <span className="text-sm sm:text-base">
          {abbrAddress(account?.address)}
        </span>
        <svg
          viewBox="0 0 24 24"
          className="shrink-0 w-4 sm:w-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 12L12 20L4 12L5.42 10.58L12 17.16L18.58 10.58L20 12Z"
            className="fill-current duration-200 group-hover:rotate-180 origin-[50%_60%]"
          />
        </svg>
      </div>
      {/* dropdown */}
      <div className="absolute bottom-0 overflow-hidden h-0 group-hover:h-[112px] duration-200 right-0 w-[226px] pt-1 translate-y-full">
        <div className="bg-[#F8F9FB] h-[108px]">
          <div className="pt-[12px] mb-[14px] pl-[14px] pr-3">
            <h3 className="text-[#686B6F] text-xs leading-[18px] mb-[6px]">
              Address
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-[#07253E] text-sm leading-[18px] font-medium">
                {abbrAddress(account?.address, 18)}
              </span>
              <CopyToClipboard text={account?.address || ""}>
                <CopySVG
                  onClick={() => {
                    toast.success("Copied!");
                  }}
                />
              </CopyToClipboard>
            </div>
          </div>
          <hr className=" border-none h-[1px] bg-[#e6e7e9] mx-1 my-2" />
          <div className="w-full flex justify-center">
            <button
              onClick={disconnect}
              className="text-[#686B6F] text-xs w-[130px] bg-[#DCE8F1] font-medium rounded-full h-[28px] flex items-center justify-center"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
