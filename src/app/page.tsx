import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Timeline from '@/components/Timeline';
import Gallery from '@/components/Gallery';
import Artifacts from '@/components/Artifacts';
import Excavations from '@/components/Excavations';
import Research from '@/components/Research';
import Significance from '@/components/Significance';
import Reconstruction from '@/components/Reconstruction';
import Team from '@/components/Team';
import Map from '@/components/Map';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features sections={[]} />
        <Timeline />
        <Gallery />
        <Artifacts />
        <Excavations />
        <Research />
        <Significance />
        <Reconstruction />
        <Team />
        <Map />
      </main>
      <Footer />
    </>
  );
}
