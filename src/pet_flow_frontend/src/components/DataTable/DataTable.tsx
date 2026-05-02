import { MdEdit, MdDelete, MdChevronRight } from 'react-icons/md';
import styles from './DataTable.module.css';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  onEdit,
  onDelete,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: DataTableProps<T>) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            {columns.map((col) => (
              <th key={col.key} className={styles.headerCell}>
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className={styles.headerCell}>Ações</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className={styles.bodyRow}>
              {columns.map((col) => (
                <td key={col.key} className={styles.bodyCell}>
                  {col.render ? col.render(item) : String(item[col.key] ?? '')}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className={styles.bodyCell}>
                  <div className={styles.actions}>
                    {onEdit && (
                      <button
                        className={styles.editBtn}
                        onClick={() => onEdit(item)}
                        aria-label="Editar"
                      >
                        <MdEdit size={14} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => onDelete(item)}
                        aria-label="Excluir"
                      >
                        <MdDelete size={14} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Próxima página"
          >
            <MdChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
