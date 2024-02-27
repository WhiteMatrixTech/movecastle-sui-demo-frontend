import { ReactNode, useRef, useState } from "react";
import { useClickAway, useToggle } from "react-use";
import cn from "classnames";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components";

type CastleSize = "small" | "middle" | "big";
const sizes: CastleSize[] = ["small", "middle", "big"];
export function CreateCastlePage() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [size, setSize] = useState<CastleSize>("small");

  const [showSizeDropDown, toggleShowSizeDropdown] = useToggle(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useClickAway(selectRef, () => {
    toggleShowSizeDropdown(false);
  });

  return (
    <div className="pt-[10vh] sm:pt-[19vh] pb-[8vh]">
      <div className="mx-auto w-[calc(100vw_-_32px)] max-w-[628px] px-4 sm:px-20 pt-6 sm:pt-12 pb-8 sm:pb-16 bg-white">
        <h1 className="text-center w-full text-[#131C28] text-lg sm:text-2xl font-semibold">
          Castle attributes
        </h1>
        <form className="flex my-6 sm:my-8 flex-col gap-y-4 sm:gap-y-6">
          <div>
            <FieldTitle>Name</FieldTitle>
            <input
              placeholder="Project Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="bg-[#EBF1F7] text-sm placeholder:text-[#4D5D69] px-2 sm:px-3 py-[9px] sm:py-[13px] rounded sm:rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <FieldTitle>Description</FieldTitle>
            <textarea
              placeholder="Project Description"
              value={desc}
              rows={3}
              onChange={(e) => {
                setDesc(e.target.value);
              }}
              className="bg-[#EBF1F7] text-sm placeholder:text-[#4D5D69] px-2 sm:px-3 py-[9px] sm:py-[13px] rounded sm:rounded-md w-full focus:outline-none"
            />
          </div>
          <div>
            <FieldTitle>Size</FieldTitle>
            <div
              ref={selectRef}
              onMouseEnter={() => {
                toggleShowSizeDropdown(true);
              }}
              onMouseLeave={() => {
                toggleShowSizeDropdown(false);
              }}
              onClick={() => {
                toggleShowSizeDropdown();
              }}
              className="cursor-pointer relative uppercase flex justify-between items-center bg-[#EBF1F7] text-sm placeholder:text-[#4D5D69] px-2 sm:px-3 py-[9px] sm:py-[13px] rounded sm:rounded-md w-full"
            >
              <span className="capitalize">{size}</span>
              <svg
                width="18"
                height="13"
                viewBox="0 0 18 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.715 11.8497C9.91661 12.9279 8.30405 12.9297 7.5032 11.8534L1.07708 3.21684C0.0960379 1.89835 1.03571 0.024997 2.67915 0.0229486L15.5129 0.00695217C17.1566 0.00490349 18.1009 1.87633 17.1227 3.19721L10.715 11.8497Z"
                  fill="#63A0F8"
                  className={cn(
                    "duration-300 origin-center",
                    showSizeDropDown ? "rotate-180" : "rotate-0"
                  )}
                />
              </svg>
              <ul
                className={cn(
                  "absolute bottom-0 duration-300 overflow-hidden translate-y-[calc(100%_+_6px)] inset-x-0 bg-[#EBF1F7] rounded sm:rounded-md",
                  showSizeDropDown ? "h-[111px]" : "h-0"
                )}
              >
                {sizes.map((item) => (
                  <li
                    key={item}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSize(item);
                      toggleShowSizeDropdown(false);
                    }}
                    className="flex items-center duration-200 capitalize rounded sm:rounded-md hover:bg-[#C6E4F9] text-[#4D5D69] h-[37px] px-2 sm:px-[14px["
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* button area */}
        </form>
        <div className="flex items-center justify-between gap-x-2 sm:gap-x-[21px] text-sm sm:text-base">
          <Button
            onClick={() => {
              navigate("/profile");
            }}
            type="gray"
            className="w-full h-10 sm:h-12"
          >
            Cancel
          </Button>
          <Button type="primary" className="w-full h-10 sm:h-12">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export function FieldTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2 sm:text-lg">
      {children} <span className="text-[#FE5B5B]">*</span>
    </div>
  );
}
