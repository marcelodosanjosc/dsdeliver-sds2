import React from 'react';
import { Category } from '../api';
import './styles.css';

type Props = {
  categories: Category[];
  selectedCategoryId: number | null;
  onSelectCategory: (id: number | null) => void;
};

function CategoryFilter({ categories, selectedCategoryId, onSelectCategory }: Props) {
  return (
    <div className="category-filter-container">
      <span className="category-filter-label">Categorias:</span>
      <button
        className={`category-chip ${selectedCategoryId === null ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        Todas
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-chip ${selectedCategoryId === cat.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;
