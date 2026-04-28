import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileTabBar } from "./MobileTabBar";

export const AppLayout = () => {
  const { pathname } = useLocation();
  // Mood page is its own immersive screen
  const minimal = pathname === "/mood";

  if (minimal) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="flex w-full">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col md:pl-60">
          <Topbar />
          <main key={pathname} className="flex-1 animate-fade-in pb-24 md:pb-12">
            <Outlet />
          </main>
        </div>
      </div>
      <MobileTabBar />
    </div>
  );
};