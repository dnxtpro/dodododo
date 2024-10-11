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

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
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
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="bg-white p-6 rounded-lg w-96"
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
