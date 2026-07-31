import React from 'react';
import sunoLogo from '../../logo/verified_company_logos/Suno_AI.png';
import elevenLabsLogo from '../../logo/verified_company_logos/ElevenLabs.png';
import udioLogo from '../../logo/verified_company_logos/Udio.png';
import melodyCraftLogo from '../../logo/verified_company_logos/MelodyCraft.png';
import sonicLabsLogo from '../../logo/verified_company_logos/Sonic_Labs.png';
import harmonyB2BLogo from '../../logo/verified_company_logos/Harmony_B2B.png';

export interface CompanyLogoItem {
  name: string;
  category: string;
  src: string;
  website: string;
}

export const VERIFIED_COMPANIES: CompanyLogoItem[] = [
  {
    name: 'Suno AI',
    category: 'Generative Audio',
    src: sunoLogo,
    website: 'https://suno.com',
  },
  {
    name: 'ElevenLabs',
    category: 'Audio Intelligence',
    src: elevenLabsLogo,
    website: 'https://elevenlabs.io',
  },
  {
    name: 'Udio',
    category: 'Music Synthesis',
    src: udioLogo,
    website: 'https://udio.com',
  },
  {
    name: 'MelodyCraft AI',
    category: 'Music Crafting',
    src: melodyCraftLogo,
    website: 'https://melodycraft.ai',
  },
  {
    name: 'Sonic Labs',
    category: 'Sonic Ecosystem',
    src: sonicLabsLogo,
    website: 'https://soniclabs.com',
  },
  {
    name: 'Harmony B2B',
    category: 'Enterprise Music',
    src: harmonyB2BLogo,
    website: 'https://harmonyb2b.io',
  },
];

interface VerifiedCompanyLogosProps {
  className?: string;
}

export const VerifiedCompanyLogos: React.FC<VerifiedCompanyLogosProps> = ({
  className = '',
}) => {
  return (
    <div className={`pt-8 border-t border-hairline flex flex-wrap items-center gap-6 text-xs text-muted ${className}`}>
      <span className="font-semibold text-ink uppercase tracking-wider shrink-0">
        TRUSTED BY MUSIC CURATORS AT
      </span>
      <div className="flex flex-wrap items-center gap-6 sm:gap-7">
        {VERIFIED_COMPANIES.map((company) => (
          <a
            key={company.name}
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            title={`${company.name} (${company.category})`}
            className="flex items-center justify-center shrink-0"
          >
            <img
              src={company.src}
              alt={`${company.name} logo`}
              className="h-5 max-w-[100px] w-auto object-contain opacity-90"
            />
          </a>
        ))}
      </div>
    </div>
  );
};
