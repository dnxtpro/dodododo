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

import { Label } from "./components/ui/label"
import DatePicker from 'react-datepicker'
import { ClockIcon, Check, X } from 'lucide-react'


import 'react-datepicker/dist/react-datepicker.css'
import './custom.css'

interface Tarea {
    Titulo: string;
    Descripcion: string;
    Categoria: Category;
    Prioridad: string;
    Fecha_Inicio: Date;
    Hecho: boolean;
    FullDay: boolean;
    Fecha_Fin: Date;


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
    const [isAllDay, setIsAllDay] = useState(false);
    const [newTask, setNewTask] = useState<Tarea>({
        Titulo: "",
        Descripcion: "",
        Categoria: { id: 0, name: "", color: "" },
        Prioridad: "media",
        Fecha_Inicio: new Date(),
        Fecha_Fin: new Date(),
        FullDay: true,
        Hecho: false
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const updatedTasks = [...listaTareas, newTask];

        setListaTareas(updatedTasks);
        enviar(newTask);
        setNewTask({
            Titulo: "",
            Descripcion: "",
            Categoria: { id: 0, name: "", color: "" },
            Prioridad: "media",
            Fecha_Inicio: new Date(),
            Fecha_Fin: new Date(),
            FullDay: true,
            Hecho: false
        }); // Actualiza el estado con la nueva lista de tareas
        setIsFormExpanded(false); // Cierra el formulario
    };
    const handleCheckboxChange = (index: number) => {
        const newTasks = [...listaTareas];
        newTasks[index].Hecho = !newTasks[index].Hecho;
        setListaTareas(newTasks);
    };
    const enviar = async (tarea: Tarea) => {
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
            tareas = tareas.map(tarea => ({
                ...tarea,
                Fecha_Inicio: new Date(tarea.Fecha_Inicio),
                Fecha_Fin: new Date(tarea.Fecha_Fin)
            }));
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
    const toggleVariants = {
        day: { backgroundColor: "hsl(0, 0%, 60%)", rotate: 0 },
        night: { backgroundColor: "rgb(35, 90, 55)", rotate: 180 }
    }



    const timePickerVariants = {
        enabled: { opacity: 1, filter: "grayscale(0%)" },
        disabled: { opacity: 0.5, filter: "grayscale(100%)" }
      }

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
                className="fixed z-50 bottom-0 left-0 right-0 bg-accent shadow-lg rounded-t-xl overflow-hidden backdrop-blur-md "
            >
                <Button
                    variant="ghost"
                    className="w-full h-[60px] flex items-center justify-center text-lg font-semibold  "
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
                            className="p-4 space-y-4 grid grid-cols-3 gap-4"
                            onSubmit={handleSubmit}
                        >
                            <Input
                                placeholder="Título de la tarea"
                                value={newTask.Titulo}
                                onChange={(e) => setNewTask({ ...newTask, Titulo: e.target.value })}
                                required
                                className="col-span-3 bg-white"
                            />
                            <Textarea

                                placeholder="Descripcion"
                                value={newTask.Descripcion}
                                onChange={(e) => setNewTask({ ...newTask, Descripcion: e.target.value })}
                                className="col-span-3 bg-white"
                            />
                            <div className="  flex flex-col h-[20vh]">
                                <div className="flex flex-col text-center justify-center space-y-4">
                                    <Label htmlFor="all-day-toggle">El evento dura todo el dia?</Label>
                                    <motion.button
                                        type="button"
                                        role="switch"
                                        aria-checked={isAllDay}
                                        onClick={() => setIsAllDay(!isAllDay)}
                                        className=" self-center place-content-center relative inline-flex flex-shrink-0 h-10 w-20 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 "
                                        animate={isAllDay ? "night" : "day"}
                                        variants={toggleVariants}
                                    >
                                        <span className="sr-only">Use full day</span>
                                        <motion.span
                                            className="pointer-events-none absolute left-0 inline-block h-9 w-9 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out"
                                            animate={{ x: isAllDay ? 40 : 0 }}
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                        />
                                        <div className="absolute inset-0 overflow-hidden rounded-full">
                                            <AnimatePresence initial={false}>
                                                {!isAllDay && (
                                                    <motion.div
                                                        key="sun"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        <X className="h-6 w-6 text-gray-700" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <AnimatePresence initial={false}>
                                                {isAllDay && (
                                                    <motion.div
                                                        key="moon"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.5 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute inset-0 flex items-center justify-center"
                                                    >
                                                        <Check className="h-6 w-6 text-green-400 rotate-180" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                    </motion.button>

                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2" >
                                        <label htmlFor="Fecha_Inicio" className="block text-sm font-medium text-gray-700 mb-2">
                                            Fecha
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={newTask.Fecha_Inicio}
                                                onChange={(date: Date | null) => {
                                                    if (date) {
                                                        setNewTask({ ...newTask, Fecha_Inicio: date });
                                                    }
                                                }}
                                                dateFormat="dd/MM/yyyy"
                                                className="block w-full pl-10 pr-3 py-2 border-2 border-purple-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                                                placeholderText="Select start time"
                                                calendarClassName="bg-white shadow-lg rounded-lg border-2 border-purple-200"
                                                wrapperClassName="w-full"
                                                popperClassName="custom-popper"
                                                dayClassName={date =>
                                                    date.getDate() === new Date().getDate()
                                                        ? "bg-purple-100 rounded-full text-purple-800 font-bold"
                                                        : "text-gray-700"
                                                }
                                            />
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <CalendarIcon className="h-5 w-5 text-purple-500" />
                                            </div>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        
                                            <motion.div
                                                animate={isAllDay ? "disabled" : "enabled"}
                                                variants={timePickerVariants}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                                className="flex-row flex space-x-4 ">

                                                <div className="mx-auto">
                                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                        Start Time
                                                    </label>
                                                    <div className="relative ">
                                                        <DatePicker
                                                            selected={newTask.Fecha_Inicio ? new Date(newTask.Fecha_Inicio) : null} // Muestra la Fecha_Inicio
                                                            onChange={(time: Date | null) => {
                                                                if (time && newTask.Fecha_Inicio) {
                                                                    const newFechaInicio = new Date(newTask.Fecha_Inicio); // Crea una nueva fecha a partir de la Fecha_Inicio
                                                                    newFechaInicio.setHours(time.getHours(), time.getMinutes()); // Establece las horas y minutos
                                                                    setNewTask({ ...newTask, Fecha_Inicio: newFechaInicio }); // Actualiza Fecha_Inicio
                                                                }
                                                            }}
                                                            showTimeSelect
                                                            showTimeSelectOnly
                                                            timeIntervals={15}
                                                            timeCaption="Start Time"
                                                            dateFormat="h:mm aa"
                                                            className="block w-full pl-10 pr-3 py-2 border-2 border-purple-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                                                            placeholderText="Select end time"
                                                            disabled={isAllDay}
                                                        />
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <ClockIcon className="h-5 w-5 text-purple-500" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mx-auto"> 
                                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                                                        End Time
                                                    </label>
                                                    <div className="relative ">
                                                        <DatePicker
                                                            selected={newTask.Fecha_Fin ? new Date(newTask.Fecha_Fin) : null} // Muestra la fecha seleccionada
                                                            onChange={(time: Date | null) => {
                                                                if (time) {
                                                                    // Aquí puedes calcular y actualizar la Fecha_Fin
                                                                    const fechaInicio = newTask.Fecha_Inicio;
                                                                    if (fechaInicio) {
                                                                        const newFechaFin = new Date(fechaInicio); // Crea una nueva fecha a partir de la Fecha_Inicio
                                                                        newFechaFin.setHours(time.getHours(), time.getMinutes()); // Establece la hora de fin
                                                                        setNewTask({ ...newTask, Fecha_Fin: newFechaFin }); // Actualiza Fecha_Fin
                                                                    }
                                                                }
                                                            }}
                                                            showTimeSelect
                                                            showTimeSelectOnly
                                                            timeIntervals={15}
                                                            timeCaption="End Time"
                                                            dateFormat="h:mm aa"
                                                            className="block w-full pl-10 pr-3 py-2 border-2 border-purple-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent sm:text-sm"
                                                            placeholderText="Select end time"
                                                            disabled={isAllDay}
                                                        // Otras propiedades...
                                                        />
                                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                            <ClockIcon className="h-5 w-5 text-purple-500" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>

                                    
                                    </AnimatePresence>
                                </div>

                            </div>



                            <Select
                                value={newTask.Categoria.name}
                                onValueChange={(value) => {
                                    const selectedCategory = categories.find(cat => cat.name === value);
                                    if (selectedCategory) {
                                        setNewTask({ ...newTask, Categoria: selectedCategory }); // Establece la categoría completa
                                    }
                                }}
                            >
                                <SelectTrigger className="bg-white">
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
                                <SelectTrigger className="bg-white">
                                    <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baja</SelectItem>
                                    <SelectItem value="medium">Media</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                </SelectContent>
                            </Select>

                            <div className="mb-4 col-start-2 col-span-2 mx-10  p-4 rounded-lg transition-all duration-300 border-r-8 border-b-8 border-spacing-4 cristalizado shadow-inner"
                                style={{ borderColor: newTask.Categoria.color }}>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">

                                        <h3 className={cn("text-lg font-semibold", newTask.Hecho ? "line-through" : "")}>{newTask.Titulo}</h3>
                                        <p className={cn("mt-2 text-sm", newTask.Hecho ? "text-gray-500 line-through"
                                            : "text-gray-600 dark:text-gray-300")}>{newTask.Descripcion}</p>
                                    </div>
                                    <Badge className={cn("text-xs font-medium", getPrioridadColor(newTask.Prioridad))}>
                                        {newTask.Prioridad}
                                    </Badge>
                                </div>

                                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <CalendarIcon className="mr-1 h-4 w-4" />
                                        {format(newTask.Fecha_Inicio, 'dd-MM-yyyy')}
                                    </span>
                                    <Badge variant="outline" style={{ borderColor: newTask.Categoria.color }}>{newTask.Categoria.name}</Badge>
                                </div>
                            </div>
                            <Button type="submit" className="col-start-2">Agregar Tarea</Button>
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
                                "mb-4 p-4 rounded-lg transition-all duration-300 cursor-grab border-r-8 border-b-8 border-spacing-4 cristalizado shadow-inner",
                                draggingIndex === index ? "bg-gray-300" : "bg-white",
                                tarea.Hecho ? "cristalizadooff line-through border-0" : "" // Añadir clase condicionalmente
                            )}
                            animate={{
                                opacity: draggingIndex === index ? 0.5 : 1, // Reduce opacidad al arrastrar
                                y: draggingIndex === index ? 0 : undefined,
                                transition: { type: "tween", ease: "linear", duration: 0.1 }
                            }}
                            style={{ zIndex: draggingIndex === index ? 100 : 1, borderColor: tarea.Categoria.color }}
                        >

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={tarea.Hecho}
                                        onChange={() => handleCheckboxChange(index)}
                                        className="mr-2 cursor-pointer"
                                    />
                                    <h3 className={cn("text-lg font-semibold", tarea.Hecho ? "line-through" : "")}>{tarea.Titulo}</h3>
                                    <p className={cn("mt-2 text-sm", tarea.Hecho ? "text-gray-500 line-through" : "text-gray-600 dark:text-gray-300")}>{tarea.Descripcion}</p>
                                </div>
                                <Badge className={cn("text-xs font-medium", getPrioridadColor(tarea.Prioridad))}>
                                    {tarea.Prioridad}
                                </Badge>
                            </div>

                            <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                                <span className="flex items-center">
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    {format(tarea.Fecha_Inicio, 'dd-MM-yyyy')}
                                </span>
                                <Badge variant="outline" style={{ borderColor: tarea.Categoria.color }}>{tarea.Categoria.name}</Badge>
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
