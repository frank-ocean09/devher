import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "../ui/button";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-primary/20">
      <div className="container mx-auto px-6 py-0">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="DevHer Logo"
              className="w-36 h-18 object-contain"
            />
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#about" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">About</a>
            <a href="#programs" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Programs</a>
            <a href="#impact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Impact</a>
            <a href="#partner" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Partner</a>
            <a href="#contact" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Contact</a>
          </div>

          {/* Get Started Button */}
          <div className="hidden md:block">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/30 font-bold">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Links */}
        {isOpen && (
          <div className="md:hidden mt-2 flex flex-col gap-2">
            <a href="#about" className="text-sm text-white hover:text-primary transition-colors font-medium">About</a>
            <a href="#programs" className="text-sm text-white hover:text-primary transition-colors font-medium">Programs</a>
            <a href="#impact" className="text-sm text-white hover:text-primary transition-colors font-medium">Impact</a>
            <a href="#partner" className="text-sm text-white hover:text-primary transition-colors font-medium">Partner</a>
            <a href="#contact" className="text-sm text-white hover:text-primary transition-colors font-medium">Contact</a>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/30 font-bold mt-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Get Started
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
