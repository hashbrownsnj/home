import { useScroll, useSpring } from 'framer-motion'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Ticker from './components/Ticker.jsx'
import About from './components/About.jsx'
import Team from './components/Team.jsx'
import Projects from './components/Projects.jsx'
import PinnedStrip from './components/PinnedStrip.jsx'
import Contact from './components/Contact.jsx'

export default function App() {
  const { scrollYProgress } = useScroll()
  // Spring-smooth the progress bar so it doesn't feel mechanical
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
  })

  return (
    <>
      {/* Film-grain texture overlay */}
      <div className="grain" aria-hidden="true" />

      <Nav scrollProgress={scrollProgress} />

      <main>
        <Hero />
        <Ticker />
        <About />
        <Team />
        <Projects />
        <PinnedStrip />
        <Contact />
      </main>
    </>
  )
}
