import { Button } from "./components/ui/button";
import Tareas from "./Tareas";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import Wheel from "@uiw/react-color-wheel";
import AuthService from "./services/user.service";
import { Trash } from "lucide-react";
import { Plus } from "lucide-react";

import { toast } from "react-hot-toast";
import { Cat } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { useState, useEffect } from "react";
interface Category {
  id: number;
  name: string;
  color: string;
}
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./components/ui/drawer";
const tareasData = [
  {
    Id: 0,
    Titulo: "Comprar comestibles",
    Descripcion: "Leche, huevos, pan y verduras",
    Categoria: { id: 9, name: "SEXO", color: "#fffff" },
    Prioridad: "Alta",
    Fecha_Inicio: new Date("2024-10-15"),
    Fecha_Fin: new Date("2024-10-15"),
    Hecho: true,
    FullDay: true,
    Tipo: "",
  },
];
const Tasks = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: "",
    color: "#2CCCE4",
  });

  const handleAddCategory = (e: React.FormEvent) => {
    console.log(newCategory);

    e.preventDefault();
    if (newCategory.name.trim() !== "") {
      enviar(newCategory.name, newCategory.color);
      recibir();
      setNewCategory({ name: "", color: "#2CCCE4" });
    }
  };
  useEffect(() => {
    recibir(); // Llamamos a la función recibir cuando se monta el componente
  }, []);

  const handleColorChange = (color: { hex: string }) => {
    setNewCategory({ ...newCategory, color: color.hex });
  };

  const enviar = async (name: string, color: string) => {
    const response = await AuthService.addCategory(name, color);
    if (response) {
      console.log(response.data);
      toast.success("Categoria" + response.data.name + ",creada correctamente");
    } else toast.error("Algo ha ido mal");
  };
  const borrar = async (id: number) => {
    try {
      const response = await AuthService.deleteCategory(id); // Llama al servicio para eliminar la categoría
      const message = response.data;
      toast.success(message, {
        duration: 3000, // Duración en milisegundos
        position: "bottom-right", // Posición del toast
        style: {
          background: "#4caf50", // Color de fondo
          color: "#fff", // Color del texto
        },
      });
      setCategories(categories.filter((cat) => cat.id !== id)); // Actualiza el estado
    } catch (error) {
      console.error("Error eliminando la categoría", error);
    }
  };
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

  return (
    <div className=" space-x-10 mx-10 mt-4 z-50">
      <Tareas tareas={tareasData} />

      <div className="bg-card rounded-lg shadow-lg p-6">
      <Drawer>
        <DrawerTrigger className="absolute top-96">
        <Button 
                    variant="outline" 
                    className="w-full mb-6 hover:bg-orange-100 hover:text-orange-800 border-2 border-orange-200"
                  >
             <Plus className="mr-2 h-4 w-4" />
             Nueva Categoría
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-secondary ">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Categoria</DrawerTitle>
              <DrawerDescription>
                Anade o borra tus cateogrias
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col justify-center">
              <form onSubmit={handleAddCategory} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-sm font-medium">
                    Nombre de la Categoría
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    placeholder="Nombre"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-col items-center gap-4">
                  <Wheel
                    width={100}
                    height={100}
                    color={newCategory.color}
                    onChange={handleColorChange}
                  />
                </div>

                <div className=" overflow-x-hidden max-h-[20vh] overflow-y-scroll p-4">
                  {categories.map((cat) => (
                    <Card
                      key={cat.name}
                      className="transition-all mb-4 duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
                    >
                      <CardContent
                        className="border-t-4 p-4"
                        style={{ borderColor: cat.color }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Cat style={{ color: cat.color }} />
                            <h3 className="font-bold text-2xl text-center">
                              {cat.name}
                            </h3>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            className="hover:bg-red-100 hover:text-red-600 transition-colors"
                            onClick={() => borrar(cat.id)}
                          >
                            <Trash size={18} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <DrawerFooter>
                  <Button
                    type="submit"
                    style={{ backgroundColor: newCategory.color }}
                  >
                    Añadir
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="destructive">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      </div>
    </div>
  );
  // Función para obtener la luminancia de un color

  // Función para determinar el color de texto (blanco o negro)
};
export default Tasks;
