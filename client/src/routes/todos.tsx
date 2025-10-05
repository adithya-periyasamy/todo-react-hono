import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { CircleX } from 'lucide-react'
import type { AppType } from '../../../server'
import { authClient } from '../lib/auth-client'

const client = hc<AppType>('/')

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data: session } = authClient.useSession()

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todos.$get()
      if (!res.ok) throw new Error('Failed to fetch todos')
      return res.json()
    },
    enabled: !!session, // Only fetch todos if user is authenticated
  })

  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-screen p-4">
      {!session ? (
        <div className="w-[420px] mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body space-y-6">
              <h2 className="text-2xl font-semibold text-center">
                Please Sign In
              </h2>
              <p className="text-center text-gray-600">
                You need to sign in or sign up to view and manage your todos.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/signin" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-outline">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Error alert using DaisyUI styling */}
          {isError && (
            <div className="flex items-center justify-center bg-red-500 text-white rounded-md shadow-md p-4">
              <CircleX className="mr-2" />
              <span>{(error as Error).message}</span>
            </div>
          )}
          {isLoading && (
            <div className="flex items-center justify-center skeleton w-[500px] h-[500px]">
              Loading...
            </div>
          )}
          <div className="flex flex-col gap-3 items-center justify-center">
            {data?.map(
              (todo: { id: string; title: string; completed: boolean }) => (
                <div key={todo.id} className="flex items-center gap-2 w-64">
                  <input
                    type="checkbox"
                    className="checkbox text-green-500"
                    // checked={todo.completed}
                    // readOnly
                  />
                  <span>{todo.title}</span>
                </div>
              ),
            )}
          </div>
        </>
      )}
    </div>
  )
}
