import { ArrowUpRight, Award, Code2 } from 'lucide-react';
import { FaAws, FaLinkedin } from 'react-icons/fa6';
import { SiFigma } from 'react-icons/si';

const cloudCertifications = [
  { name: 'AWS Cloud Foundations', issuer: 'Amazon Web Services', link: 'https://www.credly.com/badges/6af2504a-9dcc-434f-b1fb-d2a8e49ad382/linked_in_profile' },
  { name: 'AWS Machine Learning Foundations', issuer: 'AWS Academy Graduate', link: 'https://www.credly.com/badges/d055c99f-8284-4073-8657-1746dd48f7ea/linked_in_profile' },
  { name: 'AWS Machine Learning for Natural Language Processing', issuer: 'AWS Academy Graduate', link: 'https://www.credly.com/badges/7c7e0c3c-9e87-4962-a6ac-1815551012e8/linked_in_profile' },
  { name: 'AWS Data Engineering Foundations', issuer: 'AWS Academy Graduate', link: 'https://www.credly.com/badges/9063927c-796b-4d02-a7ea-aaa8553f2028/linked_in_profile' },
  { name: 'AWS Generative AI Foundations', issuer: 'AWS Academy Graduate', link: 'https://www.credly.com/badges/45aae555-abf3-4c98-8e89-5175e3b69d4d/linked_in_profile' },
];

const devCertifications = [
  { name: 'Java OOP', issuer: 'LinkedIn Learning', icon: FaLinkedin, color: '#7fadd5', link: 'https://www.linkedin.com/learning-login/share?account=57118729&forceAccount=false&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2Fcollections%2F7503016642931662848%3Ftrk%3Dshare_collection_url%26shareId%3DvuYB0JFqS222wpyDdMHpig%253D%253D' },
  { name: 'UI/UX with Figma', issuer: 'Figma', icon: SiFigma, color: '#d49680', link: undefined },
];

export function CertificationsSection() {
  return (
    <div className="py-20 md:py-28">
      <div className="container-custom">
        <header className="mb-12 md:mb-16">
          <h2 className="text-center font-display text-3xl md:text-5xl font-semibold">My <span className="gradient-text">certifications</span></h2>
          <p className="mt-4 max-w-xl mx-auto text-center text-sm md:text-base text-slate-300 leading-relaxed">Seven certifications across cloud, machine learning, programming, and design. A record of the things I have spent time learning.</p>
        </header>
        <div className="certification-groups">
          <div className="certification-group panel">
            <div className="certification-group-heading">
              <Award size={22} className="text-primary shrink-0" aria-hidden="true" />
              <div><h3 className="font-display text-xl md:text-2xl">AWS Certifications</h3><p>Cloud and machine learning · 05 credentials</p></div>
            </div>
            <ul className="certification-list">
              {cloudCertifications.map((cert) => (
                <li key={cert.name}>
                  <a href={cert.link} target="_blank" rel="noopener noreferrer" className="certification-row">
                    <FaAws size={25} className="text-[#d9b16d] shrink-0" aria-hidden="true" />
                    <span className="certification-copy"><span>{cert.name}</span><span>{cert.issuer}</span></span>
                    <ArrowUpRight size={17} className="shrink-0" aria-hidden="true" />
                    <span className="sr-only"> (opens credential in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="certification-group panel">
            <div className="certification-group-heading">
              <Code2 size={22} className="text-primary shrink-0" aria-hidden="true" />
              <div><h3 className="font-display text-xl md:text-2xl">Programming &amp; Design Certifications</h3><p>Software fundamentals and user experience · 02 credentials</p></div>
            </div>
            <ul className="certification-list">
              {devCertifications.map((cert) => {
                const Icon = cert.icon;
                const content = <><Icon size={23} className="shrink-0" style={{ color: cert.color }} aria-hidden="true" /><span className="certification-copy"><span>{cert.name}</span><span>{cert.issuer}</span></span>{cert.link && <><ArrowUpRight size={17} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (opens credential in a new tab)</span></>}</>;
                return <li key={cert.name}>{cert.link ? <a href={cert.link} target="_blank" rel="noopener noreferrer" className="certification-row">{content}</a> : <div className="certification-row">{content}</div>}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
