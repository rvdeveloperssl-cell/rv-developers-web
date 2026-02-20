import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const technologies = [
  'React', 'Node.js', 'Python', 'Go',
  'AWS', 'Azure', 'PostgreSQL', 'MongoDB',
  'Kubernetes', 'Terraform', 'GraphQL', 'Rust',
];

export default function TechStackSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 rv-grid-overlay opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#7C3AED]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 rv-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Tech Stack</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Stack-agnostic.
                <br />
                <span className="rv-text-gradient">Future-ready.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              We integrate with your ecosystem—and recommend what actually reduces risk and maintenance.
            </p>

            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button className="rv-btn-primary group flex items-center gap-2">
                Talk to an architect
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Tech Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {technologies.map((tech, index) => (
              <div
                key={tech}
                className={`rv-card p-4 flex items-center justify-center text-center transition-all duration-500 hover:border-[#4F46E5]/50 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: `${200 + index * 50}ms` }}
              >
                <span className="text-sm font-medium text-[#F4F6FF]">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
