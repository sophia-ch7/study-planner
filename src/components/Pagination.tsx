interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  disabled,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <nav className="d-flex justify-content-between align-items-center my-4">
      <span className="text-muted small">
        Сторінка {currentPage} з {totalPages} (Всього: {totalItems})
      </span>

      <ul className="pagination mb-0">
        <li
          className={`page-item ${currentPage === 1 || disabled ? "disabled" : ""}`}
        >
          <button
            className="page-item-btn btn btn-outline-primary me-2"
            onClick={() => onPageChange(currentPage - 1)}
          >
            &laquo; Попередня
          </button>
        </li>
        <li
          className={`page-item ${currentPage === totalPages || disabled ? "disabled" : ""}`}
        >
          <button
            className="page-item-btn btn btn-outline-primary"
            onClick={() => onPageChange(currentPage + 1)}
          >
            Наступна &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}
