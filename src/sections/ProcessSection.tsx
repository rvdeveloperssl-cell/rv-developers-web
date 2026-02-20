import { useEffect, useRef, useState } from 'react';
import { Search, Layers, Code, ShieldCheck, ArrowRight } from 'lucide-react';

const phases = [
  {
    number: '01',
    icon: Search,
    title: 'Discovery',
    description: 'Scope, risks, and a clear roadmap.',
  },
  {
    number: '02',
    icon: Layers,
    title: 'Architecture',
    description: 'Data model, APIs, and security design.',
  },
  {
    number: '03',
    icon: Code,
    title: 'Build',
    description: 'Iterative shipping with weekly demos.',
  },
  {
    number: '04',
    icon: ShieldCheck,
    title: 'Harden',
    description: 'Tests, audits, docs, and handoff.',
  },
];

export default function ProcessSection() {
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
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#4F46E5]/10 rounded-full blur-3xl -translate-y-1/2" />

      <div className="relative z-10 rv-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column - Text */}
          <div className="space-y-8 lg:sticky lg:top-32">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Our Process</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Phased delivery.
                <br />
                <span className="rv-text-gradient">Zero surprises.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              Discovery → Architecture → Build → Harden. You see progress every week.
            </p>

            <div
              className={`transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button className="rv-btn-primary group flex items-center gap-2">
                See a sample roadmap
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Phases */}
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div
                key={phase.number}
                className={`rv-card p-6 group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <span className="mono text-3xl font-bold text-[#4F46E5]/50 group-hover:text-[#4F46E5] transition-colors">
                      {phase.number}
                    </span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <phase.icon className="w-5 h-5 text-[#4F46E5]" />
                      <h3 className="text-xl font-semibold text-[#F4F6FF]">{phase.title}</h3>
                    </div>
                    <p className="text-[#A7ACB8]">{phase.description}</p>
                  </div>
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-5 h-5 text-[#4F46E5]" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
