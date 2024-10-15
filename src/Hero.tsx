
import { Button } from "./components/ui/button";
import {ChevronRight} from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
 



  return (

  <div className="h-screen">
    <h1 className=" tscroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center italic">Marca Tus Objetivos<br></br>Organiza Tu Tiempo<br></br>Y Llega a Tus Metas</h1>
    <div className=" w-1/2 mt-5 mx-auto flex flex-col justify-center">
    
    <div className="flex justify-around"><img src="path1.png" alt="" /><img src="path1-8.png" alt="" /></div>
    <Link className="font-bold mx-auto" to="/register"> 
    <Button className="font-bold mx-auto">UNETE YA<ChevronRight/></Button>
    </Link>
    </div>
  
  </div>
 

  );
};

export default Hero
