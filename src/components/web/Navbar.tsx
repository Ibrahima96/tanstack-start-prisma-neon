import { ModeToggle } from "./mode-toggle"
import { Button } from "../ui/button"

const Navbar = () => {
  return (
    <nav className="sticky z-50 bg-background/95 backdrop-blur-md border-b ">
      <div className="flex max-w-6xl mx-auto h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img 
          className="size-10 inline-block"
          src="https://tanstack.com/images/logos/logo-black.svg" alt="logo"  />
          <h1 className="text-md font-semibold">TanStack Start</h1>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle/>
          <Button variant={"outline"}>Login</Button>
          <Button>Get Started</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
