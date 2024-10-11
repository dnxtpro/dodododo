
import Login from './cmpnt/auth/Login'
import Register from './cmpnt/auth/Register'
import Profile from './cmpnt/auth/Profile'
import Navbar from "./NavBar"
import Calendar from "./Calendar"
import { subDays } from "date-fns"
import Tareas from './Tareas'
import { useState } from 'react'

import {Routes,Route} from "react-router-dom"


function App() {
  
  const [startDate, setStartDate] = useState<Date | null>(null); // Fecha de inicio del rango
  const [endDate, setEndDate] = useState<Date | null>(null);  

  const tareasData = [
    {
      Titulo: 'Comprar comestibles',
      Descripcion: 'Leche, huevos, pan y verduras',
      Categoria: 'Casa',
      Prioridad: 'Alta',
      Fecha: '2024-10-15',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-17',
    },
    {
      Titulo: 'Cosas Que No Acaban',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-12-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-15',
    },
    // Añade más tareas si es necesario
  ];

// Manejador para cambiar la fecha seleccionada desde el calendario
const filteredTareas = startDate
? tareasData.filter((tarea) => {
    const tareaFecha = new Date(tarea.Fecha);
    return endDate ? (tareaFecha >= startDate && tareaFecha <= endDate) : tareaFecha >= startDate;
  })
: tareasData;
// Manejador para cambiar la fecha seleccionada desde el calendario
const handleDateSelect = (startDate: Date, endDate?: Date) => {
  setStartDate(startDate);
  if (endDate) {
    setEndDate(endDate);
  } else {
    setEndDate(startDate); // Para manejar un solo día
  }
};
  return (
    <>
      <div className="w-full flex flex-col">
        <Navbar />
        <div className="mx-auto justify-center flex">
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
       <div className="grid grid-cols-6 space-x-6 mx-4 my-4">
       <Tareas tareas={filteredTareas}/>
       <Calendar   events={[{date:subDays(new Date(),6),title:"sexo matutino",description:"sexo deverdad"}]} onDateSelect={handleDateSelect}         />
        
        
        
       
       </div>
     
        
        
      </div>
      </>
    
  )
}

export default App
