import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { hc } from 'hono/client'
import { CircleX } from 'lucide-react'
import type { AppType } from '../../../server'

const client = hc<AppType>('/')

export const Route = createFileRoute('/todos')({
  component: RouteComponent,
})

function RouteComponent() {
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await client.api.todos.$get()
      if (!res.ok) throw new Error('Failed to fetch todos')
      return res.json()
    },
  })

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen">
      {/* Error alert using DaisyUI styling */}
      {isError && (
        <div className=" flex items-center justify-center bg-red-500 text-white rounded-md shadow-md p-4">
          <CircleX />
          <span>{(error as Error).message}</span>
        </div>
      )}
      {isLoading && (
        <div className=" flex items-center justify-center skeleton  w-[500px] h-[500px] ">
          Loading...
        </div>
      )}
      <div className="flex flex-col gap-3 items-center justify-center">
        {data?.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center gap-2 w-64" // fixed width keeps all aligned
          >
            <input type="checkbox" className="checkbox text-green-500" />
            <span>{todo.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
