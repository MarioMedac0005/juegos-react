import { Link, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ count, pageSize = 20, currentPage, basePath, extraParams = {} }) {
    const totalPages = Math.ceil(count / pageSize);
    if (totalPages <= 1) return null;

    const buildHref = (page) => {
        const params = new URLSearchParams({ ...extraParams, page });
        return `${basePath}?${params.toString()}`;
    };

    // Show a window of pages around current
    const getPageNumbers = () => {
        const delta = 2;
        const range = [];
        const left = Math.max(2, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        range.push(1);
        if (left > 2) range.push('...');
        for (let i = left; i <= right; i++) range.push(i);
        if (right < totalPages - 1) range.push('...');
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    return (
        <nav className="flex items-center justify-center gap-1 mt-10 flex-wrap" aria-label="Paginación">
            {/* Prev */}
            {currentPage > 1 ? (
                <Link
                    to={buildHref(currentPage - 1)}
                    className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 rounded-lg border border-border opacity-30 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                </span>
            )}

            {getPageNumbers().map((p, i) =>
                p === '...' ? (
                    <span key={`dots-${i}`} className="px-3 py-2 text-muted-foreground select-none">…</span>
                ) : (
                    <Link
                        key={p}
                        to={buildHref(p)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            p === currentPage
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'border-border hover:bg-accent'
                        }`}
                        aria-current={p === currentPage ? 'page' : undefined}
                    >
                        {p}
                    </Link>
                )
            )}

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    to={buildHref(currentPage + 1)}
                    className="p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                    aria-label="Página siguiente"
                >
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <span className="p-2 rounded-lg border border-border opacity-30 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                </span>
            )}
        </nav>
    );
}
