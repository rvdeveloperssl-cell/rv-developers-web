import { useEffect, useRef, useState } from 'react';
import { ArrowRight, TrendingUp, Activity, Accessibility } from 'lucide-react';

const metrics = [
  { icon: TrendingUp, value: '40%', label: 'faster checkout flow' },
  { icon: Activity, value: '99.99%', label: 'uptime after hardening' },
  { icon: Accessibility, value: 'WCAG 2.1', label: 'AA compliant' },
];

export default function FeaturedWorkSection() {
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

      <div className="relative z-10 rv-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <span className="mono text-xs text-[#4F46E5] tracking-widest uppercase">
                Featured Work
              </span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Merchant Portal
                <br />
                <span className="rv-text-gradient">Redesign</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              A complete overhaul of a fintech merchant portal with modern UI, enhanced security, and improved user experience.
            </p>

            {/* Metrics */}
            <div
              className={`space-y-4 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(244,246,255,0.03)] border border-[rgba(244,246,255,0.05)]"
                >
                  <div className="w-10 h-10 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center">
                    <metric.icon className="w-5 h-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <span className="text-2xl font-bold text-[#F4F6FF]">{metric.value}</span>
                    <span className="text-[#A7ACB8] ml-2">{metric.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button className="rv-btn-primary group flex items-center gap-2">
                Read the case study
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden rv-glow">
              <img
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80"
                alt="Merchant Portal"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tl from-[#05060B]/60 via-transparent to-[#4F46E5]/10" />
            </div>

            {/* Decorative */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-[#4F46E5]/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
