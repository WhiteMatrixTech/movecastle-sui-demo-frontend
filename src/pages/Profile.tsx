import castleDefaultImg from "@/assets/castle-default.png";
import { Button } from "@/components";
import { Link } from "react-router-dom";
import PlusSVG from "@/assets/plus.svg?react";
const mockCastles = [
  { id: 1, name: "Castle name1" },
  { id: 2, name: "Castle name2" },
  { id: 3, name: "Castle name3" },
  { id: 4, name: "Castle name4" },
  { id: 5, name: "Castle name5" },
  { id: 6, name: "Castle name6" },
];
export function ProfilePage() {
  return (
    <div className="mx-auto px-4 sm:px-[5.83%] pt-8 pb-4 sm:pt-16 sm:pb-8">
      <h1 className="text-lg sm:text-2xl font-semibold text-[#07253E] capitalize">
        This is a list of castles that you have cast:
      </h1>
      <ul className="flex flex-wrap gap-4 mt-6 sm:mt-7">
        <Link to="/create-castle">
          <li className="w-full flex-col mx-auto sm:mx-0 gap-y-4 max-w-[320px] sm:w-[320px] aspect-square flex items-center justify-center bg-white box-border border-[1px] border-solid border-[#4DA3FF] text-[#4DA3FF]">
            <PlusSVG />
            <span className=" font-medium text-xl">Create New Castle</span>
          </li>
        </Link>

        {mockCastles.map((castle) => (
          <li
            key={castle.id}
            className="w-full flex-col mx-auto sm:mx-0 max-w-[320px] sm:w-[320px] aspect-square flex items-center justify-center bg-white"
          >
            <img src={castleDefaultImg} width="38%" alt="castle default" />
            <span className="mt-3 mb-[30px] font-bold">{castle.name}</span>
            <Link to={`/castles/${castle.id}`} className="w-full">
              <Button type="primary" className="h-10 sm:h-12 w-[70%] mx-auto">
                Explore
              </Button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
