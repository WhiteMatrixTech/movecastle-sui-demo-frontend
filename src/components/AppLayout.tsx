import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <>
      <Header />
      <main className="bg-[#eaf4fa] sm:min-h-[calc(100vh_-_72px)] min-h-[calc(100vh_-_64px)]">
        <Outlet />
      </main>
    </>
  );
}
