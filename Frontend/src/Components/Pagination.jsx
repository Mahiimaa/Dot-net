import React from "react";
import PropTypes from "prop-types";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  maxPagesToShow = 5,
  className = "",
  ariaLabel = "Pagination",
  loading = false,
}) => {
  if (totalPages <= 1 && !onPageSizeChange) return null;

  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  return (
    <div
      className={`flex flex-col items-center gap-4 ${className}`}
      role="navigation"
      aria-label={ariaLabel}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="px-3 py-1 bg-[#1b3a57] text-white rounded disabled:bg-gray-300 hover:bg-[#0d2a40] disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          Previous
        </button>
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              disabled={loading}
              className="px-3 py-1 rounded bg-gray-200 text-black hover:bg-[#0d2a40] hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Page 1"
            >
              1
            </button>
            {startPage > 2 && <span className="text-sm">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            disabled={loading}
            className={`px-3 py-1 rounded ${
              currentPage === page
                ? "bg-[#1b3a57] text-white"
                : "bg-gray-200 text-black"
            } hover:bg-[#0d2a40] hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="text-sm">...</span>}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={loading}
              className="px-3 py-1 rounded bg-gray-200 text-black hover:bg-[#0d2a40] hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label={`Page ${totalPages}`}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="px-3 py-1 bg-[#1b3a57] text-white rounded disabled:bg-gray-300 hover:bg-[#0d2a40] disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm">
            Items per page:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            disabled={loading}
            className="border p-2 rounded focus:ring-2 focus:ring-[#1b3a57] border-gray-300"
            aria-label="Select items per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
      <span className="text-sm" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

Pagination.propTypes = {
  totalPages: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  pageSize: PropTypes.number,
  onPageSizeChange: PropTypes.func,
  pageSizeOptions: PropTypes.arrayOf(PropTypes.number),
  maxPagesToShow: PropTypes.number,
  className: PropTypes.string,
  ariaLabel: PropTypes.string,
  loading: PropTypes.bool,
};

export default Pagination;
