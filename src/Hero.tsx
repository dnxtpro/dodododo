
import { Button } from "./components/ui/button";
import {ChevronRight} from "lucide-react"

const Hero = () => {
 



  return (

  <div className="h-screen">
    <h1 className=" text-center text-5xl font-bold">Marca Tus Objetivos<br></br>Organiza Tu Tiempo<br></br>Y Llega a Tus Metas</h1>
    <div className=" w-1/2 mt-5 mx-auto flex flex-col justify-center">
    
    <div className="flex justify-around"><img src="path1.png" alt="" /><img src="path1-8.png" alt="" /></div>
    <Button className="font-bold mx-auto">UNETE YA<ChevronRight/></Button>
    </div>
  
  </div>
 

  );
};

export default Hero
