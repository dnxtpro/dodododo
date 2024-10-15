import { Button } from "./components/ui/button";
import Tareas from "./Tareas";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input"
import Wheel from '@uiw/react-color-wheel';
import AuthService from "./services/user.service";
import { Trash } from "lucide-react";

import { toast } from 'react-hot-toast';

import { Card } from "./components/ui/card";
import { useState,useEffect } from "react";
 interface Category {

  id: number;
  name: string;
  color: string;
}

const tareasData = [
    {
      Titulo: 'Comprar comestibles',
      Descripcion: 'Leche, huevos, pan y verduras',
      Categoria: 'Casa',
      Prioridad: 'Alta',
      Fecha: '2024-10-15',
    },
  ];
const Tasks = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#2CCCE4' });


    const handleAddCategory = (e: React.FormEvent) => {
        console.log(newCategory)
        enviar(newCategory.name,newCategory.color)
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
  
      const enviar = async (name:string,color:string)=>{
        const response = await AuthService.addCategory(name,color);
        if(response){
          console.log(response.data)
          toast.success("Categoria"+ response.data.name + ",creada correctamente")
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
    
    return(
        <div className="grid grid-cols-2 space-x-10 mx-10 mt-4">
        <Tareas tareas={tareasData}/>
        <div className="flex flex-col mx-10 space-y-4 ">
          <div className="grid grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Card
            key={cat.name} 
            className="text-center flex justify-between align-middle p-2 hover:shadow-lg" 
            style={{boxShadow:" 0 4px 12px 0" + cat.color + "," + "0 4px 8px -4px"+cat.color }}
          >
            <h3 className="font-bold text-center">{cat.name}</h3>
            <Button variant="ghost" className="text-red-500 hover:text-red-600 " onClick={()=>borrar(cat.id)}><Trash/></Button>
          </Card>
        ))}
        </div>
          <form onSubmit={handleAddCategory} >
          
          <Card style={{boxShadow:" 0 4px 12px 0 " + newCategory.color + "," + "0 4px 8px -4px"+newCategory.color}} className="space-y-4 py-4 flex flex-col items-center">
            <div>
              <Label htmlFor="categoryName">Nombre de la Categoría</Label>
              <Input
                id="categoryName"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Nombre de la categoría"
              />
            </div>
            <div>
              <Label htmlFor="categoryColor">Color de la Categoría</Label>
              <div className="flex items-center space-x-4">
                <Wheel
                  color={newCategory.color}
                  onChange={handleColorChange}
                 
                />
                
              </div>
            </div>
            <Button type="submit">Añadir Categoría</Button>
          </Card>
        </form>
       
      </div>
    
        </div>
    )
}
export default Tasks;