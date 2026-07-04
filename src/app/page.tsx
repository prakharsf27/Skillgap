import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import AssessmentDeepDive from "@/components/AssessmentDeepDive";
import SampleReport from "@/components/SampleReport";
import JobRoleMatching from "@/components/JobRoleMatching";
import LearningRoadmap from "@/components/LearningRoadmap";
import SocialProof from "@/components/SocialProof";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#08080F] text-[#EEEEFF] font-sans antialiased min-h-screen">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <AssessmentDeepDive />
      <SampleReport />
      <JobRoleMatching />
      <LearningRoadmap />
      <SocialProof />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
