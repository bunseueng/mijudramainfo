"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MoveLeft, Home } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold mb-4 text-foreground dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-xl text-muted-foreground dark:text-gray-400 mb-8 max-w-md">
          Oops! The page you are looking for seems to have vanished into the
          digital void.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <MoveLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
        <Button onClick={() => router.push("/")} className="flex items-center">
          <Home className="mr-2 h-4 w-4" />
          Return Home
        </Button>
      </div>
    </div>
  );
}
