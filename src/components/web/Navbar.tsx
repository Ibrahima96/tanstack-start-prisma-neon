import { ModeToggle } from './mode-toggle'
import { Button, buttonVariants } from '../ui/button'
import { authClient } from '#/lib/auth-client'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession()
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success('Logout successfully.....')
        },
        onError: ({ error }) => {
          toast.error(error.message)
        },
      },
    })
  }
  return (
    <nav className="sticky z-50 bg-background/95 backdrop-blur-md border-b ">
      <div className="flex max-w-6xl mx-auto h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img
            className="size-10 inline-block rounded-full"
            src="https://i.pinimg.com/736x/e9/8d/a3/e98da36dabbe5c05a033bf0911f19ad4.jpg"
            alt="logo"
          />
          <h1 className="text-md font-semibold">TanStack Start</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />

          {isPending ? null : session ? (
            <>
              <Button
                onClick={handleLogout}
                className="cursor-pointer"
                variant={'secondary'}
              >
                Logout
              </Button>
              <Link to="/dashboard" className={buttonVariants()}>
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={buttonVariants({ variant: 'secondary' })}
              >
                Login
              </Link>
              <Link to="/" className={buttonVariants()}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
