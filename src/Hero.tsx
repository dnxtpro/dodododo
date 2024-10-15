
import { motion } from "framer-motion";
import { Button } from "./components/ui/button";
import {ChevronRight} from "lucide-react"

const Hero = () => {
 

    const divs = Array.from({ length: 15 }, (_, index) => (
      <div key={index} className="h-10 bg-yellow-400 border-2 rounded"></div>
    ));


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
