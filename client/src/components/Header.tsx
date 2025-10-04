import { Link } from '@tanstack/react-router'
import { LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import { authClient } from '../lib/auth-client'

export default function Header() {
  const [session, setSession] = useState<any>(null)

  authClient.useSession()
  return (
    <header className="p-2 flex gap-2 bg-base-300 text-white justify-between items-center h-15">
      <div className="px-2 space-x-4 font-medium">
        <Link to="/" activeProps={{ className: 'font-bold text-green-500' }}>
          Home
        </Link>

        <Link
          to="/todos"
          activeProps={{ className: 'font-bold text-green-500' }}
        >
          Todos
        </Link>
      </div>
      <div className="flex gap-2">
        <LogIn />
        <LogOut />
      </div>
    </header>
  )
}
