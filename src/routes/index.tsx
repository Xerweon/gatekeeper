import TitleBar from "@/components/topbar/title-bar"
import EntrepreneurAuthForm from "@/components/auth/EntrepreneurAuthForm"
import { motion } from "framer-motion"

function Index() {

  return (
     <div className="min-h-screen flex flex-col inter-300 bg-gradient-to-b from-zinc-900 to-zinc-950">
      <header>
        <TitleBar />
      </header>
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-8">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative bg-zinc-800/80 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-zinc-700/50">
        
            <h2 className="text-2xl font-semibold text-center text-white mt-4 mb-6">Entrepreneur Login</h2>

            <p className="text-zinc-400 text-center mb-8 text-sm">
              Authenticate as an entrepreneur to register this system as a recognized center device
            </p>

            <EntrepreneurAuthForm />

            <div className="mt-6 text-center">
              <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                Need help? Contact support
              </a>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-zinc-900/80 backdrop-blur-sm border-t border-zinc-800/50">
        <div className="container mx-auto flex sm:flex-row justify-center items-center p-2">
      
          <div>
            <p>
             <span className="text-zinc-500 text-sm">© ${new Date().getFullYear()} Cirranex Tech Pvt. Ltd.</span>
            </p>
          </div>
          
        </div>
      </footer>
    </div>
  )
}

export default Index;
