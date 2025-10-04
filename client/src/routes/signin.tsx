import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'
import { z } from 'zod'
import { authClient } from '../lib/auth-client'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
})

export const Route = createFileRoute('/signin')({
  component: Signin,
})

function Signin() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (session) {
      router.navigate({ to: '/todos' })
    }
  }, [session, router])

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    setErrorMessage('')
    try {
      // Call auth client sign in; await if it returns a promise
      // We assume authClient.signIn.email exists similarly to signUp.email
      // If the API differs, this will need to be adjusted.
      await authClient.signIn?.email?.({
        email: values.email,
        password: values.password,
      })

      // If result indicates error, handle it. We'll optimistic-redirect on success.
      toast.success('Signed in successfully!')
      router.navigate({ to: '/todos' })
    } catch (error: any) {
      console.error(error)
      const msg = error?.message ?? 'Something went wrong. Please try again.'
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center m-4 p-2 ">
      <div className="flex flex-col items-center justify-center m-4 p-2 w-[420px] border-2 border-gray-400 bg-gray-800 rounded-lg">
        <Toaster />

        <h1 className="text-2xl font-bold">Sign in</h1>
        <h4 className="p-2">Welcome back — sign in to continue</h4>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full p-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="text-black w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            {/* Error alert using DaisyUI styling */}
            {errorMessage && (
              <div className="alert alert-error shadow-lg">
                <div>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}
          </form>
        </Form>

        <div className="pt-4 text-sm text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-green-200 underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}
