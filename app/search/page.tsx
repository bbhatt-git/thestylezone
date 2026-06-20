import { readDb } from '@/lib/db';
import SearchPageClient from './SearchPageClient';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const db = await readDb();
  const allProducts = db.products || [];

  return (
    <main>
      <SearchPageClient allProducts={allProducts} />
    </main>
  );
}
