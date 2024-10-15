
import Login from './cmpnt/auth/Login'
import Register from './cmpnt/auth/Register'
import Profile from './cmpnt/auth/Profile'
import Navbar from "./NavBar"
import Calendar from "./Calendar"
import { subDays } from "date-fns"
import { useState } from 'react'

import { Routes, Route, useLocation } from "react-router-dom";
import Tasks from './Tasks'
import Hero from './Hero'
import { motion ,AnimatePresence} from 'framer-motion'
import { Toaster } from 'react-hot-toast';


function App() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const handleDateSelect = (startDate: Date) => {

    const selectedFormattedDate = startDate.toISOString().split('T')[0]; // Formatea la fecha como 'YYYY-MM-DD'
    setSelectedDate(selectedFormattedDate);
    console.log(selectedDate)
  };

  const location = useLocation();
  const pageVariants = {
    initial: {
      x: "100vw", // La nueva página entra desde la derecha
      opacity: 0,
    },
    animate: {
      x: 0, // La página llega al centro
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      x: "-100vw", // La página actual sale hacia la izquierda
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };
  return (
    <>
      <div className="w-full flex flex-col">
        <Navbar />
      <Toaster/>
        <div className="">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/register"           element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Register />
            </motion.div>
          } />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/"  element={
            <motion.div
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Hero/>
            </motion.div>
          } />
            <Route path="/task" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar events={[{ date: subDays(new Date(), 6), title: "sexo matutino", description: "sexo deverdad" }]} onDateSelect={handleDateSelect} />} />

          </Routes>
          </AnimatePresence>
        </div>


      </div>
    </>

  )
}

export default App
