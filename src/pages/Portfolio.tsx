import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ExternalLink, CheckCircle } from 'lucide-react';
import { mockProjects } from '@/data/mockData';

interface PortfolioProps {
  onNavigate: (page: string, params?: Record<string, string>) => void;
}

export default function Portfolio({ onNavigate }: PortfolioProps) {
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
      {/* Hero */}
      <section className="rv-container mb-20">
        <div className="text-center max-w-3xl mx-auto">
          <span className="rv-badge mb-4">Portfolio</span>
          <h1 className="text-4xl lg:text-6xl font-bold text-[#F4F6FF] mt-4 mb-6">
            Our{' '}
            <span className="rv-text-gradient">Featured Work</span>
          </h1>
          <p className="text-lg text-[#A7ACB8]">
            Explore our successful projects and see how we&apos;ve helped businesses 
            transform their digital presence.
          </p>
        </div>
      </section>

      {/* Projects */}
      <section ref={sectionRef} className="rv-container">
        <div className="space-y-20">
          {mockProjects.map((project, index) => (
            <div
              key={project.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image */}
              <div
                className={`relative aspect-video rounded-2xl overflow-hidden rv-glow ${
                  index % 2 === 1 ? 'lg:order-2' : ''
                } transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16]/80 via-transparent to-transparent" />
                
                {/* Industry Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-[rgba(79,70,229,0.3)] text-[#F4F6FF] text-sm">
                    {project.industry}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div
                className={`space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''} transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
                style={{ transitionDelay: `${index * 200 + 100}ms` }}
              >
                <div>
                  <span className="text-sm text-[#4F46E5] font-medium">{project.client}</span>
                  <h2 className="text-3xl font-bold text-[#F4F6FF] mt-2">{project.title}</h2>
                </div>

                <p className="text-[#A7ACB8] text-lg">{project.description}</p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full bg-[rgba(244,246,255,0.05)] text-[#A7ACB8] text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Results */}
                <div className="space-y-3">
                  <h3 className="text-[#F4F6FF] font-semibold">Key Results</h3>
                  {project.results.map((result) => (
                    <div key={result} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-[#A7ACB8]">{result}</span>
                    </div>
                  ))}
                </div>

                <button className="rv-btn-secondary flex items-center gap-2">
                  View Case Study
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rv-container mt-20">
        <div className="rv-panel p-12 text-center">
          <h2 className="text-3xl font-bold text-[#F4F6FF] mb-4">Have a Project in Mind?</h2>
          <p className="text-[#A7ACB8] max-w-xl mx-auto mb-8">
            Let&apos;s discuss how we can help bring your vision to life with our expertise.
          </p>
          <button onClick={() => onNavigate('home')} className="rv-btn-primary flex items-center gap-2 mx-auto">
            Start a Project
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
