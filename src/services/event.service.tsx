import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://todo-bkend.onrender.com/api/';

interface Tarea {
  Titulo: string;
  Descripcion: string;
  Categoria: Category;
  Prioridad: string;
  Fecha_Inicio: Date;
  Hecho: boolean;
  FullDay: boolean;
  Fecha_Fin: Date;

}
interface Category {

    id: number;
    name: string;
    color: string;
}

class EventService {
  

  addEvent(tarea:Tarea) {
    return axios.post(API_URL + 'event/add',{tarea}, { headers: authHeader() });
  }
  async getTasks() {
    try {
      const response = await axios.get(API_URL + 'event/get', { headers: authHeader() });
      console.log(response.data)
      return response.data; // Devuelve los datos recibidos
    } catch (error) {
      console.error('Error al obtener las tareas:', error);
      throw error; // Lanza el error para manejo en otro lugar
    }
  }
}

export default new EventService();
