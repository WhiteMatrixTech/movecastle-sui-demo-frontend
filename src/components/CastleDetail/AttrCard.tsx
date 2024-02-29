import { ReactNode } from "react";
import cn from "classnames";

interface IAttrCardProps {
  className?: string;
  title: string;
  data: Record<string, ReactNode>;
}
export function AttrCard(props: IAttrCardProps) {
  const { className, title, data } = props;
  return (
    <div className={cn(className, "bg-[#fff] w-full p-6")}>
      <h3 className="text-[#07253E] text-base font-bold">{title}</h3>
      <ul className="mt-4">
        {Object.keys(data).map((key, index) => {
          const element = data[key];
          const isLast = index === Object.keys(data).length - 1;
          return (
            <li
              key={key}
              className={cn(
                "flex flex-wrap items-center gap-[10px] justify-between px-0 py-[11px] sm:p-[11px]",
                !isLast && "border-b-[1px] border-solid border-b-[#d4dce5]"
              )}
            >
              <span className="text-[#686B6F] text-sm">{key}</span>
              <div className="text-sm text-[#07253E]">{element}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
