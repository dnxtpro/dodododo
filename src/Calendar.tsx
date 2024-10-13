import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths, addMonths, isToday, isSameDay } from "date-fns"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
    date: Date;
    description: string;
    title: string;
}
interface CalendarProps {
    events: CalendarEvent[];
    onDateSelect: (startDate: Date) => void;

}


const Calendar = ({ events, onDateSelect }: CalendarProps) => {

    const [currentDate, setCurrentDate] = useState(new Date());
    const [startDate] = useState<Date | null>(null); // Fecha de inicio del rango



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

    const handleDayClick = (date: Date) => {
        console.log(date)
        if (date) {
            onDateSelect(date);
        }
    };

    const isSelectedDay = (day: Date) => {
        if (!startDate) return false;

        return isSameDay(day, startDate);
    };

    return (
        <div>
            <Card className="">
                <CardHeader >

                    <div className="space-x-3 mx-auto flex flex-row items-center ">
                        <Button variant="outline" size="icon" onClick={() => paginate(-1)}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <CardTitle>
                            <h2 className="text-center">
                                {format(currentDate, "MMMM yyyy")}
                            </h2>
                        </CardTitle>
                        <Button variant="outline" size="icon" onClick={() => paginate(1)}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                </CardHeader>
            </Card>
            <div className="relative " >
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
                        className="grid mt-2 grid-cols-7 gap-1 absolute inset-0 rounded-md"
                    >
                        {diasSemana.map((day) => {
                            return <div className="font-extrabold text-center rounded-sm p-0 " key={day}>{day}</div>
                        })}
                        {Array.from({ length: diaInicialIndex }).map((_, index) => {
                            return <div className=" text-center p-2 " key={`empty-${index}`}>{ }</div>
                        })}
                        {diasMes.map((day, index) => {
                            return <div className={clsx(" h-[5vh] text-center flex items-center justify-center rounded-full p-1 hover:bg-slate-300 cursor-pointer transition-colors", {
                                "bg-slate-700 text-white font-bold border-accent hover:bg-slate-500": isToday(day),
                                "bg-blue-300 text-white": isSelectedDay(day),


                            })} key={index} onClick={() => handleDayClick(day)}>
                                {format(day, "d")}
                                {events
                                    .filter((event) => isSameDay(event.date, day)).map((event) => {
                                        return <div key={event.title}></div>
                                    })}

                            </div>
                        })}


                    </motion.div>

                </AnimatePresence>

            </div>
        </div>

    )
}
export default Calendar;