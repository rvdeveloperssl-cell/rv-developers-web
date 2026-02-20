import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Landmark, Heart, Cloud, ShoppingCart, Truck } from 'lucide-react';

const industries = [
  { icon: Landmark, name: 'Fintech', description: 'Secure payment solutions' },
  { icon: Heart, name: 'Healthcare', description: 'HIPAA-compliant systems' },
  { icon: Cloud, name: 'SaaS Platforms', description: 'Scalable architectures' },
  { icon: ShoppingCart, name: 'E-commerce', description: 'High-conversion stores' },
  { icon: Truck, name: 'Logistics', description: 'Supply chain optimization' },
];

export default function IndustriesSection() {
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
        <div className="space-y-12">
          {/* Header */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="rv-badge mb-4">Industries</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight max-w-2xl">
              Built for teams that can&apos;t afford{' '}
              <span className="rv-text-gradient">downtime.</span>
            </h2>
          </div>

          {/* Industries Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {industries.map((industry, index) => (
              <div
                key={industry.name}
                className={`rv-card p-6 group cursor-pointer transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mb-4 group-hover:bg-[rgba(79,70,229,0.25)] group-hover:scale-110 transition-all">
                  <industry.icon className="w-6 h-6 text-[#4F46E5]" />
                </div>
                <h3 className="text-[#F4F6FF] font-semibold mb-1">{industry.name}</h3>
                <p className="text-sm text-[#A7ACB8]">{industry.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className={`transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <button className="rv-btn-secondary group flex items-center gap-2">
              Explore solutions by industry
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
