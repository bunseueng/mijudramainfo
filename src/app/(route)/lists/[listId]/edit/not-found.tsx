import Link from "next/link";
import { LockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center space-y-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center">
          <LockIcon className="h-24 w-24 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Access Denied
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
          Not Authorized
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Sorry, you cannot access this page because you are not the owner. This
          content is private and only accessible to its creator.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/">Go back to homepage</Link>
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            If you believe this is a mistake, please{" "}
            <a
              href="/contact"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
