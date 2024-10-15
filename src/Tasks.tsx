import { Button } from "./components/ui/button";
import Tareas from "./Tareas";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input"
import Wheel from '@uiw/react-color-wheel';
import AuthService from "./services/user.service";


import { Card } from "./components/ui/card";
import { useState,useEffect } from "react";
 interface Category {
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
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Alta',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Baja',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Baja',
      Fecha: '2024-10-17',
    },
    {
      Titulo: 'Cosas Que No Acaban',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-12-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-16',
    },
    {
      Titulo: 'Proyecto React',
      Descripcion: 'Terminar componente de tareas',
      Categoria: 'Trabajo',
      Prioridad: 'Media',
      Fecha: '2024-10-15',
    },
    // Añade más tareas si es necesario
  ];
const Tasks = () => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', color: '#2CCCE4' });


    const handleAddCategory = (e: React.FormEvent) => {
        console.log(newCategory)
        enviar(newCategory.name,newCategory.color)
        e.preventDefault();
        if (newCategory.name.trim() !== '') {
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
  
      const enviar = (name:string,color:string)=>{
        AuthService.addCategory(name,color);
      }
      const recibir = async () => {
        try {
            const response = await AuthService.getCategory();
            const data = response.data; // Accede a la propiedad `data` de la respuesta de Axios
          // Suponiendo que `data` es un array de objetos que ya contiene `name` y `color`
          const formattedCategories: Category[] = data.map((cat: any) => ({
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
            className="text-center" 
            style={{boxShadow:" 0 1px 3px 0" + cat.color + "," + "0 1px 2px -1px"+cat.color }}
          >
            <h3 className="font-bold">{cat.name}</h3>
          </Card>
        ))}
        </div>
          <form onSubmit={handleAddCategory} >
          
          <Card style={{boxShadow:" 0 1px 3px 0 " + newCategory.color + "," + "0 1px 2px -1px"+newCategory.color}} className="space-y-4 flex flex-col items-center">
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