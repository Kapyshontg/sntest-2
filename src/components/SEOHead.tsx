import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
}

export default function SEOHead({ title, description, keywords = "СНТ Альбатрос, садоводство, Рузский городской округ, личный кабинет садовода, взносы СНТ" }: SEOHeadProps) {
  useEffect(() => {
    // Update Title
    document.title = title;

    // Helper to find or create meta tags
    const updateMetaTag = (name: string, attributeName: string, value: string) => {
      let element = document.querySelector(`meta[${attributeName}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', value);
    };

    updateMetaTag('description', 'name', description);
    updateMetaTag('keywords', 'name', keywords);
    updateMetaTag('robots', 'name', 'index, follow');

    // OpenGraph meta tags
    updateMetaTag('og:title', 'property', title);
    updateMetaTag('og:description', 'property', description);
    updateMetaTag('og:type', 'property', 'website');
    updateMetaTag('og:site_name', 'property', 'СНТ Альбатрос');

  }, [title, description, keywords]);

  return null; // Side-effect only
}
