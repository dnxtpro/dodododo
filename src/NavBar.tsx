import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"
import { LogIn,UserPlus,Home } from "lucide-react"

export default function Navbar() {
  
  return (
    <header className="border-b bg-gradient-to-r from-pink-200 via-purple-200 to-blue-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between text-purple-900 font-bold">
            
        <NavigationMenu>
            <NavigationMenuList className="hidden md:flex">
              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/"
                  className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-purple-900 transition-colors hover:bg-white/20 focus:bg-white/20 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/20 data-[state=open]:bg-white/20"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-4">
            <Link to={"/login"}>
            <Button variant="ghost" size="sm" className="text-purple-900 hover:bg-white/20 hover:text-purple-950">
              <LogIn className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Button>
            </Link>
          <Link to={"/register"}>
          <Button variant="ghost" size="sm" className="text-purple-900 hover:bg-white/20 hover:text-purple-900">
              <UserPlus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Register</span>
            </Button></Link>
            <Link to={"/task"}>
            
            <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted hover:font-bold">
            <span>TAREAS</span>
            </Button>
            </Link>
            <Link to={"/tabla"}>
            
            <Button variant="ghost" asChild className="hover:text-primary hover:bg-muted hover:font-bold">
            <span>CALENDARIO SEMANAL</span>
            </Button>
            </Link>
       
          </div>
        </div>
      </div>
    </header>
  )
}   