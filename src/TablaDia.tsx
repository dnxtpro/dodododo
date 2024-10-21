import {
    startOfWeek,
    addDays,
    format,
    setMinutes,
    setHours,
    isWithinInterval,
    differenceInMinutes,
    isToday,
    isSameDay,
    isAfter,
    isBefore,
    startOfDay,
} from "date-fns";
import { useState, useEffect, useRef } from "react";
import eventService from "./services/event.service";
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AuthService from "./services/user.service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import toast from "react-hot-toast";
interface Tarea {
    Id: number;
    Titulo: string;
    Descripcion: string;
    Categoria: Category;
    Prioridad: string;
    Fecha_Inicio: Date;
    Hecho: boolean;
    FullDay: boolean;
    Fecha_Fin: Date;
    Tipo:string;
}
interface Category {

    id: number;
    name: string;
    color: string;
}

const getWeekDays = (startDate: Date) => {
    const startOfTheWeek = startOfWeek(startDate, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
        days.push(addDays(startOfTheWeek, i));
    }
    return days;
};

const getTimeSlots = () => {
    const slots = [];
    let baseTime = setHours(setMinutes(new Date(), 0), 0);

    for (let i = 0; i < 24; i++) {
        const fullHour = setHours(baseTime, i);
        const halfHour = setMinutes(fullHour, 30);
        slots.push({ start: fullHour, end: halfHour });
        slots.push({ start: halfHour, end: setMinutes(halfHour, 60) });
    }

    return slots;
};

