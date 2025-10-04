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

const formSchema = z
  .object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string().min(6, { message: 'Please confirm password.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const Route = createFileRoute('/signup')({
  component: Signup,
})

function Signup() {
  const router = useRouter()
  const { data: session } = authClient.useSession()
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.navigate({ to: '/todos' })
    }
  }, [session, router])
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // TODO: handle sign up logic here (e.g., call API)
    setLoading(true)
    try {
      authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      })

      setErrorMessage('')
      toast.success('user created successfully!')
      router.navigate({
        to: '/todos',
      })
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong. Please try again.')
      setErrorMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
      console.log(values)
    }
  }

  return (
    <div className="flex items-center justify-center m-4 p-2 ">
      <div className="flex flex-col items-center justify-center m-4 p-2 w-[500px] h-[700px] border-2 border-gray-400 bg-gray-800 rounded-lg">
        <Toaster />

        <h1 className="text-2xl font-bold">Create an Account</h1>
        <h4 className="p-4">Sign up to get started</h4>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full p-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
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
              {loading ? 'Signing Up...' : 'Sign Up'}
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
          Already have an account?{' '}
          <Link to="/signin" className="text-green-200  underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
