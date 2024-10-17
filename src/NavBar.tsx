import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

export default function Navbar() {
  
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between bg-card">
            
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-primary focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                >
                  HOME
                </NavigationMenuLink>
              </NavigationMenuItem>
             
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-4">
            <Link to={"/login"}>
            <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted hover:font-bold">
            <span>LOGIN</span>
          </Button></Link>
          <Link to={"/register"}>
          <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted hover:font-bold">
            <span>REGISTER</span> 
            </Button></Link>
            <Link to={"/task"}>
            
            <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted hover:font-bold">
            <span>TAREAS</span>
            </Button>
            </Link>
       
          </div>
        </div>
      </div>
    </header>
  )
}   