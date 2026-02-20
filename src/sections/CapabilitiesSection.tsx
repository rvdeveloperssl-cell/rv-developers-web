import { useEffect, useRef, useState } from 'react';
import { 
  Palette, 
  Smartphone, 
  Cloud, 
  Code2, 
  Shield, 
  GitBranch,
  ArrowRight
} from 'lucide-react';

const capabilities = [
  { icon: Palette, label: 'Product Design', description: 'UI/UX that converts' },
  { icon: Smartphone, label: 'Web & Mobile Apps', description: 'Cross-platform excellence' },
  { icon: Cloud, label: 'Cloud Infrastructure', description: 'Scalable & reliable' },
  { icon: Code2, label: 'API Development', description: 'Robust integrations' },
  { icon: Shield, label: 'Security Hardening', description: 'Enterprise-grade protection' },
  { icon: GitBranch, label: 'DevOps & CI/CD', description: 'Automated pipelines' },
];

export default function CapabilitiesSection() {
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
      
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 rv-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Our Services</span>
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Modular systems.
                <br />
                <span className="rv-text-gradient">Clear outcomes.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              We assemble the right stack for your product—then ship fast without cutting corners.
            </p>

            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button className="rv-btn-primary group flex items-center gap-2">
                See our process
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Capabilities Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {capabilities.map((cap, index) => (
              <div
                key={cap.label}
                className={`rv-card p-6 group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mb-4 group-hover:bg-[rgba(79,70,229,0.25)] group-hover:scale-110 transition-all">
                  <cap.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-[#F4F6FF] font-semibold mb-1">{cap.label}</h3>
                <p className="text-sm text-[#A7ACB8]">{cap.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
