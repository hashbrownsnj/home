import Hero from '../components/Hero.jsx'
import Ticker from '../components/Ticker.jsx'
import ScrollZoomScene from '../components/ScrollZoomScene.jsx'
import SpatialZoom from '../components/SpatialZoom.jsx'
import About from '../components/About.jsx'
import Team from '../components/Team.jsx'
import Projects from '../components/Projects.jsx'
import PinnedStrip from '../components/PinnedStrip.jsx'
import Contact from '../components/Contact.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <ScrollZoomScene />
      <SpatialZoom />
      <About />
      <Team />
      <Projects />
      <PinnedStrip />
      <Contact />
    </>
  )
}
