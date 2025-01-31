"use client";
import { useEffect } from "react";

export default function NotFound() {
  useEffect(() => {
    console.log("Environment variables:", process.env);
  }, []);

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
