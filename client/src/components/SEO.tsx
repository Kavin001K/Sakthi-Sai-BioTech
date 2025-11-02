import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}

export default function SEO({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage = 'https://sakthisaibiotech.com/images/logo-preview.png',
  ogUrl,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: SEOProps) {
  const fullTitle = `${title} - Sakthi Sai Biotech`;
  const finalOgTitle = ogTitle || fullTitle;
  const finalOgDescription = ogDescription || description;
  const finalTwitterTitle = twitterTitle || finalOgTitle;
  const finalTwitterDescription = twitterDescription || finalOgDescription;
  const finalTwitterImage = twitterImage || ogImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:description" content={finalOgDescription} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />
    </Helmet>
  );
}

