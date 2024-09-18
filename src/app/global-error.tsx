"use client";

import React, { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an external service or console for debugging
    console.error("Global error:", error);

    // You can also send the error to a monitoring service like Sentry, for example:
    // Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        {/* Show error message (could be hidden in production) */}
        <pre style={{ color: "red" }}>{error.message}</pre>

        {/* Optionally display stack trace for development purposes */}
        {process.env.NODE_ENV === "development" && (
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {error.stack}
          </pre>
        )}

        {/* Button to reset and retry */}
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  );
}
