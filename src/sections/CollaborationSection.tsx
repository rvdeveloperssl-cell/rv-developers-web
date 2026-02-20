import { useEffect, useRef, useState } from 'react';
import { Send, Users, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const collaborationFeatures = [
  { icon: Users, label: 'Dedicated Team' },
  { icon: MessageSquare, label: 'Daily Standups' },
  { icon: Clock, label: 'Weekly Demos' },
  { icon: CheckCircle, label: 'Clear Deliverables' },
];

export default function CollaborationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);
  const { toast } = useToast();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Message Sent',
      description: 'We\'ll get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', company: '', message: '' });
  };

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
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team Collaboration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05060B]/60 via-transparent to-[#4F46E5]/10" />
            </div>

            {/* Features Overlay */}
            <div className="absolute -bottom-6 left-6 right-6 rv-panel p-4 grid grid-cols-2 gap-3">
              {collaborationFeatures.map((feature) => (
                <div key={feature.label} className="flex items-center gap-2">
                  <feature.icon className="w-4 h-4 text-[#4F46E5]" />
                  <span className="text-xs text-[#F4F6FF]">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Decorative */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-[#4F46E5]/20 rounded-full blur-2xl" />
          </div>

          {/* Right Column - Form */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Collaboration</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                We join your team—
                <br />
                <span className="rv-text-gradient">not the other way around.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
            >
              Weekly demos, clear docs, and honest timelines. No black-box handoffs.
            </p>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className={`space-y-4 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rv-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="rv-input"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="rv-input"
              />
              <textarea
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="rv-input resize-none"
                required
              />
              <button type="submit" className="rv-btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
