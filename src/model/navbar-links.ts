import { Github, Linkedin, LucideIcon, MapPinHouse } from 'lucide-react';

interface NavbarLink {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const navbarLinks: NavbarLink[] = [
  {
    title: 'Github Code',
    url: process.env.NEXT_PUBLIC_GITHUB_REPO_LINK || '#',
    icon: Github,
  },
  {
    title: 'Linkedin',
    url: process.env.NEXT_PUBLIC_LINKEDIN_LINK || '#',
    icon: Linkedin,
  },
  {
    title: 'Portfolio',
    url: process.env.NEXT_PUBLIC_PORTFOLIO_LINK || '#',
    icon: MapPinHouse,
  },
];
