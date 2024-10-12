import { Card, CardHeader, CardTitle } from "./components/ui/card"
import { Badge } from "./components/ui/badge";
import { motion } from "framer-motion";
import Timer from "./Timer";
import { CalendarIcon } from "lucide-react";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "./lib/utils";
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
    hidden: {
        scale: 0,
        opacity: 0,
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
const Tareas = ({ tareas }: TareasProps) => {

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'Alta': return 'bg-red-500 hover:bg-red-600';
            case 'Media': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'Baja': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };


    return (
        <div className=" col-span-2">
            <Card className="" >
                <CardHeader>
                    <CardTitle>Tareas HOY</CardTitle>
                </CardHeader>
            </Card>
            <ScrollArea className="h-[60vh] pr-4">
                <ul className="space-y-2 mt-4">
                    {tareas.map((tarea, index) =>
                    (
                        <motion.div custom={index} variants={entrante} initial="hidden" animate="visible" exit="hidden" key={index} className={cn(
                            "mb-4 p-4 rounded-lg shadow-md transition-all duration-300"

                        )}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">

                                    <h3 className={cn(
                                        "text-lg font-semibold",
                                    )}>
                                        {tarea.Titulo}
                                    </h3>
                                </div>
                                <Badge className={cn("text-xs font-medium", getPrioridadColor(tarea.Prioridad))}>
                                    {tarea.Prioridad}
                                </Badge>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{tarea.Descripcion}</p>
                            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center">
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    {tarea.Fecha}
                                </span>
                                <Badge variant="outline">{tarea.Categoria}</Badge>
                            </div>

                        </motion.div>
                    )
                    )}

                </ul>
            </ScrollArea>
            <Timer></Timer>

        </div>

    );
};
export default Tareas
