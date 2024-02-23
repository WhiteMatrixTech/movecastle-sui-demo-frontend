import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <>
      <header>header</header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
