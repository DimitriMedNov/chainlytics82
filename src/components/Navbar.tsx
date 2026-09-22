
import { BarChart3, Calculator, Eye, Home, LogIn, LogOut, Menu, TrendingUp, Wallet } from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ThemeToggle from "@/components/ThemeToggle"
import { useAuth } from "@/contexts/AuthContext"
import { useSearch } from "@/contexts/SearchContext"
import { CoinSearchTrigger } from "@/components/search/CoinSearchTrigger"
import { toast } from "sonner"

const items = [
  { title: "Panel", url: "/", icon: Home },
  { title: "Mercados", url: "/markets", icon: TrendingUp },
  { title: "Portfolio", url: "/portfolio", icon: Wallet },
  { title: "Watchlist", url: "/watchlist", icon: Eye },
  { title: "Convertidor", url: "/converter", icon: Calculator },
]

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { session, user, signOut } = useAuth()
  const { open: openSearch } = useSearch()
  const [isOpen, setIsOpen] = useState(false)

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

  const handleSignOut = async () => {
    await signOut()
    toast.success("Sesión cerrada")
    navigate("/")
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-2 px-4 sm:px-8">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2 sm:mr-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="truncate font-semibold text-lg">Chainlytics</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 flex-1">
          <NavItems />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 ml-auto">
          <CoinSearchTrigger onClick={openSearch} />
          <ThemeToggle />
          {session ? (
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="hidden sm:flex gap-2">
              <LogOut className="h-4 w-4" />
              <span className="max-w-[120px] truncate">{user?.email}</span>
            </Button>
          ) : (
            <Button variant="default" size="sm" asChild className="hidden sm:flex gap-2">
              <NavLink to="/auth"><LogIn className="h-4 w-4" /> Iniciar sesión</NavLink>
            </Button>
          )}
          
          {/* Mobile menu trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden h-11 w-11">
                <Menu className="h-5 w-5" aria-hidden="true" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span className="font-semibold">Chainlytics</span>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <NavItems />
                <div className="pt-4 mt-2 border-t">
                  {session ? (
                    <Button variant="outline" className="w-full gap-2" onClick={() => { setIsOpen(false); handleSignOut() }}>
                      <LogOut className="h-4 w-4" /> Cerrar sesión
                    </Button>
                  ) : (
                    <Button asChild className="w-full gap-2" onClick={() => setIsOpen(false)}>
                      <NavLink to="/auth"><LogIn className="h-4 w-4" /> Iniciar sesión</NavLink>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
