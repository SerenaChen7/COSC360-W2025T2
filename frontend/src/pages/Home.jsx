import HeroBanner from "../components/HeroBanner";
import ProjectTabs from "../components/ProjectTabs";
import HomeCourse from "../components/HomeCourse";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import SpotlightSection from "../components/SpotlightSection";
export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <HeroBanner />
      <ProjectTabs />
      <SpotlightSection /> 
    </>
  );
}