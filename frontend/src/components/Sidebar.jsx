
import { Home, Search, Compass, Film, Heart, PlusSquare, User } from 'lucide-react'
import { Link } from 'react-router-dom'

const navItems = [
  { icon: Home, label: 'Home', href: '/home' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Compass, label: 'Explore', href: '/explore' },
  { icon: Film, label: 'Reels', href: '/reels' },
  { icon: Heart, label: 'Notifications', href: '/notifications' },
  { icon: PlusSquare, label: 'Create', href: '/create' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export const Sidebar=()=> {
  return (
    <aside className="bg-white w-64 fixed h-full border-r border-gray-200 mt-16 xl:block sm:hidden">
      <nav className="mt-5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
          >
            <item.icon className="h-6 w-6 mr-4" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

