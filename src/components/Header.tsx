import LeftArrow from "@/assets/left-arrow.svg?react";

export function Header() {
  return (
    <header className="sticky text-white bg-[#001731] top-0 inset-x-0 h-[72px] px-[4.16vw] flex items-center justify-between">
      {/* left */}
      <a
        href="https://edu-develop-b702b03e93.chainide.com/courses/105/"
        className="flex items-center gap-x-[10px] text-white hover:text-[#C0CBDF] duration-200"
      >
        <LeftArrow />
        <span className="text-lg">Web3 Course 105 - Sui</span>
      </a>

      {/* right */}
      <div>right</div>
    </header>
  );
}
