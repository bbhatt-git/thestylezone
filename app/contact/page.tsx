import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: "Contact | The Style Zone",
  description:
    "The Style Zone is Mahendranagar's leading women's clothing boutique, founded by Sanbi Bist. Discover the latest kurtis, kurti sets, cargo jeans, and combo sets. Shop in-store or get doorstep delivery across Nepal.",
  keywords: [
    "women's clothing Mahendranagar",
    "ladies boutique Kanchanpur Nepal",
    "kurti set Mahendranagar",
    "women's fashion boutique Nepal",
    "kurta shop Kanchanpur",
    "combo sets Nepal boutique",
    "cargo jeans women Nepal",
    "women's clothing store Bhimdattanagar",
    "online women's boutique Nepal delivery",
    "The Style Zone Mahendranagar",
    "Saraswati Bist boutique Nepal",
    "Sanbi Bist boutique Nepal",
    "Fashion Hub Mahendranagar",
    "ladies wear Far-Western Nepal",
    "Pan-Nepal women's clothing delivery",
  ],
  openGraph: {
    title: "Contact | The Style Zone",
    description:
      "A youth-led women's boutique in Mahendranagar founded by Sanbi Bist. Trendy kurti sets, combos, and western pieces — from NPR 899. In-store or delivered across Nepal.",
    type: 'website',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}