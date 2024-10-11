import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Cronometro = () => {
  const [time, setTime] = useState(0); // Estado del tiempo en milisegundos
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  // Función para iniciar el cronómetro
  const startCronometro = () => {
    setIsRunning(true);
    startTimeRef.current = Date.now() - time; // Calcula el tiempo desde que se dejó de contar
    localStorage.setItem("startTime", startTimeRef.current.toString());
  };

  // Función para pausar el cronómetro
  const pauseCronometro = () => {
    setIsRunning(false);
    localStorage.removeItem("startTime"); // Elimina el tiempo del localStorage cuando se pausa
  };

  // Función para reiniciar el cronómetro
  const resetCronometro = () => {
    setIsRunning(false);
    setTime(0);
    localStorage.removeItem("startTime");
  };

  // Efecto para manejar el cronómetro
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        const startTime = startTimeRef.current || 0;
        setTime(Date.now() - startTime);
      }, 1000); // Actualiza cada segundo
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Efecto para recuperar el tiempo cuando se vuelve a la página
  useEffect(() => {
    const storedTime = localStorage.getItem("startTime");
    if (storedTime) {
      setIsRunning(true);
      startTimeRef.current = parseInt(storedTime);
    }
  }, []);

  // Función para formatear el tiempo (milisegundos a minutos y segundos)
  const formatTime = (time: number) => {
    const seconds = Math.floor((time / 1000) % 60);
    const minutes = Math.floor((time / 1000 / 60) % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="p-4 text-center">
      <motion.h1
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-6xl font-bold"
      >
        {formatTime(time)}
      </motion.h1>

      <div className="mt-4">
        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={startCronometro}
            className="bg-lime-500 text-white px-4 py-2 rounded-md"
          >
            Start
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={pauseCronometro}
            className="bg-neutral-500 text-white px-4 py-2 rounded-md"
          >
            Pause
          </motion.button>
        )}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={resetCronometro}
          className="bg-fuchsia-500 text-white px-4 py-2 rounded-md ml-4"
        >
          Reset
        </motion.button>
      </div>
    </div>
  );
};

export default Cronometro;
