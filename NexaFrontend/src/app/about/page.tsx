import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AboutHero from '../../components/AboutHero';
import Mission from '../../components/Mission';
import DetailedFeatures from '../../components/DetailedFeatures';
import Stats from '../../components/Stats';
import Team from '../../components/Team';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AboutHero />
        <Mission />
        <DetailedFeatures />
        <Stats />
        <Team />
      </main>
      <Footer />
    </div>
  );
}