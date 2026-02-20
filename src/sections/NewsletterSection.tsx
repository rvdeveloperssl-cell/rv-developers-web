import { useEffect, useRef, useState } from 'react';
import { Send, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
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
      title: 'Subscribed!',
      description: 'You\'ll receive our latest security insights.',
    });
    setEmail('');
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 rv-grid-overlay opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4F46E5]/10 rounded-full blur-3xl" />

      <div className="relative z-10 rv-container">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Headline */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#F4F6FF] leading-tight">
              Stay ahead of{' '}
              <span className="rv-text-gradient">threats.</span>
            </h2>
          </div>

          <p
            className={`text-lg text-[#A7ACB8] max-w-xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            Get weekly insights on security, performance, and building software that lasts.
          </p>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className={`flex flex-col sm:flex-row gap-4 max-w-lg mx-auto transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rv-input flex-grow"
              required
            />
            <button type="submit" className="rv-btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
              <Send className="w-4 h-4" />
              Subscribe
            </button>
          </form>

          {/* Trust Badge */}
          <div
            className={`flex items-center justify-center gap-2 text-sm text-[#A7ACB8] transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Shield className="w-4 h-4 text-[#4F46E5]" />
            <span>No spam. Unsubscribe anytime.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
