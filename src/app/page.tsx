import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { MoreWork } from "@/components/sections/MoreWork";
import { OffScreen } from "@/components/sections/OffScreen";
import { OnOff } from "@/components/sections/OnOff";
import { Stack } from "@/components/sections/Stack";
import { Timeline } from "@/components/sections/Timeline";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <main id="main">
        <Hero />
        <Intro />
        <OnOff />
        <Work />
        <Stack />
        <MoreWork />
        <OffScreen />
        <Timeline />
      </main>
      <Footer />
    </>
  );
}
