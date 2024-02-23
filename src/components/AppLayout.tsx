import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <>
      <Header />
      <main className="bg-[#eaf4fa] min-h-[calc(100vh_-_72px)]">
        <Outlet />
      </main>
    </>
  );
}
