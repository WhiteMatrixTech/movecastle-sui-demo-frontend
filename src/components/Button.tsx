import { ReactNode } from "react";
import cn from "classnames";
import LoadingSVG from "@/assets/loading.svg?react";

type ButtonType = "primary" | "outline" | "gray";
interface IButtonProps {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  loading?: boolean;
  type?: ButtonType;
}
export function Button(props: IButtonProps) {
  const { className, children, onClick, loading, type = "primary" } = props;
  return (
    <button
      onClick={() => {
        if (!loading && onClick) {
          onClick();
        }
      }}
      className={cn(
        className,
        "rounded sm:rounded-md duration-200 hover:opacity-75 flex items-center justify-center",
        type === "primary" &&
          "text-white bg-[linear-gradient(to_right,#68d7ef_0%,#56b5f9_33%,#4ca2ff_100%)]",
        type === "gray" && "bg-[#DCE8F1] text-[#07253E]",
        type === "outline" &&
          "bg-[#ddf0fb] text-[#1683F8] border-[1px] border-solid border-[#1683F8]"
      )}
    >
      {children}
      {loading && <LoadingSVG className="ml-2 sm:ml-4" />}
    </button>
  );
}
