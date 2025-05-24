
import { BarChart3, Eye, Calculator, TrendingUp, Home, Menu, X } from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "@/components/ThemeToggle"

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Watchlist", url: "/watchlist", icon: Eye },
  { title: "Converter", url: "/converter", icon: Calculator },
  { title: "Markets", url: "/markets", icon: TrendingUp },
]

export function Navbar() {
  const location = useLocation()
  const currentPath = location.pathname
  const [isOpen, setIsOpen] = useState(false)

  const isActive = (path: string) => currentPath === path

  const NavItems = () => (
    <>
      {items.map((item) => (
        <NavLink
          key={item.title}
          to={item.url}
          end
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 mr-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Crypto Dashboard</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 flex-1">
          <NavItems />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          
          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Crypto Dashboard</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <NavItems />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
