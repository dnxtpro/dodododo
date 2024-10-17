import { Button } from "./components/ui/button";
import Tareas from "./Tareas";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input"
import Wheel from '@uiw/react-color-wheel';
import AuthService from "./services/user.service";
import { Trash } from "lucide-react";

import { toast } from 'react-hot-toast';
import { Cat } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { useState, useEffect } from "react";
interface Category {

  id: number;
  name: string;
  color: string;
}
import {
  Drawer, DrawerTrigger, DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "./components/ui/drawer";
const tareasData = [
  {
    Titulo: 'Comprar comestibles',
    Descripcion: 'Leche, huevos, pan y verduras',
    Categoria: { id: 9, name: "SEXO", color: "#fffff" },
    Prioridad: 'Alta',
    Fecha_Inicio: new Date('2024-10-15'),
    Fecha_Fin: new Date('2024-10-15'),
    Hecho:true,
    FullDay:true,

  },
];
const Tasks = () => {

  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#2CCCE4' });


  const handleAddCategory = (e: React.FormEvent) => {
    console.log(newCategory)

    e.preventDefault();
    if (newCategory.name.trim() !== '') {
      enviar(newCategory.name, newCategory.color);
      recibir();
      setNewCategory({ name: '', color: '#2CCCE4' });
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
      console.log(response.data)
      toast.success("Categoria" + response.data.name + ",creada correctamente")
    }
    else toast.error("Algo ha ido mal")

  }
  const borrar = async (id: number) => {
    try {
      const response = await AuthService.deleteCategory(id); // Llama al servicio para eliminar la categoría
      const message = response.data;
      toast.success(message, {
        duration: 3000, // Duración en milisegundos
        position: 'bottom-right', // Posición del toast
        style: {
          background: '#4caf50', // Color de fondo
          color: '#fff', // Color del texto
        },
      });
      setCategories(categories.filter(cat => cat.id !== id)); // Actualiza el estado
    } catch (error) {
      console.error('Error eliminando la categoría', error);
    }
  };
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

  return (
    <div className=" space-x-10 mx-10 mt-4">
      <Tareas tareas={tareasData} />

    {/* PARA ELEGIR CATEOGORIAS */}
      <Drawer>
        <DrawerTrigger>
          <Button variant="outline" className="hover:bg-orange-300 hover:text-orange-800 fixed bot-0 right-10">Nueva Categoria</Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Categoria</DrawerTitle>
              <DrawerDescription>Anade o borra tus cateogrias</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col justify-center">
              <form onSubmit={handleAddCategory} >
                <div>
                  <Label htmlFor="categoryName" >Nombre de la Categoría</Label>
                  <Input
                    id="categoryName"
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    placeholder="Nombre"
                  />
                </div>
                <div className="flex flex-col items-center mt-2">

                  <div className="flex items-center space-x-4">
                    <Wheel
                      width={100}
                      height={100}
                      color={newCategory.color}
                      onChange={handleColorChange}
                    />

                  </div>
                </div>

                <div className=" overflow-x-hidden overflow-y-scroll p-4">
                  {categories.map((cat) => (
                    <Card
                      key={cat.name}
                      className="overflow-hidden h-[5vh] transition-all mb-4 duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl space-y-2"
                      
                    >
                      <CardContent className=" border-t-4 mb-2" style={{borderColor:cat.color}}>
                        <div className="p-2 flex flex-row items-center space-x-2 " >
                          <div style={{color: cat.color}}>
                            <Cat/>
                          </div>
                          <h3 className="font-bold text-2xl text-center">{cat.name}</h3>
                          <div className="text-sm opacity-75 justify-self-end">
                          <Button type="button" variant="ghost" className="hover:scale-105 hover:bg-red-600" onClick={() => borrar(cat.id)}><Trash /></Button>
                          </div>
                        </div>
                      </CardContent>

                      
                    </Card>
                  ))}
                </div>


                <DrawerFooter>
                  <Button type="submit" style={{ backgroundColor: newCategory.color }}>Submit</Button>
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
  )
  // Función para obtener la luminancia de un color

// Función para determinar el color de texto (blanco o negro)

}
export default Tasks;