import {Card,CardHeader,CardTitle} from "./components/ui/card"
import { Badge } from "./components/ui/badge";
import { motion } from "framer-motion";
import Timer from "./Timer"
import clsx from "clsx";
interface Tarea {
    Titulo: string;
    Descripcion: string;
    Categoria: string;
    Prioridad: string; // Puede ser un string, pero usar enums mejora la claridad
    Fecha: string; // O puedes usar Date si prefieres trabajar con objetos de fecha
  }
  
  interface TareasProps {
    tareas: Tarea[];
    
  }
  const entrante = {
    hidden:{
        scale:0,
        opacity:0,
    },
    visible: (i: number) => ({
        scale: 1,
        opacity: 1,
        transition: {
          delay: i * 0.2, // Retraso incremental basado en el índice
          duration: 2,
          type: "spring",
          damping: 25,
          stiffness: 500,
        },
      }),
  }
const Tareas = ({tareas}:TareasProps)=>{
    return(
        <div className="col-span-2 col-start-2  "> 
        <Card className="" >
            <CardHeader>
                <CardTitle>Tareas HOY</CardTitle>
            </CardHeader>
            </Card>
          
                <ul className="space-y-2 mt-4">
                    {tareas.map((tarea,index)=>
                    (
                        <motion.li  custom={index} variants={entrante} initial="hidden" animate="visible" exit="hidden" key={index} className="flex flex-row justify-between p-3 bg-slate-700 rounded-md text-white font-bold">
                            <h2>{tarea.Titulo}</h2>
                            <Badge className={clsx(" text-center ", {
                                "bg-red-700 ": tarea.Prioridad=="Alta",
                                "bg-yellow-500 ": tarea.Prioridad=="Media",
                                "bg-slate-700 ": tarea.Prioridad=="Baja",

                            })}>{tarea.Prioridad}</Badge>
                            

                        </motion.li>
                    )
                    )}
                   
                </ul>
            <Timer></Timer>
        
        </div>
        
    );
};
export default Tareas
