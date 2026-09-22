import Hero from '../components/Hero'
import TripPlanner from '../components/TripPlanner'
import TravelInsight from '../components/TravelInsight'
import FeatureSection from '../components/FeatureSection'
import HowItWorks from '../components/HowItWorks'

function scrollToPlan() {
  document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' })
}

export default function Home() {
  return (
    <main>
      <Hero onPlanClick={scrollToPlan} />
      <TripPlanner />
      <FeatureSection />
      <TravelInsight />
      <HowItWorks />
    </main>
  )
}
