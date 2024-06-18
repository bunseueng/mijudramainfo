import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Next.js App</title>
        <meta property="og:title" content="My Next.js App" />
        <meta
          property="og:description"
          content="This is a description of my Next.js app."
        />
        <meta
          property="og:image"
          content="https://m.media-amazon.com/images/M/MV5BMGE3NGNjNmItMTlhYy00NTlkLTljZjUtMjliNzE4M2U1N2E4XkEyXkFqcGdeQXVyMjI2ODE1NTA@._V1_FMjpg_UX1000_.jpg"
        />
        <meta property="og:url" content="https://mijudramalist.com" />
        <meta property="og:type" content="website" />
      </Head>
      <div>
        <h1>Welcome to My Next.js App</h1>
        {/* Add your other components here */}
      </div>
    </>
  );
}
