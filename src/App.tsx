
import Login from './cmpnt/auth/Login'
import Register from './cmpnt/auth/Register'
import Profile from './cmpnt/auth/Profile'
import Navbar from "./NavBar"
import Calendar from "./Calendar"
import { subDays } from "date-fns"
import { useState } from 'react'
import { Button } from './components/ui/button'

import AuthService from "./services/user.service";
import {Routes,Route} from "react-router-dom";
import Tasks from './Tasks'


function App() {
  
   
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

 

  const enviar = ()=>{
    AuthService.addCategory("hola", "sexo");
  }
// Manejador para cambiar la fecha seleccionada desde el calendario

const handleDateSelect = (startDate: Date) => {

  const selectedFormattedDate = startDate.toISOString().split('T')[0]; // Formatea la fecha como 'YYYY-MM-DD'
  setSelectedDate(selectedFormattedDate);
  console.log(selectedDate)
};
  return (
    <>
      <div className="w-full flex flex-col">
        <Navbar />
        <Button onClick={enviar} ></Button>
        <div className="">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/task" element={<Tasks />} />
            <Route path="/calendar" element={<Calendar events={[{date:subDays(new Date(),6),title:"sexo matutino",description:"sexo deverdad"}]} onDateSelect={handleDateSelect} />} />

          </Routes>
        </div>
     
        
      </div>
      </>
    
  )
}

export default App
