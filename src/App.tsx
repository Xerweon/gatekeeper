
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./routes"
import { useEffect } from "react"
import RegisterDevice from "./routes/register-device"
import { clearAuth } from "./lib/auth"
import Kiosk from "./routes/kiosk"
function App() {

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.altKey && e.key === 'r') 
      clearAuth().then(() => location.reload());  
    }
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [])
  

  return (
   <Router>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path='/register-device' element={<RegisterDevice />} />
      <Route path='/kiosk' element={<Kiosk />} />
    </Routes>
   </Router>
  )
}

export default App
