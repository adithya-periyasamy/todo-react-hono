import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
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
  const router = useRouter()

  if (!session) {
    router.navigate({ to: '/signin' })
    return null
  }

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const resp = await client.api.todos.$get()
      if (!resp.ok) throw new Error('Failed to fetch todos')
      return resp.json()
    },
  })

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      {isError && (
        <div className="alert-error bg-red-500 text-white rounded-md shadow-md p-4">
          <CircleX />
          <span>{(error as Error).message}</span>
        </div>
      )}
      {isLoading && (
        <div className=" flex items-center justify-center skeleton w-[500px] h-[500px] ">
          Loading...
        </div>
      )}
      {data?.map((todo) => {
        return (
          <div className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" />
            <div key={todo.id}>{todo.title}</div>
          </div>
        )
      })}
    </div>
  )
}
