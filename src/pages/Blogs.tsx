import Header from "@/components/Header";
import BlogsSection from "@/components/BlogsSection";
import Footer from "@/components/Footer";

const Blogs = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-16">
        <BlogsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Blogs;
