import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-50 to-green-100">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8 flex justify-center">
          <CheckCircle className="h-24 w-24 text-green-500 animate-bounce" />
        </div>
        <h1 className="mb-4 text-4xl font-bold text-green-800">Success!</h1>
        <p className="mb-8 text-xl text-green-600">
          Your action has been completed successfully.
        </p>
        <Button asChild className="animate-pulse">
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
}
