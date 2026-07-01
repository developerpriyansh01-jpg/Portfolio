import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import api from '../config/api';

// Section components
import HeroSection from '../components/sections/HeroSection';
import AboutSection from '../components/sections/AboutSection';
import SkillsSection from '../components/sections/SkillsSection';
import ServicesSection from '../components/sections/ServicesSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import ProjectsSection from '../components/sections/ProjectsSection';
import CertificatesSection from '../components/sections/CertificatesSection';
import TechStackSection from '../components/sections/TechStackSection';
import GitHubSection from '../components/sections/GitHubSection';
import CodingProfilesSection from '../components/sections/CodingProfilesSection';
import ReviewsSection from '../components/sections/ReviewsSection';
import FAQSection from '../components/sections/FAQSection';
import ContactSection from '../components/sections/ContactSection';
import { useOutletContext } from 'react-router-dom';

export default function HomePage() {
  const { onHireMeClick } = useOutletContext();
  const [data, setData] = useState({
    profile: null,
    skills: [],
    services: [],
    projects: [],
    experiences: [],
    certificates: [],
    reviews: [],
    settings: null,
    averageRating: 0,
    totalReviews: 0,
    totalVisitors: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [profileRes, skillsRes, servicesRes, projectsRes, expRes, certRes, reviewRes, settingsRes] = await Promise.allSettled([
          api.get('/profile'),
          api.get('/skills'),
          api.get('/services'),
          api.get('/projects?limit=20'),
          api.get('/experience'),
          api.get('/certificates'),
          api.get('/reviews?limit=20'),
          api.get('/settings'),
        ]);

        setData({
          profile: profileRes.value?.data?.data || null,
          skills: skillsRes.value?.data?.data || [],
          services: servicesRes.value?.data?.data || [],
          projects: projectsRes.value?.data?.data || [],
          experiences: expRes.value?.data?.data || [],
          certificates: certRes.value?.data?.data || [],
          reviews: reviewRes.value?.data?.data || [],
          averageRating: reviewRes.value?.data?.averageRating || 5.0,
          totalReviews: reviewRes.value?.data?.totalReviews || 0,
          settings: settingsRes.value?.data?.data || null,
          totalVisitors: 0,
          loading: false,
        });
      } catch (err) {
        setData((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchAllData();

    // Track page visit
    api.post('/analytics/track', { event: 'visit' }).catch(() => { });
  }, []);

  const { profile, skills, services, projects, experiences, certificates, reviews, settings, averageRating, totalReviews, totalVisitors } = data;

  return (
    <>
      <Helmet>
        <title>{settings?.siteName || 'Priyansh Rajput | Full Stack MERN Developer'}</title>
        <meta name="description" content={settings?.siteDescription || 'Priyansh Rajput - Full Stack MERN Web Developer with 3 years of experience. Building scalable web applications with React, Node.js, and MongoDB.'} />
        <meta name="keywords" content={settings?.siteKeywords || 'Priyansh Rajput, Full Stack Developer, MERN, React, Node.js, MongoDB, Portfolio'} />
        <meta name="author" content="Priyansh Rajput" />

        {/* Open Graph */}
        <meta property="og:title" content={settings?.siteName || 'Priyansh Rajput | Full Stack MERN Developer'} />
        <meta property="og:description" content={settings?.siteDescription || 'Full Stack MERN Developer Portfolio'} />
        <meta property="og:type" content="website" />
        {settings?.ogImage && <meta property="og:image" content={settings.ogImage} />}
        {settings?.canonicalUrl && <link rel="canonical" href={settings.canonicalUrl} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={settings?.siteName || 'Priyansh Rajput | Portfolio'} />
        {profile?.twitter && <meta name="twitter:creator" content={profile.twitter} />}

        {/* Schema.org */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Priyansh Rajput",
          "jobTitle": "Full Stack MERN Developer",
          "url": settings?.canonicalUrl || "https://priyanshrajput.dev",
          "sameAs": [profile?.github, profile?.linkedin, profile?.twitter].filter(Boolean),
          "knowsAbout": ["React.js", "Node.js", "MongoDB", "Express.js", "Full Stack Development"],
        })}</script>
      </Helmet>



      <main className="w-full max-w-full relative">
        <HeroSection profile={profile} onHireMeClick={onHireMeClick} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ServicesSection services={services} />
        <ExperienceSection experiences={experiences} />
        <ProjectsSection projects={projects} />
        <CertificatesSection certificates={certificates} />
        <TechStackSection />
        <GitHubSection profile={profile} />
        <CodingProfilesSection codingProfiles={settings?.codingProfiles || []} />
        <ReviewsSection reviews={reviews} averageRating={averageRating} totalReviews={totalReviews} />
        <FAQSection faq={settings?.faq || []} />
        <ContactSection profile={profile} />
      </main>
    </>
  );
}
