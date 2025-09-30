import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface HeroProps {
  onOrderNow: () => void;
}

export const Hero = ({ onOrderNow }: HeroProps) => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-accent to-primary">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
          Delicious Food,
          <br />
          Delivered to Your Door
        </h1>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:100ms]">
          Order from our curated menu of chef-crafted dishes. Fresh ingredients, bold flavors, and fast delivery.
        </p>
        <Button
          size="lg"
          variant="secondary"
          className="gap-2 animate-fade-in [animation-delay:200ms] hover:scale-105 transition-transform"
          onClick={onOrderNow}
        >
          Order Now
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  );
};
