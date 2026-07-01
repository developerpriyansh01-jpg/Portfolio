import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import SectionHeader from '../shared/SectionHeader';

const defaultFAQ = [
  { _id: '1', question: 'How long does a typical project take?', answer: 'Project timelines vary based on complexity. A simple portfolio website takes 1-2 weeks, a full-stack app takes 4-8 weeks, and complex SaaS platforms can take 2-4 months. I always provide clear timeline estimates before starting.' },
  { _id: '2', question: 'What technologies do you specialize in?', answer: 'I specialize in the MERN stack (MongoDB, Express.js, React.js, Node.js), along with Tailwind CSS, Next.js, TypeScript, JWT authentication, Cloudinary, and cloud deployments on Vercel and Render.' },
  { _id: '3', question: 'Do you offer post-launch support?', answer: 'Yes! I offer 30 days of free bug fixes after launch. I also provide ongoing maintenance packages for clients who need regular updates, feature additions, or performance monitoring.' },
  { _id: '4', question: 'How do you handle project communication?', answer: 'I use regular check-ins via email or messaging apps, provide weekly progress updates, and maintain clear documentation. I\'m available during business hours and respond within 24 hours.' },
  { _id: '5', question: 'What\'s your pricing model?', answer: 'I offer both fixed-price and hourly billing depending on project scope. For well-defined projects, fixed pricing works best. For ongoing work or uncertain scopes, hourly is more flexible. I\'m always open to discussing what works for you.' },
  { _id: '6', question: 'Can you work with existing codebases?', answer: 'Absolutely! I have experience working with legacy codebases, performing code refactors, adding new features to existing systems, and migrating applications to modern tech stacks.' },
];

export default function FAQSection({ faq = [] }) {
  const [openIndex, setOpenIndex] = useState(null);
  const displayFAQ = faq.length > 0 ? faq : defaultFAQ;

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-neon-blue/4 rounded-full blur-[100px]" />

      <div className="section-container">
        <SectionHeader
          tag="❓ FAQ"
          title="Frequently Asked"
          titleGradient="Questions"
          subtitle="Everything you need to know before working together. Still have questions? Just ask!"
        />

        <div className="max-w-3xl mx-auto space-y-3">
          {displayFAQ.map((item, i) => (
            <motion.div
              key={item._id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-2xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className={`font-medium text-sm pr-4 ${openIndex === i ? 'text-neon-blue' : 'text-white'}`}>
                  {item.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className={`shrink-0 ${openIndex === i ? 'text-neon-blue' : 'text-slate-500'}`}
                >
                  <FiChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0">
                      <div className="h-px bg-white/5 mb-4" />
                      <p className="text-slate-400 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
