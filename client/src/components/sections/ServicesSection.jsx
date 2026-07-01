import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import SectionHeader from '../shared/SectionHeader';
import { staggerContainer, staggerItem } from '../../utils/animations';

const getIcon = (name) => {
  const allIcons = { ...FiIcons, ...FaIcons };
  const Icon = allIcons[name];
  return Icon ? <Icon className="w-7 h-7" /> : <FiIcons.FiCode className="w-7 h-7" />;
};

export default function ServicesSection({ services = [] }) {
  const defaultServices = [
    { _id: '1', title: 'Full Stack Web App', description: 'End-to-end web applications from design to deployment using the MERN stack with optimal performance and scalability.', icon: 'FaReact', color: '#00d4ff', gradient: 'from-cyan-500 to-blue-600', features: ['React.js Frontend', 'Node.js Backend', 'MongoDB Database', 'REST API Design'] },
    { _id: '2', title: 'Backend API Development', description: 'Robust, scalable REST APIs with JWT authentication, role-based access, rate limiting, and comprehensive error handling.', icon: 'FaNodeJs', color: '#68a063', gradient: 'from-green-500 to-emerald-600', features: ['RESTful APIs', 'JWT Auth', 'Database Design', 'API Documentation'] },
    { _id: '3', title: 'Frontend Development', description: 'Pixel-perfect, responsive user interfaces with modern animations, accessibility, and cross-browser compatibility.', icon: 'FiLayers', color: '#a855f7', gradient: 'from-purple-500 to-violet-600', features: ['React & Tailwind', 'Framer Motion', 'Mobile Responsive', 'SEO Optimized'] },
    { _id: '4', title: 'Database Design', description: 'Efficient MongoDB schema design, indexing strategies, aggregation pipelines, and performance optimization.', icon: 'FaDatabase', color: '#f59e0b', gradient: 'from-amber-500 to-orange-600', features: ['MongoDB Schema', 'Data Modeling', 'Query Optimization', 'Backup Strategy'] },
    { _id: '5', title: 'E-Commerce Solutions', description: 'Feature-rich e-commerce platforms with payment integration, inventory management, and admin dashboards.', icon: 'FiShoppingCart', color: '#ec4899', gradient: 'from-pink-500 to-rose-600', features: ['Product Management', 'Payment Integration', 'Order Tracking', 'Admin Dashboard'] },
    { _id: '6', title: 'Tech Consulting', description: 'Technical consulting for startups and businesses on architecture decisions, technology stack selection, and best practices.', icon: 'FiMessageSquare', color: '#06b6d4', gradient: 'from-cyan-500 to-sky-600', features: ['Architecture Review', 'Tech Stack Selection', 'Code Review', 'Performance Audit'] },
  ];

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <section id="services" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-neon-purple/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="section-container">
        <SectionHeader
          tag="💼 Services"
          title="What I"
          titleGradient="Offer"
          subtitle="From concept to deployment — I deliver complete, production-ready solutions tailored to your needs."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayServices.map((service) => (
            <motion.div
              key={service._id || service.title}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="gradient-border glass-card p-6 group cursor-pointer relative overflow-hidden"
            >
              {/* Background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${service.color}10, transparent 60%)` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)`, border: `1px solid ${service.color}30` }}
              >
                <span style={{ color: service.color }}>{getIcon(service.icon)}</span>
              </div>

              <h3 className="font-heading font-bold text-white text-lg mb-2 relative z-10">{service.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4 relative z-10">{service.description}</p>

              {/* Features */}
              {service.features?.length > 0 && (
                <ul className="space-y-1 relative z-10">
                  {service.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="w-1 h-1 rounded-full" style={{ background: service.color }} />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}

              {/* Arrow */}
              <div className="mt-4 flex items-center gap-1 text-xs relative z-10" style={{ color: service.color }}>
                <span>Learn More</span>
                <FiArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
