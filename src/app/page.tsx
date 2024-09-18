import dynamic from "next/dynamic";
const Header = dynamic(() => import("./component/ui/Main/Header"), {
  ssr: false,
});
const Section = dynamic(() => import("./component/ui/Main/Section"), {
  ssr: false,
});

export default async function Home() {
  return (
    <>
      <Header />
      <Section />
    </>
  );
}
