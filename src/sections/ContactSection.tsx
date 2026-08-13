import { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, Send, Instagram, Facebook, Linkedin, Twitter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
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
      title: 'Inquiry Sent',
      description: 'We\'ll get back to you within 24 hours.',
    });
    setFormData({ name: '', email: '', company: '', budget: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Head Office',
      details: 'No 55 Kalugalla Road, Nugawela ,Kandy, Sri Lanka',
    },
    {
      icon: Mail,
      title: 'Email',
      details: 'rvdevelopers.sl@gmail.com',
    },
    {
      icon: Phone,
      title: 'Phone',
      details: '+94 75 318 3178',
    },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/rv._developers', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/share/17p1H7J8aR/', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-24 lg:py-32 overflow-hidden bg-[#0B0E16]"
    >
      {/* Background */}
      <div className="absolute inset-0 rv-grid-overlay opacity-20" />

      <div className="relative z-10 rv-container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              <span className="rv-badge mb-4">Contact</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4 leading-tight">
                Let&apos;s build something{' '}
                <span className="rv-text-gradient">extraordinary.</span>
              </h2>
            </div>

            <p
              className={`text-lg text-[#A7ACB8] max-w-lg transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
              }`}
            >
              Ready to transform your ideas into reality? Get in touch and let&apos;s discuss your project.
            </p>

            {/* Contact Details */}
            <div
              className={`space-y-6 transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {contactInfo.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[rgba(79,70,229,0.15)] flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#4F46E5]" />
                  </div>
                  <div>
                    <h3 className="text-[#F4F6FF] font-semibold mb-1">{item.title}</h3>
                    <p className="text-[#A7ACB8]">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div
              className={`flex gap-4 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[rgba(244,246,255,0.05)] flex items-center justify-center text-[#A7ACB8] hover:bg-[rgba(79,70,229,0.15)] hover:text-[#4F46E5] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
          >
            <form onSubmit={handleSubmit} className="rv-panel p-8 space-y-6">
              <h3 className="text-xl font-semibold text-[#F4F6FF] mb-6">Send us a message</h3>
              
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

              <select
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                className="rv-input"
              >
                <option value="">Select Budget Range</option>
                <option value="10k-25k">LKR 10,000 - 25,000</option>
                <option value="25k-50k">LKR 25,000 - 50,000</option>
                <option value="50k-100k">LKR 50,000 - 100,000</option>
                <option value="100k+">LKR 100,000+</option>
              </select>

              <textarea
                placeholder="Tell us about your project..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="rv-input resize-none"
                required
              />

              <button type="submit" className="rv-btn-primary w-full flex items-center justify-center gap-2">
                <Send className="w-4 h-4" />
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
