
export interface ResourceLink {
  title: string;
  description: string;
  url: string;
}

export interface ResourceCategory {
  id: string; // Translation key
  items: ResourceLink[];
}

export const resources: ResourceCategory[] = [
  {
    id: 'resources.dev',
    items: [
      { title: 'React', description: 'The library for web and native user interfaces', url: 'https://react.dev' },
      { title: 'Next.js', description: 'The React Framework for the Web', url: 'https://nextjs.org' },
      { title: 'Tailwind CSS', description: 'Rapidly build modern websites without ever leaving your HTML', url: 'https://tailwindcss.com' },
      { title: 'TypeScript', description: 'JavaScript with syntax for types', url: 'https://www.typescriptlang.org' },
    ]
  },
  {
    id: 'resources.design',
    items: [
      { title: 'Figma', description: 'The collaborative interface design tool', url: 'https://figma.com' },
      { title: 'Dribbble', description: 'Discover the world’s top designers & creative professionals', url: 'https://dribbble.com' },
      { title: 'Lucide', description: 'Beautiful & consistent icon toolkit', url: 'https://lucide.dev' },
      { title: 'Coolors', description: 'The super fast color palettes generator', url: 'https://coolors.co' },
    ]
  },
  {
    id: 'resources.tools',
    items: [
      { title: 'Vercel', description: 'Develop. Preview. Ship.', url: 'https://vercel.com' },
      { title: 'ChatGPT', description: 'AI assistant by OpenAI', url: 'https://chat.openai.com' },
      { title: 'Gemini', description: 'Supercharge your creativity and productivity', url: 'https://gemini.google.com' },
      { title: 'StackBlitz', description: 'The instant web IDE', url: 'https://stackblitz.com' },
    ]
  }
];
