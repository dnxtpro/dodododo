import {
    startOfWeek,
    addDays,
    format,
    setMinutes,
    setHours,
    isWithinInterval,
    differenceInMinutes,
    isToday,
    isSameDay,isAfter,isBefore
} from "date-fns";
import { useState, useEffect,useRef } from "react";

interface Event {
    title: string;
    start: Date;
    end: Date;
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
    const timeContainerRef = useRef<HTMLDivElement>(null);
    const [currentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const weekDays = getWeekDays(currentDate);
    const timeSlots = getTimeSlots();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Actualiza cada minuto

        return () => clearInterval(interval);
        
    }, []);
    useEffect(()=>{
        const interval1 = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Actualiza cada minuto

        const scrollToCurrentTime = () => {
            if (timeContainerRef.current) {
                const hourSlot = timeSlots.find((slot) => {
                    return (
                        currentTime.getHours() === slot.start.getHours() &&
                        currentTime.getMinutes() < 30 // Ajusta para elegir el slot correcto
                    );
                });

                if (hourSlot) {
                    const index = timeSlots.indexOf(hourSlot);
                    const slotHeight = 30; // Ajusta esto si el alto de los slots es diferente
                    const scrollPosition = index * slotHeight;

                    timeContainerRef.current.scrollTop = scrollPosition;
                }
            }
        };

        scrollToCurrentTime();

        return () => clearInterval(interval1);
    }, [currentTime]);
    

    const calculateLinePosition = (now: Date) => {
        const minutes = now.getMinutes();
        return (minutes / 60) * 100;
    };

    const linePosition = calculateLinePosition(currentTime);

    // Ejemplo de eventos
    const events: Event[] = [
        {
            title: "Evento 1",
            start: new Date(2024, 9, 17, 18, 40),
            end: new Date(2024, 9, 17, 21, 10),
        },
        {
            title: "Evento 2",
            start: new Date(2024, 9, 17, 20, 0),
            end: new Date(2024, 9, 17, 20, 30),
        },
        {
            title: "Evento 3",
            start: new Date(2024, 9, 17, 3, 20),
            end: new Date(2024, 9, 17, 12, 30),
        },
    ];

    return (
        <div className="w-5/6 max-h-screen overflow-auto mx-auto h-[75vh]">
            {/* Contenedor para los días */}
            <div className="flex flex-row sticky top-0 bg-white z-10">
                <div className="w-24 p-2 font-bold align-middle">Día</div>
                {weekDays.map((day, index) => (
                    <div className="flex-1  p-2 font-bold border border-t-0 border-gray-300" key={index}>
                        <div className="flex flex-col mx-auto w-1/4 text-center">
                            <p>{format(day, "E ")}</p>
                            <p className={`p-2 font-bold ${
                                isToday(day)
                                    ? 'rounded-full text-white font-extrabold bg-pink-400'
                                    : ''
                            }`}>
                                {format(day, "dd")}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contenedor para las horas y eventos */}
            <div className="flex flex-row">
                {/* Columna para las horas */}
                <div className="flex flex-col">
                    {timeSlots.map((slot, index) => (
                        <div className="flex items-start" key={index}>
                            <div className="w-24 pt-8 font-bold border-t flex justify-start border-gray-300">
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
                                <div className="flex-1 p-2 border-t border-l border-gray-300 relative" key={index}>
                                    {/* Verificar si hay eventos en este slot */}
                                    {events.map((event, eventIndex) => {
                                        const eventStart = event.start;
                                        const eventEnd = event.end;

                                        // Verificar si el evento se superpone con este slot
                                        const isEventInSlot =
                                            isWithinInterval(slotStart, { start: eventStart, end: eventEnd });

                                        if (isEventInSlot) {
                                            const durationInMinutes = differenceInMinutes(eventEnd, eventStart);
                                            const heightPercentage = (durationInMinutes / 30) * 100;
                                            const startOffsetInMinutes = differenceInMinutes(eventStart, slotStart);
                                            const topPercentage = (startOffsetInMinutes / 30) * 100;

                                            return (
                                                <div
                                                    key={eventIndex}
                                                    className="absolute bg-yellow-200 p-1 rounded-xl border-yellow-500 border-2 text-yellow-900"
                                                    style={{
                                                        top: `${topPercentage}%`,
                                                        height: `${heightPercentage}%`,
                                                        left: "0",
                                                        right: "0",
                                                    }}
                                                >
                                                    {event.title}
                                                    <p className="text-l text-yellow-700 ">{format(eventStart,"HH:mm")}-{format(eventEnd,"HH:mm")}</p>
                                                </div>
                                            );
                                        }

                                        return null;
                                    })}

                                    {/* Línea roja solo si es el día y franja horaria actual */}
                                    {isCurrentDay &&
                                        isAfter(currentTime, slot.start) &&
                                        isBefore(currentTime, slot.end) && (
                                            <div
                                                className="absolute w-full border-t-2 border-red-500"
                                                style={{ top: `${linePosition}%`,left:0 }}
                                            ></div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TablaDia;
