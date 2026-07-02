import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-brand text-white shadow-glow"
      >
        <Compass className="h-10 w-10" />
      </motion.div>
      <h1 className="mt-6 font-display text-4xl font-bold">404</h1>
      <p className="mt-2 max-w-sm text-muted-foreground">
        This screen isn't part of the InfraGrit demo. Let's get you back to the Command Centre.
      </p>
      <Button asChild variant="gradient" className="mt-6">
        <Link to="/command-centre">
          <ArrowLeft className="h-4 w-4" /> Back to Command Centre
        </Link>
      </Button>
    </div>
  );
}
