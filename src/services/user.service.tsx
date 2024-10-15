import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'https://todo-bkend.onrender.com/api/';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'test/all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'test/user', { headers: authHeader() });
  }
  addCategory(name:string,color:string){
    return axios.post(API_URL +"category/add",{name,color},{headers: authHeader()})

  }
  getCategory(){
    return axios.get(API_URL +"category/get",{headers: authHeader()})
  }
  deleteCategory(id:number){
    return axios.delete(API_URL +"category/delete/"+id,{headers: authHeader()})
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'test/mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'test/admin', { headers: authHeader() });
  }
}

export default new UserService();
