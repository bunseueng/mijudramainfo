import type { Metadata } from "next";
import AutoRedirect from "./AutoRedirect";

export const metadata: Metadata = {
  title: "Redirecting...",
  description: "You are being redirected to the destination page",
};

export default async function RedirectPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const url = resolvedSearchParams.url as string;
  const message = resolvedSearchParams.message as string;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <AutoRedirect
        redirectUrl={url}
        countdownSeconds={5}
        message={`You'll be redirected to the ${message} in`}
      />
    </main>
  );
}
