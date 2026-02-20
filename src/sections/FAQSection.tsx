import { useEffect, useRef, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'Do you work with existing codebases?',
    answer: 'Absolutely. We specialize in modernizing legacy systems while maintaining business continuity. Our team conducts thorough code audits and creates migration plans that minimize risk.',
  },
  {
    question: 'How do you handle security testing?',
    answer: 'Security is integrated throughout our development process. We perform threat modeling, static analysis, dependency scanning, and penetration testing. Every release undergoes security review before deployment.',
  },
  {
    question: 'Can you support compliance requirements?',
    answer: 'Yes, we have experience with SOC 2, HIPAA, GDPR, and PCI DSS compliance. We build security controls into the architecture from day one and provide documentation for audits.',
  },
  {
    question: 'What does a typical engagement look like?',
    answer: 'We start with a discovery phase to understand your needs, followed by architecture design, iterative development with weekly demos, and a hardening phase before launch. Typical projects range from 8-24 weeks.',
  },
  {
    question: 'Do you provide maintenance after launch?',
    answer: 'Yes, we offer ongoing support packages that include monitoring, security updates, bug fixes, and feature enhancements. We recommend at least 3 months of post-launch support.',
  },
  {
    question: 'How fast can you start?',
    answer: 'We can typically begin discovery within 1-2 weeks of contract signing. For urgent projects, we offer expedited onboarding with dedicated resources.',
  },
];

export default function FAQSection() {
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <span className="rv-badge mb-4">FAQ</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#F4F6FF] mt-4">
              Questions?
            </h2>
          </div>

          {/* Accordion */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="rv-card border-none px-6"
                >
                  <AccordionTrigger className="text-left text-[#F4F6FF] font-semibold hover:text-[#4F46E5] transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#A7ACB8] pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
