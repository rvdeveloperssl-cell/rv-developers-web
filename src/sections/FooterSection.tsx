import { Github, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

export default function FooterSection() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About', href: '#about' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#blog' },
      { label: 'Contact', href: '#contact' },
    ],
    services: [
      { label: 'Web Development', href: '#' },
      { label: 'Mobile Apps', href: '#' },
      { label: 'Cloud Solutions', href: '#' },
      { label: 'Security', href: '#' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/rv._developers', label: 'Instagram' },
    { icon: Facebook, href: 'https://www.facebook.com/share/17p1H7J8aR/', label: 'Facebook' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="relative py-16 overflow-hidden border-t border-[rgba(244,246,255,0.08)]">
      {/* Background */}
      <div className="absolute inset-0 rv-grid-overlay opacity-10" />

      <div className="relative z-10 rv-container">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] flex items-center justify-center">
                <span className="text-white font-bold text-lg">RV</span>
              </div>
              <span className="text-[#F4F6FF] font-semibold text-lg">DEVELOPERS</span>
            </div>
            <p className="text-[#A7ACB8] max-w-sm mb-6">
              Building secure, scalable software solutions for businesses that demand excellence.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-[rgba(244,246,255,0.05)] flex items-center justify-center text-[#A7ACB8] hover:bg-[rgba(79,70,229,0.15)] hover:text-[#4F46E5] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-[#F4F6FF] font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7ACB8] hover:text-[#4F46E5] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-[#F4F6FF] font-semibold mb-4">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7ACB8] hover:text-[#4F46E5] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-[#F4F6FF] font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-[#A7ACB8] hover:text-[#4F46E5] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[rgba(244,246,255,0.08)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#A7ACB8]">
            © {currentYear} RV Developers. All rights reserved.
          </p>
          <p className="text-sm text-[#A7ACB8]">
            Made with ❤️ in Sri Lanka
          </p>
        </div>
      </div>
    </footer>
  );
}
