
import Login from './cmpnt/auth/Login'
import Register from './cmpnt/auth/Register'
import Profile from './cmpnt/auth/Profile'
import Navbar from "./NavBar"
import Calendar from "./Calendar"
import { subDays } from "date-fns"

import {Routes,Route} from "react-router-dom"


function App() {
 
 
 
  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="mx-auto justify-center flex">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <Calendar  events={[{date:subDays(new Date(),6),title:"sexo matutino",description:"sexo deverdad"}]} 
       
       />
       
        
      </div>
      </>
    
  )
}

export default App
