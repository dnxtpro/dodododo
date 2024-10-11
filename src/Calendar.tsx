import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle} from "@/components/ui/card";
import clsx from "clsx";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, isToday, isSameDay } from "date-fns"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EventModal from "./ModalEvent";

interface CalendarEvent {
    date: Date;
    description:string;
    title: string;
}
interface CalendarProps {
    events: CalendarEvent[];
    onAddEvent: (event: CalendarEvent) => void;
}

interface Eventos{
    date:Date;
    title:string;
    description:string;
}
const Calendar = ({ events, onAddEvent }: CalendarProps) => {   

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false)
    const [eventos, setEventos] = useState<CalendarEvent[]>([]);


    const diasSemana = ["Lun", "Mar", "Mier", "Jue", "Vie", "Sab", "Dom"];
    const primerDiaMes = startOfMonth(currentDate)
    const ultimoDiaMes = endOfMonth(currentDate)
    const diasMes = eachDayOfInterval({
        start: primerDiaMes,
        end: ultimoDiaMes
    });
    const diaInicialIndex = getDay(primerDiaMes)
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const calendarVariants = {
        enter: (direction: number) => {
            return {
                x: direction > 0 ? 1000 : -1000,
                opacity: 0,

            }
        },
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,

        },
        exit: (direction: number) => {
            return {
                zIndex: 0,
                x: direction < 0 ? 1000 : -1000,
                opacity: 0,
            }
        },
    }
    const [[page, direction], setPage] = useState([0, 0])
    const paginate = (newDirection: number) => {
        if (newDirection === 1) {
            nextMonth()
        } else {
            prevMonth()
        }
        setPage([page + newDirection, newDirection])
    }
    const handleDayClick = (day:Date) => {
        setSelectedDate(day)
        setShowModal(true)
    }
    const handleAddEvent = (event: { title: string; description: string; date: Date }) => {
        const newEvent: CalendarEvent = { title: event.title, description: event.description, date: event.date };
        onAddEvent(event); 
        setEventos((prevEventos) => [...prevEventos, newEvent]); // Cambiar aquí
        setShowModal(false);
    };
    return (
        <>
            <Card className="mx-auto w-4/6 mt-10">
                <CardHeader >

                    <div className="space-x-3 mx-auto flex flex-row items-center ">
                        <Button variant="outline" size="icon" onClick={() => paginate(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>                <h2 className="text-center">{format(currentDate, "MMMM yyyy")}</h2> </CardTitle>
                        <Button variant="outline" size="icon" onClick={() => paginate(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                </CardHeader>
            </Card>
            <div className="relative w-4/6 mx-auto mt-2" >
                <AnimatePresence custom={direction}>
                    <motion.div
                        key={page}
                        custom={direction}
                        variants={calendarVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 500, damping: 25 },
                            opacity: { duration: 0.5 },
                        }}
                        className="grid grid-cols-7 absolute inset-0 "
                    >
                        {diasSemana.map((day) => {
                            return <div className="font-bold text-center border rounded-md " key={day}>{day}</div>
                        })}
                        {Array.from({ length: diaInicialIndex }).map((_, index) => {
                            return <div className=" text-center border rounded-md p-2 " key={`empty-${index}`}>{ }</div>
                        })}
                        {diasMes.map((day, index) => {
                            return <div className={clsx(" text-center border rounded-md p-2 hover:bg-slate-300 cursor-pointer", {
                                "bg-slate-700 text-white font-bold border-accent  hover:bg-slate-500": isToday(day),

                            })} key={index} onClick={() => handleDayClick(day)}>
                                {format(day, "d")}
                                {events
                                    .filter((event) => isSameDay(event.date, day)).map((event) => {
                                        return <div key={event.title}>{event.title}</div>
                                    })}
                            </div>
                        })}
                    </motion.div>
                </AnimatePresence>

            </div>
            <EventModal
            showModal={showModal}
        setShowModal={setShowModal}
        selectedDate={selectedDate}
        handleAddEvent={handleAddEvent}/>
        </>
    )
}
export default Calendar;