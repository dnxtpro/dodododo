import { Card, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "./lib/utils";
import AuthService from "./services/user.service";
import { Button } from "./components/ui/button";
import { ChevronDown, Plus } from "lucide-react";
import { Input } from "./components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from 'date-fns'
import { Textarea } from "./components/ui/textarea";
import eventService from "./services/event.service";
import toast from "react-hot-toast";

interface Tarea {
    Titulo: string;
    Descripcion: string;
    Categoria: Category;
    Prioridad: string;
    Fecha: string;
    Hecho:boolean;
}
type Priority = 'low' | 'medium' | 'high'

interface TareasProps {
    tareas: Tarea[];
}

interface Category {

    id: number;
    name: string;
    color: string;
}
const Tareas = ({ tareas }: TareasProps) => {
    const [listaTareas, setListaTareas] = useState(tareas);
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isFormExpanded, setIsFormExpanded] = useState(false);
    const [newTask, setNewTask] = useState<Tarea>({
        Titulo: "",
        Descripcion: "",
        Categoria: { id: 0, name: "", color: "" },
        Prioridad: "media",
        Fecha: format(new Date(), 'dd-MM-yyyy'),
        Hecho:true
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTasks = [...listaTareas, newTask];

        setListaTareas(updatedTasks); 
        enviar(newTask);
        setNewTask({
            Titulo: "",
            Descripcion: "",
            Categoria:{ id: 0, name: "", color: "" },
            Prioridad: "media",
            Fecha: format(new Date(), 'dd-MM-yyyy'),
            Hecho:true,
        }); // Actualiza el estado con la nueva lista de tareas
        setIsFormExpanded(false); // Cierra el formulario
    };
    const enviar = async (tarea:Tarea) => {
        const response = await eventService.addEvent(tarea);
        if (response) {
          console.log(response.data)
          toast.success("Categoria" + response.data.name + ",creada correctamente")
          recibirEvento();
        }
        else toast.error("Algo ha ido mal")
    
      }
    const recibir = async () => {
        try {
            const response = await AuthService.getCategory();
            const data = response.data; // Accede a la propiedad `data` de la respuesta de Axios
            console.log(data)
            const formattedCategories: Category[] = data.map((cat: any) => ({
                id: cat.id,
                name: cat.name,
                color: cat.color,
            }));
            setCategories(formattedCategories); // Actualiza el estado con las categorías formateadas
        } catch (error) {
            console.error('Error obteniendo las categorías', error);
        }
    };
    const recibirEvento = async () => {
        try {
            tareas = await eventService.getTasks();
            setListaTareas(tareas)
            console.log('Tareas obtenidas:', tareas);
          } catch (error) {
            console.error('Error al obtener las tareas:', error);
          }
    };
    const dayPickerRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        recibir();
        recibirEvento();
        if (dayPickerRef.current) {
            dayPickerRef.current.focus();
        }// Llamamos a la función recibir cuando se monta el componente
    }, []);


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

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        const draggedIndex = parseInt(e.dataTransfer.getData("taskIndex"));
        if (draggedIndex !== index) {
            const updatedTareas = swapItems(listaTareas, draggedIndex, index);
            setListaTareas(updatedTareas);

        }
        setDraggingIndex(null);
    };

    return (
        <div className="relative">
            <Card>
                <CardHeader>
                    <CardTitle>Tareas</CardTitle>

                </CardHeader>
            </Card>
            <motion.div
                initial={false}
                animate={{ height: isFormExpanded ? 'auto' : '60px' }}
                transition={{ duration: 0.3 }}
                className="fixed z-50 bottom-0 left-0 right-0 bg-orange-100 shadow-lg rounded-t-xl overflow-hidden "
            >
                <Button
                    variant="ghost"
                    className="w-full h-[60px] flex items-center justify-center text-lg font-semibold hover:bg-primary"
                    onClick={() => setIsFormExpanded(!isFormExpanded)}
                >
                    {isFormExpanded ? (
                        <>
                            <ChevronDown className="mr-2" />
                            Cerrar
                        </>
                    ) : (
                        <>
                            <Plus className="mr-2" />
                            Nueva Tarea
                        </>
                    )}
                </Button>
                <AnimatePresence>
                    {isFormExpanded && (
                        <motion.form
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="p-4 space-y-4"
                            onSubmit={handleSubmit}
                        >
                            <Input
                                placeholder="Título de la tarea"
                                value={newTask.Titulo}
                                onChange={(e) => setNewTask({ ...newTask, Titulo: e.target.value })}
                                required
                            />
                             <Textarea
                               
                                placeholder="Descripcion"
                                value={newTask.Descripcion}
                                onChange={(e) => setNewTask({ ...newTask, Descripcion: e.target.value })}
                               
                            />
                             <Input
                                type="date" // Añadido: input de tipo fecha
                                placeholder="Fecha (dd/MM/yyyy)"
                                value={newTask.Fecha}
                                onChange={(e) => setNewTask({ ...newTask, Fecha: e.target.value })}
                                required
                            />
                            

                            <Select
                                value={newTask.Categoria.name}
                                onValueChange={(value) => {
                                    const selectedCategory = categories.find(cat => cat.name === value);
                                    if (selectedCategory) {
                                        setNewTask({ ...newTask, Categoria: selectedCategory }); // Establece la categoría completa
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar categoría" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.name} value={category.name}>
                                            <div className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full mr-2`} style={{ backgroundColor: category.color }} />
                                                {category.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            <Select
                                value={newTask.Prioridad}
                                onValueChange={(value: Priority) => setNewTask({ ...newTask, Prioridad: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button type="submit" className="w-full">Agregar Tarea</Button>
                        </motion.form>)}
                </AnimatePresence>
            </motion.div>
            <div className="h-[60vh] pr-4">
                <ul className="space-y-2 mt-4">
                    {listaTareas.map((tarea, index) => (
                        <motion.div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>, index)} // Type assertion
                            onDragOver={(e) => handleDragOver(e as React.DragEvent<HTMLDivElement>, index)} // Type assertion
                            onDrop={(e) => handleDrop(e as React.DragEvent<HTMLDivElement>, index)} // Type assertion
                            className={cn(
                                "mb-4 p-4 rounded-lg shadow-md transition-all duration-300 cursor-grab border-r-8 border-b-8 border-spacing-4",
                                draggingIndex === index ? "bg-gray-300" : "bg-white"
                            )}
                            animate={{
                                opacity: draggingIndex === index ? 0.5 : 1, // Reduce opacidad al arrastrar
                                y: draggingIndex === index ? 0 : undefined,
                                transition: { type: "tween", ease: "linear", duration: 0.1 }
                            }}
                            style={{ zIndex: draggingIndex === index ? 100 : 1,borderColor:tarea.Categoria.color }}
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
                                <Badge variant="outline" style={{borderColor:tarea.Categoria.color}}>{tarea.Categoria.name}</Badge>
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