const TablaDia = () => {
    const [events, setEvents] = useState<Tarea[]>([]);
    const timeContainerRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState(() => {
        
        return new Date(2024, 9, 22) // October 22, 2024 (month is 0-indexed)
    })
    const [currentTime, setCurrentTime] = useState(new Date());
    const weekDays = getWeekDays(currentDate);
    const timeSlots = getTimeSlots();
    const [direction, setDirection] = useState(0);
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState<{ day: Date } | null>(null)
    const [dragEnd, setDragEnd] = useState<{ day: Date } | null>(null)
    const [showForm, setShowForm] = useState(false)
    const [newTask, setNewTask] = useState<Tarea>({
        Id:0,
        Titulo: "",
        Descripcion: "",
        Categoria: { id: 0, name: "", color: "" },
        Prioridad: "",
        Fecha_Inicio: new Date(),
        Fecha_Fin: new Date(),
        FullDay: true,
        Hecho: false,
        Tipo: "Evento",
    });
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
    const [categories, setCategories] = useState<Category[]>([]);

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
    const enviar = async (tarea: Tarea) => {
        const response = await eventService.addEvent(tarea);
        if (response) {
            console.log(response.data)
            toast.success("Categoria" + response.data.name + ",creada correctamente")
            recibirEvento();
        }
        else toast.error("Algo ha ido mal")

    }

    const handleCreateEvent = (e: React.FormEvent) => {
        handleCloseForm()
        e.preventDefault()
        console.log(newTask.Categoria)
        if (newTask.Titulo && newTask.Fecha_Inicio && newTask.Fecha_Fin) {
          const createdEvent: Tarea = {
            Id: 0,
            Titulo: newTask.Titulo,
            Descripcion: newTask.Descripcion || "",
            Categoria: { id: newTask.Categoria.id, name: newTask.Categoria.name, color: newTask.Categoria.color },
            Prioridad: newTask.Prioridad || "Media",
            Fecha_Inicio: newTask.Fecha_Inicio,
            Fecha_Fin: newTask.Fecha_Fin,
            Hecho: false,
            FullDay: false,
            Tipo:"Evento"
          }
          console.log(createdEvent)
          enviar(createdEvent)
          
          setShowForm(false)
        }
      }
    
    useEffect(() => {
        recibir();

    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Actualiza cada wow

        return () => clearInterval(interval);

    }, []);
    useEffect(() => {
        const scrollToCurrentTime = () => {
          if (timeContainerRef.current) {
            const currentHour = currentTime.getHours()
            const currentMinute = currentTime.getMinutes()
            const totalMinutes = currentHour * 60 + currentMinute
            const scrollPosition = (totalMinutes / 1440) * timeContainerRef.current.scrollHeight
            timeContainerRef.current.scrollTop = scrollPosition - timeContainerRef.current.clientHeight / 2
          }
        }
    
        scrollToCurrentTime()
      }, [currentTime])


    const calculateLinePosition = (now: Date) => {
        const minutes = now.getMinutes();
        return (minutes / 60) * 100;
    };

    const linePosition = calculateLinePosition(currentTime);

    // Ejemplo de eventos

    const recibirEvento = async () => {
        try {
            const tareas = await eventService.getTasks();
            const formattedTareas = tareas.map((tarea: Tarea) => ({
                ...tarea,
                Fecha_Inicio: new Date(tarea.Fecha_Inicio),
                Fecha_Fin: new Date(tarea.Fecha_Fin)
            }));
            setEvents(formattedTareas);
            console.log('Tareas obtenidas:', formattedTareas);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
        }
    };

    useEffect(() => {
        recibirEvento();
    }, [])

    const lightenColor = (color: string, percent: number) => {
        const num = parseInt(color.replace("#", ""), 16),
            amt = Math.round(2.55 * percent),
            R = (num >> 16) + amt,
            G = ((num >> 8) & 0x00ff) + amt,
            B = (num & 0x0000ff) + amt;
        return (
            "#" +
            (0x1000000 +
                (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
                (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
                (B < 255 ? (B < 1 ? 0 : B) : 255))
                .toString(16)
                .slice(1)
        );
    };
    const handlePrevWeek = () => {
        setDirection(-1)
        setCurrentDate((prev) => addDays(prev, -7))
    }

    const handleNextWeek = () => {
        setDirection(1)
        setCurrentDate((prev) => addDays(prev, 7))
    }
    const headerVariants = {
        initial: (direction: number) => ({
            x: direction * 50,
            opacity: 0,
        }),
        animate: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        },
        exit: (direction: number) => ({
            x: direction * -50,
            opacity: 0,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
            },
        }),
    }
    const handleDragStart = (day: Date) => {
        console.log(day, 'start')
        setIsDragging(true)
        if (day) { setDragStart({ day }) }


    }

    const handleDragMove = (day: Date) => {

        if (isDragging) {
            setDragEnd({ day })
            console.log(format(day, "HH:mm"))
        }
    }
    const handleDragEnd = (e: React.MouseEvent) => {
        if (isDragging && dragStart && dragEnd) {
            console.log(dragStart, dragEnd, "dragging")
            setIsDragging(false)
            const startDate = new Date(dragStart.day)


            const endDate = new Date(dragEnd.day)
            console.log(format(startDate, "HH:mm"), format(endDate, "HH:mm"))

            if (endDate < startDate) {
                console.log(endDate, startDate, "acaba empieza")
            }
            setNewTask((prev) => ({
                ...prev,
                Fecha_Inicio: startDate,
                Fecha_Fin: endDate,
              }));

              let x = e.clientX + window.scrollX;
              let y = e.clientY + window.scrollY;
              const menuWidth = 320; // Ancho del menú (ajusta según sea necesario)
              const menuHeight = 400; // Alto del menú (ajusta según sea necesario)
              const viewportWidth = window.innerWidth;
              const viewportHeight = window.innerHeight;

              if (x + menuWidth > viewportWidth) {
                x = viewportWidth - menuWidth;
              }
              if (x < 0) {
                x = 0;
              }
              if (y + menuHeight > viewportHeight) {
                console.log(y)
                y = viewportHeight - 1.5*menuHeight;
                console.log(y)
              }
              if (y < 0) {
                y = 20;
              }
              setMenuPosition({ x, y });
              setShowForm(true);

        }
    }
    const handleCloseForm = () => {
        setShowForm(false);
        setDragStart(null);
        setDragEnd(null);
      };

    const renderPlaceholderEvent = () => {
        if (!dragStart && !showForm) return null;
        if (!dragStart || !dragEnd ) return null;
        let startDate = new Date(dragStart.day);
        let endDate = new Date(dragEnd.day);

        if (endDate < startDate) {
            console.log(endDate, "<", startDate);
            const temp = startDate;
            startDate = endDate;
            endDate = temp;
        }
        if (!isSameDay(startDate, endDate)) return null;


        const dayIndex = weekDays.findIndex((day) => isSameDay(day, startDate));
        if (dayIndex === -1) return null;

        const durationInMinutes = differenceInMinutes(endDate, startDate);
        const heightPercentage = (durationInMinutes / 1440) * 100;
        const startOffsetInMinutes = differenceInMinutes(startDate, startOfDay(startDate));
        const topPercentage = (startOffsetInMinutes / 1440) * 100;
        
        return (
            <motion.div
                className="absolute left-0 right-0 bg-primary-foreground border-2 border-primary rounded-md opacity-50 z-10"
                style={{
                    top: `${topPercentage}%`,
                    height: `${heightPercentage}%`,
                    left: `0`,
                    pointerEvents: 'none'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                <div className="p-1 text-xs font-semibold text-primary">
                    Nuevo Evento
                    <br />
                    {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                </div>
            </motion.div>
        );
    }



    return (
        <div className="w-5/6 max-h-screen overflow-auto mx-auto h-[75vh]" ref={timeContainerRef}>
            <div className="flex justify-between items-center p-4 bg-primary text-primary-foreground">
                <Button onClick={handlePrevWeek} variant="ghost" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <AnimatePresence initial={false} custom={direction}>
                    <motion.h2
                        key={currentDate.toISOString()}
                        className="text-xl font-bold"
                        custom={direction}
                        variants={headerVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {format(weekDays[0], "d 'de' MMMM", { locale: es })} - {format(weekDays[6], "d 'de' MMMM 'de' yyyy", { locale: es })}
                    </motion.h2>
                </AnimatePresence>
                <Button onClick={handleNextWeek} variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex flex-row sticky top-0 bg-white z-10">

                <div className="w-24 p-2 font-bold align-middle bg-muted h-12" ></div>
                {weekDays.map((day, index) => (
                    <div className={`flex-1  min-w-[150px] flex items-center justify-center font-semibold ${isToday(day) ? "bg-primary text-primary-foreground" : "bg-background"
                        }`} key={index}
                    >

                        <span className="text-sm">{format(day, "EEE", { locale: es })}</span>
                        <span className="ml-1 text-lg">{format(day, "d", { locale: es })}</span>

                    </div>
                ))}
            </div>

            {/* Contenedor para las horas y eventos */}
            <div className="flex flex-row">
                {/* Columna para las horas */}
                <div className="flex flex-col">
                    {timeSlots.map((slot, index) => (
                        <div className="flex items-start" key={index}>
                            <div className="w-24 pt-8 font-bold bg-muted flex justify-center border-gray-300">
                                {format(slot.end, "HH:mm")}
                            </div>
                            <div className="flex-1 border-t border-gray-300"></div>
                        </div>
                    ))}
                </div>

                {/* Contenedor para los slots de tiempo para cada día */}
                {weekDays.map((day, idx) => (
                    <div className="flex-1 flex flex-col relative" key={idx}>
                        {timeSlots.map((slot, index) => {
                            const slotStart = new Date(day);
                            slotStart.setHours(slot.start.getHours(), slot.start.getMinutes());

                            const slotEnd = new Date(day);
                            slotEnd.setHours(slot.end.getHours(), slot.end.getMinutes());

                            // Verificar si el día es el actual
                            const isCurrentDay = isSameDay(day, currentTime);

                            return (
                                <div className="flex-1 p-2  border-l border-b border-gray-300 relative" key={index}
                                    onMouseDown={() => handleDragStart(slotStart)}
                                    onMouseMove={() => handleDragMove(slotEnd)}
                                    onMouseUp={handleDragEnd}>
                                    {/* Verificar si hay eventos en este slot */}
                                    {events.map((event, eventIndex) => {
                                        const eventStart = event.Fecha_Inicio;
                                        const eventEnd = event.Fecha_Fin;

                                        // Verificar si el evento se superpone con este slot
                                        const isEventInSlot =
                                            isWithinInterval(slotStart, { start: eventStart, end: eventEnd });

                                        if (isEventInSlot) {
                                            const durationInMinutes = differenceInMinutes(eventEnd, eventStart);
                                            const heightPercentage = (durationInMinutes / 30) * 100;
                                            const startOffsetInMinutes = differenceInMinutes(eventStart, slotStart);
                                            const topPercentage = (startOffsetInMinutes / 30) * 100;

                                            return (
                                                <motion.div
                                                    key={eventIndex}
                                                    className="absolute left-0 right-0 font-bold p-1 rounded-md border mx-2"
                                                    style={{
                                                        top: `${topPercentage}%`,
                                                        height: `${heightPercentage}%`,

                                                        borderColor: event.Categoria.color,
                                                        color: event.Categoria.color,
                                                        backgroundColor: lightenColor(event.Categoria.color, 70),
                                                    }}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    whileHover={{ scale: 1.05 }}
                                                >
                                                    {event.Titulo}
                                                    <p className="text-l font-normal ">{format(eventStart, "HH:mm")}-{format(eventEnd, "HH:mm")}</p>
                                                </motion.div>
                                            );
                                        }

                                        return null;
                                    })}

                                    {/* Línea roja solo si es el día y franja horaria actual */}
                                    {isCurrentDay &&
                                        isAfter(currentTime, slot.start) &&
                                        isBefore(currentTime, slot.end) && (
                                            <motion.div
                                                className="absolute w-full border-t-2 border-red-500 z-20 left-0"
                                                style={{ top: `${linePosition}%` }}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ duration: 0.5 }}
                                            ></motion.div>
                                        )}
                                </div>
                            );
                        })}
                        {dragStart && isSameDay(day, dragStart.day) && renderPlaceholderEvent()}
                    </div>
                    
                ))}
            </div>
             <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", damping: 15, stiffness: 300 }}
                  style={{
                    position: "absolute",
                    left: `${menuPosition.x}px`,
                    top: `${menuPosition.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="z-50"
                >
                  <Card className="w-80">
                    <CardHeader>
                      <CardTitle>Crear nuevo evento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleCreateEvent} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Título</Label>
                          <Input
                            id="title"
                            value={newTask.Titulo}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, Titulo: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Input
                            id="description"
                            value={newTask.Descripcion}
                            onChange={(e) => setNewTask((prev) => ({ ...prev, Descripcion: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría</Label>
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
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de inicio</Label>
                          <Input value={newTask.Fecha_Inicio ? format(newTask.Fecha_Inicio, "dd/MM/yyyy HH:mm") : ""} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label>Fecha de fin</Label>
                          <Input value={newTask.Fecha_Fin ? format(newTask.Fecha_Fin, "dd/MM/yyyy HH:mm") : ""} disabled />
                        </div>
                      </form>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" onClick={handleCloseForm}>
                        Cancelar
                      </Button>
                      <Button onClick={handleCreateEvent}>Crear evento</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
        </div>
    );
};

export default TablaDia;
