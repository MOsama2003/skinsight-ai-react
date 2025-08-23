import Header from "@/components/Header";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <AboutSection />
      </div>
      <Footer />
    </div>
  );
};

export default About;
