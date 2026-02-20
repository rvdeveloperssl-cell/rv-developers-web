import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Shield, Cloud, Zap, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const techFeatures = [
    { icon: Cloud, label: 'Cloud-native backends' },
    { icon: Shield, label: 'Zero-trust security' },
    { icon: Zap, label: 'Performance at scale' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05060B]/60 via-[#05060B]/40 to-[#05060B]" />
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 rv-grid-overlay opacity-30" />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#4F46E5] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full rv-container pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-10rem)]">
          {/* Left Column - Text */}
          <div className="space-y-8">
            {/* Badge */}
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[rgba(79,70,229,0.15)] border border-[rgba(79,70,229,0.3)] transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
              <span className="text-sm text-[#4F46E5] font-medium">
                RV DEVELOPERS — SRI LANKA
              </span>
            </div>

            {/* Headline */}
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight transition-all duration-1000 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="text-[#F4F6FF]">Build.</span>
              <br />
              <span className="text-[#F4F6FF]">Secure.</span>
              <br />
              <span className="rv-text-gradient">Scale.</span>
            </h1>

            {/* Subheadline */}
            <p
              className={`text-lg lg:text-xl text-[#A7ACB8] max-w-xl leading-relaxed transition-all duration-1000 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              RV Developers designs, builds, and hardens software for teams that move fast—and can&apos;t afford to break.
            </p>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <button
                onClick={() => onNavigate('software')}
                className="rv-btn-primary group flex items-center gap-2"
              >
                Explore Software
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="rv-btn-secondary flex items-center gap-2"
              >
                Learn More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Stats */}
            <div
              className={`flex gap-8 pt-8 border-t border-[rgba(244,246,255,0.08)] transition-all duration-1000 delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div>
                <div className="text-3xl font-bold text-[#F4F6FF]">50+</div>
                <div className="text-sm text-[#A7ACB8]">Software Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F4F6FF]">1000+</div>
                <div className="text-sm text-[#A7ACB8]">Happy Clients</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#F4F6FF]">99.9%</div>
                <div className="text-sm text-[#A7ACB8]">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Column - Tech Card */}
          <div
            className={`relative transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="relative rv-panel p-8 lg:p-10 rv-glow">
              {/* Decorative Elements */}
              <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] rounded-lg opacity-20 blur-2xl" />
              <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#4F46E5] rounded-lg opacity-20 blur-2xl" />

              {/* Card Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-[#F4F6FF] font-semibold">RV Platform</div>
                    <div className="text-xs text-[#A7ACB8] mono">v2.4.1-stable</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-green-400 mono">OPERATIONAL</span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                {techFeatures.map((feature, index) => (
                  <div
                    key={feature.label}
                    className="flex items-center gap-4 p-4 rounded-lg bg-[rgba(244,246,255,0.03)] border border-[rgba(244,246,255,0.05)] hover:border-[rgba(79,70,229,0.3)] transition-colors group"
                    style={{ animationDelay: `${600 + index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center group-hover:bg-[rgba(79,70,229,0.25)] transition-colors">
                      <feature.icon className="w-5 h-5 text-[#4F46E5]" />
                    </div>
                    <span className="text-[#F4F6FF] font-medium">{feature.label}</span>
                    <div className="ml-auto flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] opacity-60" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4F46E5] opacity-30" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="mt-8 pt-6 border-t border-[rgba(244,246,255,0.08)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] border-2 border-[#0B0E16] flex items-center justify-center text-xs text-white font-medium"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm text-[#A7ACB8]">+1,000 active users</span>
                  </div>
                  <button
                    onClick={() => onNavigate('software')}
                    className="text-sm text-[#4F46E5] hover:text-[#7C3AED] transition-colors flex items-center gap-1"
                  >
                    View All
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05060B] to-transparent" />
    </section>
  );
}
