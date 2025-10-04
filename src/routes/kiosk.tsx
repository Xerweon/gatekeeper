import KioskContainer from "@/components/kiosk/KioskContainer";
import TitleBar from "@/components/topbar/title-bar";
import { useAuthInit } from "@/hooks/useAuthInit";


const Kiosk = () => {
  const { user } = useAuthInit();
    
  return (
    <div className="h-screen flex flex-col ">
      <header className="flex-none">
        <TitleBar />
      </header>

    
      <main className="flex-1 overflow-auto bg-zinc-900">
        <KioskContainer user={user} />
      </main>

      <footer>
        <div className="border-t border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="text-xs text-zinc-500">Last updated: {new Date().toLocaleTimeString()}</div>
            <a
              href="#"
              className="text-xs text-zinc-500 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-1"
            >
              <span>Need help? Contact IT support</span>
            </a>
          </div>
        </div>
      </div>
      </footer>
    </div>
  );
};

export default Kiosk;
