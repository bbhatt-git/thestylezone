import fs from 'fs';
import path from 'path';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Privacy Policy | The Style Zone',
  description: 'Learn how we collect, store, and safeguard your personal information.',  
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
    `Sanbi Bist boutique Nepal`,
    "Fashion Hub Mahendranagar",
    "ladies wear Far-Western Nepal",
    "Kanchanpur women's clothing delivery",
  ],
  openGraph: {
    title: "Privacy Policy | The Style Zone",
    description:
      "Learn how we collect, store, and safeguard your personal information.",
    type: 'website',
  },
};

function parseMarkdown(raw: string) {
  const lines = raw.split('\n');
  const sections: { id: string; title: string; lines: string[] }[] = [];
  let current: (typeof sections)[0] | null = null;
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    if (h2) {
      if (current) sections.push(current);
      const title = h2[1].trim().replace(/^\d+\.\s+/, '');
      const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      current = { id, title, lines: [] };
    } else if (current) {
      current.lines.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function inlineFormat(t: string) {
  return t.replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:600;color:#111111">$1</strong>');
}

function renderLines(lines: string[]) {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.trim().startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      nodes.push(
        <ul key={i} className="list-disc list-inside pl-2 space-y-2 mt-3">
          {items.map((item, j) => (
            <li key={j} className="text-gray-600 leading-relaxed font-sans text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ul>
      );
      continue;
    }
    nodes.push(
      <p key={i}
        className="text-gray-600 leading-relaxed font-sans text-sm md:text-base mt-3"
        dangerouslySetInnerHTML={{ __html: inlineFormat(line.trim()) }}
      />
    );
    i++;
  }
  return nodes;
}

export default function PrivacyPage() {
  const filePath = path.join(process.cwd(), 'public', 'legal', 'privacy-policy.md');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const sections = parseMarkdown(raw);

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F0]">
      <Navbar />

      <main className="flex-grow py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">

            {/* Title */}
            <div className="text-center mb-10">
              <p className="text-xs font-bold tracking-[0.25em] text-[#FE5733] uppercase mb-3 font-sans">
                The Style Zone
              </p>
              <p className="font-sans text-3xl md:text-4xl font-extrabold text-gray-800">
                Privacy <span className="text-[#FE5733]">Policy</span>
              </p>
              <p className="text-sm text-gray-400 mt-3 font-sans">Last updated: May 29, 2026</p>
            </div>

            {/* Intro */}
            <p className="text-sm md:text-base text-gray-600 leading-relaxed font-sans mb-8">
              Your privacy matters to us. This policy explains how we collect, use, and protect your information — written in plain language with no legal jargon. By shopping with us, you agree to the terms outlined below.
            </p>

            <div className="border-b border-gray-200 mb-8" />

            {/* Sections */}
            <div className="space-y-8">
              {sections.map((s, idx) => (
                <section key={s.id} id={s.id}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FE5733] shrink-0" />
                    <p className="text-base md:text-lg font-bold text-gray-800 font-sans">
                      {s.title}
                    </p>
                  </div>
                  <div className="pl-5">
                    {renderLines(s.lines)}
                  </div>
                  {idx < sections.length - 1 && (
                    <div className="border-b border-gray-100 mt-8" />
                  )}
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-[#121212] rounded-lg p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-base font-bold text-white font-sans">Questions about this policy?</p>
                <p className="text-sm text-white/40 mt-1 font-sans">Our team is happy to help clarify anything.</p>
              </div>
              <a
                href="/contact"
                className="shrink-0 bg-[#FE5733] hover:bg-white hover:text-[#121212] text-white font-bold font-sans uppercase tracking-wider text-xs px-8 py-3 rounded-lg transition-all duration-200 whitespace-nowrap text-center"
              >
                Get in Touch
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}