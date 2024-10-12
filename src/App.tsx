
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
  
   
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
const filteredTareas = selectedDate

    ? tareasData.filter((tarea) => tarea.Fecha === selectedDate)
    : tareasData;

const handleDateSelect = (startDate: Date) => {

  const selectedFormattedDate = startDate.toISOString().split('T')[0]; // Formatea la fecha como 'YYYY-MM-DD'
  setSelectedDate(selectedFormattedDate);
  console.log(selectedDate)
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
        <div className={`grid mx-4 my-4 md:space-x-4 ${filteredTareas.length === 0 ? 'grid-cols-4 mx-8' : 'grid-cols-6'}`}>
          {filteredTareas.length > 0 && (
          
            <Tareas tareas={filteredTareas} />
          )}
          <div className={`${filteredTareas.length === 0 ? 'col-span-full' : 'col-span-4 col-start-3'}`}>
            <Calendar events={[{date:subDays(new Date(),6),title:"sexo matutino",description:"sexo deverdad"}]} onDateSelect={handleDateSelect} />
          </div>
        </div>
     
        
        
      </div>
      </>
    
  )
}

export default App
