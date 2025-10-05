import { Link, useRouter } from '@tanstack/react-router'
import { LogIn, LogOut, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import { authClient } from '../lib/auth-client'

export default function Header() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [error, setError] = useState<string>('')

  // Show error toast for 3 seconds
  const showErrorToast = (msg: string) => {
    setError(msg)
    toast.error(msg, { duration: 3000 })
    setTimeout(() => setError(''), 3000)
  }

  const handleLogin = () => {
    try {
      router.navigate({ to: '/signin' })
    } catch (e: any) {
      showErrorToast(e?.message || 'Failed to navigate to sign in')
    }
  }

  const handleLogout = async () => {
    try {
      await authClient.signOut()
    } catch (e: any) {
      showErrorToast(e?.message || 'Failed to log out')
    }
  }

  return (
    <div>
      <header className="p-2 flex gap-2 bg-base-300 text-white justify-between items-center h-15">
        <div className="px-2 font-medium flex items-center gap-4">
          <Link to="/" activeProps={{ className: 'font-bold text-green-500' }}>
            Home
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/todos"
              activeProps={{ className: 'font-bold text-green-500' }}
              disabled={!session}
            >
              Todos
            </Link>
            {!session && (
              <div
                className="tooltip tooltip-bottom"
                data-tip="Sign In to access"
              >
                <ShieldAlert />
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!session ? (
            <button
              aria-label="Sign In"
              onClick={handleLogin}
              className="hover:text-green-500"
            >
              <LogIn />
            </button>
          ) : (
            <button
              aria-label="Sign Out"
              onClick={handleLogout}
              className="hover:text-red-500"
            >
              <LogOut />
            </button>
          )}
        </div>
      </header>
      <Toaster />
    </div>
  )
}
