import Header from '../components/Header'
import Hero from '../components/Hero'
import Timeline from '../components/Timeline'
import Significance from '../components/Significance'
import Map from '../components/Map'
import Artifacts from '../components/Artifacts'
import Excavations from '../components/Excavations'
import Research from '../components/Research'
import Gallery from '../components/Gallery'
import Team from '../components/Team'
import Footer from '../components/Footer'

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Timeline />
        <Significance />
        <Map />
        <Artifacts />
        <Excavations />
        <Research />
        <Gallery />
        <Team />
      </main>
      <Footer />
    </>
  )
}
