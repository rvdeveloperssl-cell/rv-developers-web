import { useEffect, useRef, useState } from 'react';
import { Shield, Lock, Eye, Fingerprint, ArrowRight } from 'lucide-react';

const securityFeatures = [
  { icon: Lock, label: 'End-to-End Encryption' },
  { icon: Eye, label: 'Real-time Monitoring' },
  { icon: Fingerprint, label: 'Biometric Auth' },
  { icon: Shield, label: 'Threat Detection' },
];

export default function SecuritySection() {
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
          {/* Left Column - Image */}
          <div
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80"
                alt="Security"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05060B]/80 via-transparent to-[#4F46E5]/20" />
              
              {/* Floating Security Badge */}
              <div className="absolute bottom-6 left-6 rv-panel px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-[#F4F6FF] font-medium text-sm">SOC 2 Compliant</div>
                  <div className="text-xs text-[#A7ACB8]">Certified Security</div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#4F46E5]/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#7C3AED]/20 rounded-full blur-2xl" />
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Security First</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Security by design—
                <br />
                <span className="rv-text-gradient">not afterthought.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              Threat modeling, secure defaults, and continuous hardening built into every sprint. We ship code that holds up under real-world pressure.
            </p>

            {/* Security Features */}
            <div
              className={`grid grid-cols-2 gap-4 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {securityFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(244,246,255,0.03)] border border-[rgba(244,246,255,0.05)]"
                >
                  <feature.icon className="w-5 h-5 text-[#4F46E5]" />
                  <span className="text-sm text-[#F4F6FF]">{feature.label}</span>
                </div>
              ))}
            </div>

            <div
              className={`transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button className="rv-btn-primary group flex items-center gap-2">
                Request a security audit
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
