import { useEffect, useRef, useState } from 'react';
import { Target, Eye, Shield, Zap, Users, Award } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

const values = [
  {
    icon: Shield,
    title: 'Security First',
    description: 'We build security into every layer of our software, ensuring your data remains protected.',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Our solutions are optimized for speed and efficiency, delivering exceptional user experiences.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'We work closely with our clients to understand their needs and deliver tailored solutions.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'We maintain the highest standards in code quality, testing, and documentation.',
  },
];

const milestones = [
  { year: '2020', title: 'Company Founded', description: 'RV Developers was established in Colombo, Sri Lanka.' },
  { year: '2021', title: 'First Major Client', description: 'Partnered with leading fintech company in Sri Lanka.' },
  { year: '2022', title: 'Product Launch', description: 'Launched our first suite of enterprise software products.' },
  { year: '2023', title: 'International Expansion', description: 'Started serving clients in multiple countries.' },
  { year: '2024', title: 'Platform Growth', description: 'Reached 1000+ active users on our platform.' },
];

export default function About({ onNavigate }: AboutProps) {
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
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="rv-container mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rv-badge mb-4">About Us</span>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#F4F6FF] mt-4 mb-6">
            Building the Future of{' '}
            <span className="rv-text-gradient">Software</span>
          </h1>
          <p className="text-lg text-[#A7ACB8]">
            RV Developers is a Sri Lankan software company dedicated to creating secure, 
            scalable, and innovative solutions for businesses worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section ref={sectionRef} className="rv-container mb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div
            className={`rv-panel p-8 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="w-14 h-14 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-[#4F46E5]" />
            </div>
            <h2 className="text-2xl font-bold text-[#F4F6FF] mb-4">Our Mission</h2>
            <p className="text-[#A7ACB8]">
              To empower businesses with cutting-edge software solutions that drive growth, 
              enhance security, and deliver exceptional value. We strive to be the trusted 
              technology partner for organizations seeking digital transformation.
            </p>
          </div>

          <div
            className={`rv-panel p-8 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <div className="w-14 h-14 rounded-lg bg-[rgba(124,58,237,0.15)] flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-[#7C3AED]" />
            </div>
            <h2 className="text-2xl font-bold text-[#F4F6FF] mb-4">Our Vision</h2>
            <p className="text-[#A7ACB8]">
              To become the leading software development company in Sri Lanka and a recognized 
              global player, known for innovation, quality, and customer-centric solutions that 
              make a positive impact on businesses and communities.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="rv-container mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F4F6FF] mb-4">Our Core Values</h2>
          <p className="text-[#A7ACB8] max-w-2xl mx-auto">
            These principles guide everything we do, from how we build software to how we treat our clients.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="rv-card p-6 text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-[#4F46E5]" />
              </div>
              <h3 className="text-lg font-semibold text-[#F4F6FF] mb-2">{value.title}</h3>
              <p className="text-sm text-[#A7ACB8]">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="rv-container mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#F4F6FF] mb-4">Our Journey</h2>
          <p className="text-[#A7ACB8]">Key milestones in our growth story</p>
        </div>

        <div className="max-w-3xl mx-auto">
          {milestones.map((milestone, index) => (
            <div key={milestone.year} className="relative flex gap-8 pb-8 last:pb-0">
              {/* Line */}
              {index !== milestones.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-[rgba(79,70,229,0.3)]" />
              )}
              
              {/* Dot */}
              <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center flex-shrink-0 z-10">
                <span className="text-white text-xs font-bold">{milestone.year.slice(2)}</span>
              </div>
              
              {/* Content */}
              <div className="pb-4">
                <span className="text-[#4F46E5] font-medium">{milestone.year}</span>
                <h3 className="text-xl font-semibold text-[#F4F6FF] mt-1">{milestone.title}</h3>
                <p className="text-[#A7ACB8] mt-1">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="rv-container">
        <div className="rv-panel p-12 text-center">
          <h2 className="text-3xl font-bold text-[#F4F6FF] mb-4">Ready to Work Together?</h2>
          <p className="text-[#A7ACB8] max-w-xl mx-auto mb-8">
            Let&apos;s discuss how we can help transform your business with our software solutions.
          </p>
          <button onClick={() => onNavigate('home')} className="rv-btn-primary">
            Get in Touch
          </button>
        </div>
      </section>
    </div>
  );
}
