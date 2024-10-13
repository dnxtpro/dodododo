import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { motion } from "framer-motion";
import Timer from "./Timer";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "./lib/utils";

interface Tarea {
    Titulo: string;
    Descripcion: string;
    Categoria: string;
    Prioridad: string;
    Fecha: string;
}

interface TareasProps {
    tareas: Tarea[];
}

const Tareas = ({ tareas }: TareasProps) => {
    const [listaTareas, setListaTareas] = useState(tareas);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad.toLowerCase()) {
            case 'alta': return 'bg-red-500 hover:bg-red-600';
            case 'media': return 'bg-yellow-500 hover:bg-yellow-600';
            case 'baja': return 'bg-blue-500 hover:bg-blue-600';
            default: return 'bg-gray-500 hover:bg-gray-600';
        }
    };

    const swapItems = (arr: Tarea[], fromIndex: number, toIndex: number) => {
        const updatedArr = [...arr];
        const [movedItem] = updatedArr.splice(fromIndex, 1);
        updatedArr.splice(toIndex, 0, movedItem);
        return updatedArr;
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.setData("taskIndex", index.toString());
        setDraggingIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("taskIndex"));
        if (draggedIndex !== index) {
            setDraggingIndex(index);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>,index:number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("taskIndex"));
        if (draggedIndex !== index) {
            const updatedTareas = swapItems(listaTareas, draggedIndex, index);
            setListaTareas(updatedTareas);
        }
        setDraggingIndex(null);
    };

    return (
        <div className="col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Tareas</CardTitle>
                    <Timer/>
                </CardHeader>
            </Card>
            <div className="h-[60vh] pr-4">
                <ul className="space-y-2 mt-4">
                    {listaTareas.map((tarea, index) => (
                        <motion.div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, index)} // Type assertion
                            onDragOver={(e) => handleDragOver(e as React.DragEvent<HTMLDivElement>, index)} // Type assertion
                            onDrop={(e) => handleDrop(e as React.DragEvent<HTMLDivElement>,index)} // Type assertion
                            className={cn(
                                "mb-4 p-4 rounded-lg shadow-md transition-all duration-300 cursor-grab",
                                draggingIndex === index ? "bg-gray-300" : "bg-white"
                            )}
                            animate={{
                                opacity: draggingIndex === index ? 0.5 : 1, // Reduce opacidad al arrastrar
                                y: draggingIndex === index ? 0 : undefined,
                                transition: { type: "tween", ease: "linear", duration: 0.1 }
                            }}
                            style={{ zIndex: draggingIndex === index ? 100 : 1 }}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-lg font-semibold">{tarea.Titulo}</h3>
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
                    ))}
                    {/* Add placeholder for the dragging task */}
                    {draggingIndex !== null && (
                        <motion.div
                            key="placeholder"
                            className="mb-4 p-4 rounded-lg shadow-md bg-gray-300 opacity-50"
                            style={{ height: 'auto', zIndex: 50 }} // Match the height of the item
                            layout // Automatically adjusts the layout
                        />
                    )}
                </ul>
            </div>
            
        </div>
    );
};

export default Tareas;
