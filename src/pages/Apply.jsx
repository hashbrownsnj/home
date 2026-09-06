import { useCallback, useRef, useState } from 'react'
import ApplyHero from '../components/apply/ApplyHero.jsx'
import PathSelectorSection from '../components/apply/PathSelectorSection.jsx'
import DepartmentsSection from '../components/apply/DepartmentsSection.jsx'
import GrowthSection from '../components/apply/GrowthSection.jsx'
import FitFinder from '../components/apply/FitFinder.jsx'
import ApplicationForm from '../components/apply/ApplicationForm.jsx'
import FAQSection from '../components/apply/FAQSection.jsx'
import FinalCTA from '../components/apply/FinalCTA.jsx'

export default function Apply() {
  const [selectedPath, setSelectedPath] = useState(null)
  const [formStep, setFormStep] = useState(1)
  const formRef = useRef(null)

  const scrollToForm = useCallback(() => {
    // Let state updates flush before measuring/scrolling.
    window.requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  const handleSelectPath = useCallback((pathId) => {
    setSelectedPath(pathId)
    if (pathId) scrollToForm()
  }, [scrollToForm])

  const handleStartFromTop = useCallback(() => {
    scrollToForm()
  }, [scrollToForm])

  return (
    <div className="apply-page">
      <ApplyHero onStart={handleStartFromTop} />
      <PathSelectorSection selectedPath={selectedPath} onSelect={handleSelectPath} />
      <DepartmentsSection />
      <GrowthSection />
      <FitFinder onPick={handleSelectPath} />

      <section className="apply-section apply-form-section" id="apply-form" ref={formRef}>
        <div className="container container--narrow">
          <p className="apply-eyebrow">Your application</p>
          <h2 className="section-title">Let&rsquo;s get you set up.</h2>
          <ApplicationForm
            selectedPath={selectedPath}
            onSelectPath={setSelectedPath}
            formStep={formStep}
            onStepChange={setFormStep}
          />
        </div>
      </section>

      <FAQSection />
      <FinalCTA onStart={handleStartFromTop} />
    </div>
  )
}
