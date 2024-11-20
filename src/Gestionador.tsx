import TablaDia from "./TablaDia";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  BarChart2,
  Mail,
  Settings,

  Cat,
} from "lucide-react";
import AuthService from "./services/user.service";


interface Category {
  id: number;
  name: string;
  color: string;
}

const menuItems = [
  { icon: Home, label: "Home" },
  { icon: Users, label: "Team" },
  { icon: BarChart2, label: "Analytics" },
  { icon: Mail, label: "Messages" },
  { icon: Settings, label: "Settings" },
];
const Gestionador = () => {
 
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const recibir = async () => {
    try {
      const response = await AuthService.getCategory();
      const data = response.data; // Accede a la propiedad `data` de la respuesta de Axios
      console.log(data);
      const formattedCategories: Category[] = data.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        color: cat.color,
      }));
      setCategories(formattedCategories); // Actualiza el estado con las categorías formateadas
    } catch (error) {
      console.error("Error obteniendo las categorías", error);
    }
  };
  useEffect(() => {
    recibir(); // Llamamos a la función recibir cuando se monta el componente
  }, []);

  return (
    <div className="flex bg-gray-50">
      <motion.div
        initial={{ width: 256 }}
        animate={{ width: isOpen ? 256 : 80 }}
        className="relative min-h-screen bg-gradient-to-b from-pink-200 via-pink-100 to-white  border-gray-100 shadow-sm"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute -right-2 top-6 p-2 bg-white rounded-full border border-gray-100 shadow-md hover:shadow-lg transition-shadow"
        >
          {isOpen ? (
            <X size={16} className="text-gray-600" />
          ) : (
            <Menu size={16} className="text-gray-600" />
          )}
        </button>

        <div className="p-6 mb-8">
          <motion.div
            initial={false}
            animate={{ justifyContent: isOpen ? "flex-start" : "center" }}
            className="flex items-center gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-semibold">B</span>
            </div>
            <motion.span
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="font-medium text-gray-900"
            ></motion.span>
          </motion.div>
        </div>

        <nav className="px-3">
          {menuItems.map((item) => (
            <motion.a
              key={item.label}
              href="#"
              className="flex items-center gap-4 px-3 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <item.icon
                size={20}
                className="text-gray-400 group-hover:text-indigo-600"
              />
              <motion.span
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                className="font-medium group-hover:text-gray-900"
              >
                {item.label}
              </motion.span>
              {!isOpen && (
                <motion.div
                  initial={false}
                  animate={{ opacity: 1 }}
                  className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                >
                  {item.label}
                </motion.div>
              )}
            </motion.a>
          ))}
          <motion.div
            className="flex flex-col items-center gap-4 px-3 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group relative"
            whileHover={{ scale: 1.0 }}
            whileTap={{ scale: 1 }}
          >
            <motion.span
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0 }}
              className="font-medium group-hover:text-gray-900 text-4xl"
            >
              Categorías
            </motion.span>
            
            <div className="flex flex-col  space-y-2 align-middle items-start">
              {categories.map((cat) => (
                <motion.div
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  style={{ color: cat.color }}
                  key={cat.name}
                  className="flex items-center gap-4 px-3 py-3 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors group relative"
                >
                 <Cat/>
                  <span className="">{cat.name}</span>
                  {!isOpen && (
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
              >
                <Cat  style={{ color: cat.color }}/> 
              </motion.div>
            )}

                </motion.div>
                
              ))}
            </div>
          </motion.div>
        </nav>
      </motion.div>
      <main className="flex-1 ">
        <div className="max-w-full">
          <TablaDia />
        </div>
      </main>
    </div>
  );
};

export default Gestionador;
