import { Button } from "@/components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
import { Label } from "./components/ui/label";
import { motion,AnimatePresence } from "framer-motion";
import{X} from "lucide-react"
import {format} from "date-fns"

interface EventModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedDate: Date | null;
  handleAddEvent: (event: { title: string; description: string; date: Date }) => void;
}



const dropIn = {
    hidden: {
      scale:0,
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      scale:1,  
      y: "0",
      opacity: 1,
      transition: {
        duration: 1,
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };
const EventModal: React.FC<EventModalProps> = ({
  showModal,
  setShowModal,
  selectedDate,
  handleAddEvent,
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      title: { value: string };
      description: { value: string };
    };

    const newEvent = {
      title: target.title.value,
      description: target.description.value,
      date: selectedDate as Date, // Asegúrate de que selectedDate no sea null
    };

    handleAddEvent(newEvent);
    setShowModal(false);
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-96"
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Guardar Evento</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </Label>
                <Textarea id="description" name="description" />
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">Date</Label>
                <Input value={selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""} disabled />
              </div>
              <Button type="submit" className="w-full">
                Add Event
              </Button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
