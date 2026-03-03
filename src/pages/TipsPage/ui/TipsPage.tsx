import { useState } from 'react';
import cls from './TipsPage.module.scss';
import { tipsMock } from '../../../entities/tip/mock/tips';
import { TipsList } from '../../../widgets/tips-list';
import { TipsFilters } from '../../../widgets/tips-filters';
import { TipsSearch } from '../../../widgets/tips-search'
import { TipsPagination } from '../../../widgets/tips-pagination'
import { Navbar } from '../../../widgets/navbar'

const ITEMS_PER_PAGE = 4;

const TipsPage = () => {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = tipsMock
    .filter((tip) =>
      category === 'all' ? true : tip.category === category
    )
    .filter((tip) =>
      tip.title.toLowerCase().includes(search.toLowerCase())
    );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className={cls.page}>
      <Navbar />
      <h1>Советы по уходу</h1>

      <TipsSearch value={search} onChange={setSearch} />
      <TipsFilters selected={category} onChange={setCategory} />

      <TipsList tips={paginated} />

      {totalPages > 1 && (
        <TipsPagination
          current={page}
          total={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
};

export default TipsPage;