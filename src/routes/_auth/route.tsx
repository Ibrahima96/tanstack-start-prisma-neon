import { buttonVariants } from '#/components/ui/button'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen w-full">
      <div className="flex min-h-screen w-full flex-col">
        <div className="p-8">
          <Link to="/" className={buttonVariants({variant:'secondary'})}>
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 md:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
