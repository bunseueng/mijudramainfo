import { Button, Html } from "@react-email/components"; // Keep only essential components
import Link from "next/link";
import * as React from "react";

export default function FeedsReport({
  params,
}: {
  params: { username: string; reason: string; details: string; url: string };
}) {
  return (
    <Html>
      <html>
        <body>
          <h2>From {params.username},</h2>
          <p className="font-semibold">
            Reason: <span className="font-normal">{params.reason}</span>
          </p>
          <p className="font-semibold">
            Explanation: <span className="font-normal">{params.details}</span>
          </p>
          <h1>
            Navigate to the page from which the report is coming by clicking the
            button below.
          </h1>
          <Button
            href={params.url}
            style={{
              background: "#000",
              color: "#FFFFFF",
              padding: "12px 20px",
            }}
          >
            Click Here
          </Button>
          <hr />
          <p>
            Need Help? <Link href="">Contact our support team</Link> or hit us
            on Twitter or <Link href="/">@discord</Link>.
          </p>
          <p>
            Want to give us feedback? Let us know what you think on our{" "}
            <a href="">feedback site</a>.
          </p>
        </body>
      </html>
    </Html>
  );
}
