import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

const DramaReport = ({
  params,
}: {
  params: {
    username: string;
    problemType: string;
    extraDetails: string;
    url: string;
  };
}) => {
  return (
    <Html>
      <Head />
      <Preview>New problem report from {params.username}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Problem Report</Heading>
          <Text style={text}>
            A new problem has been reported by{" "}
            <strong>{params.username}</strong>.
          </Text>
          <Section style={problemSection}>
            <Heading as="h2" style={h2}>
              Path:
            </Heading>
            <Text style={text}>{params.url}</Text>
          </Section>
          <Section style={problemSection}>
            <Heading as="h2" style={h2}>
              Type of Problem:
            </Heading>
            <Text style={text}>{params.problemType}</Text>
          </Section>
          <Section style={problemSection}>
            <Heading as="h2" style={h2}>
              Extra Details:
            </Heading>
            <Text style={text}>{params.extraDetails}</Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Need help? Contact our{" "}
            <Link href="mailto:support@example.com" style={link}>
              support team
            </Link>{" "}
            or reach out on{" "}
            <Link href="https://twitter.com/example" style={link}>
              Twitter
            </Link>{" "}
            or{" "}
            <Link href="https://discord.gg/example" style={link}>
              Discord
            </Link>
            .
          </Text>
          <Text style={footer}>
            Want to give us feedback? Let us know what you think on our{" "}
            <Link href="https://feedback.example.com" style={link}>
              feedback site
            </Link>
            .
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default DramaReport;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "17px 0 0",
  textAlign: "center" as const,
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  padding: "0 0 8px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const problemSection = {
  padding: "24px 0 0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};

const link = {
  color: "#556cd6",
  textDecoration: "underline",
};
