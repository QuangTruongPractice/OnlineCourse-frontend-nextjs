'use client'
import { BookOpen, Menu, User } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import { useRouter, usePathname } from "next/navigation"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useAuthStore } from "../store/useAuthStore"
import { getMediaUrl } from "../utils/api"

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Khóa học", href: "/course/search" },
    { name: "Giới thiệu", href: "/about" },
    { name: "Khóa học của tôi", href: "/my-courses" },
  ]

  if (user) {
    navLinks.push({ name: "Tài khoản", href: "/user/profile" })
  }

  return (
    <header className="bg-primary text-primary-foreground shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">EduManageTTT</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 text-sm font-medium transition-colors hover:text-accent-foreground ${isActive ? "text-white" : "text-primary-foreground/70"
                    }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-white rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Auth buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9 ring-2 ring-primary/10 transition-transform group-hover:scale-110">
                      <AvatarImage src={getMediaUrl(user?.avatar)} alt={user?.username} />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                        {user?.username?.substring(0, 2).toUpperCase() || ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{`${user.first_name} ${user.last_name}`}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuItem onClick={() => router.push('/user/profile')}>
                    Tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="text-primary-foreground hover:opacity-80" onClick={() => router.push('/auth/signin')}>
                  Đăng nhập
                </Button>
                <Button variant="secondary" onClick={() => router.push('/auth/register')}>Đăng ký</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/10">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary" />
                    EduManageTTT
                  </SheetTitle>
                  <SheetDescription>
                    Học tập không giới hạn
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 pt-8">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-lg font-medium transition-colors flex items-center gap-2 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                          }`}
                      >
                        {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        {link.name}
                      </Link>
                    )
                  })}
                  <div className="pt-4 border-t space-y-4">
                    {user ? (
                      <>
                        <div className="flex items-center gap-3 p-2 bg-muted/50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={getMediaUrl(user?.avatar)} />
                            <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{`${user.first_name} ${user.last_name}`}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button className="w-full justify-start" variant="ghost" onClick={() => router.push('/user/profile')}>
                          Hồ sơ của tôi
                        </Button>
                        <Button className="w-full justify-start text-destructive hover:text-destructive" variant="ghost" onClick={handleLogout}>
                          Đăng xuất
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button className="w-full" onClick={() => router.push('/auth/signin')}>Đăng nhập</Button>
                        <Button className="w-full" variant="outline" onClick={() => router.push('/auth/register')}>Đăng ký</Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
