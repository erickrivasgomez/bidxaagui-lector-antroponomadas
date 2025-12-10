
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HTMLFlipBook from 'react-pageflip';
import { readerAPI, API_URL, type Edition, type Page } from '../services/api';
import '../styles/Reader.css';

const Reader: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Data State
    const [edition, setEdition] = useState<Edition | null>(null);
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Flipbook State
    const bookRef = useRef<any>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Responsive State
    const [isMobile, setIsMobile] = useState(false);

    // Initial Fetch
    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                // Ideally this should use getEdition(id) public endpoint
                const allEditions = await readerAPI.getEditions();
                const found = allEditions.find(e => e.id === id);

                if (!found) {
                    setError('Edición no encontrada');
                    return;
                }
                setEdition(found);

                const pagesData = await readerAPI.getPages(id);
                setPages(pagesData);
                setTotalPages(pagesData.length);

            } catch (err) {
                console.error(err);
                setError('Error al cargar la edición');
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Responsive Handler
        const handleResize = () => {
            setIsMobile(window.innerHeight > window.innerWidth || window.innerWidth < 768);
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                bookRef.current?.pageFlip()?.flipPrev();
            } else if (e.key === 'ArrowRight') {
                bookRef.current?.pageFlip()?.flipNext();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const onFlip = useCallback((e: any) => {
        setCurrentPage(e.data);
    }, []);

    const handleDownload = () => {
        alert('La descarga de PDF estará disponible próximamente.');
    };

    if (loading) return <div className="preview-loading">Cargando revista...</div>;
    if (error || !edition) return <div className="preview-error">{error}</div>;

    // Dimensions
    const headerHeight = 60;
    const footerHeight = 30;
    const padding = 40; // Space for buttons
    const availableH = window.innerHeight - headerHeight - footerHeight - padding;
    const availableW = window.innerWidth - (isMobile ? 20 : 100); // More side padding on desktop for buttons

    let pageHeight = availableH;
    let pageWidth = pageHeight * 0.707; // A4 aspect ratio

    // Check width constraint
    const totalWidthNeeded = isMobile ? pageWidth : pageWidth * 2;
    if (totalWidthNeeded > availableW) {
        // Scale down by width
        const scale = availableW / totalWidthNeeded;
        pageWidth = pageWidth * scale;
        pageHeight = pageHeight * scale;
    }

    return (
        <div className="preview-container">
            {/* Header */}
            <div className="preview-header">
                <div className="header-left">
                    <button onClick={() => navigate('/')} className="btn-back">
                        ← Ediciones
                    </button>
                    <span className="edition-title-preview">{edition.titulo}</span>
                </div>
                <div className="header-right">
                    {/* Placeholder for future tools */}
                </div>
            </div>

            {/* Stage */}
            <div className="preview-stage">
                <button
                    className="preview-nav prev"
                    onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                >
                    ‹
                </button>

                <div className="book-wrapper">
                    <HTMLFlipBook
                        key={isMobile ? 'mobile' : 'desktop'}
                        width={Math.floor(pageWidth)}
                        height={Math.floor(pageHeight)}
                        size="fixed"
                        minWidth={200}
                        maxWidth={1000}
                        minHeight={300}
                        maxHeight={1400}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        onFlip={onFlip}
                        ref={bookRef}
                        className="flipbook-instance"
                        style={{ margin: '0 auto' }}
                        startPage={0}
                        drawShadow={true}
                        flippingTime={1000}
                        usePortrait={isMobile}
                        startZIndex={0}
                        autoSize={true}
                        clickEventForward={true}
                        useMouseEvents={true}
                        swipeDistance={30}
                        showPageCorners={true}
                        disableFlipByClick={false}
                    >
                        {/* Cover (Page 0) */}
                        <div className="page page-cover" data-density="hard">
                            <div className="page-content">
                                {pages[0] && (
                                    <img
                                        src={`${API_URL}/api/images/${pages[0].imagen_url}`}
                                        alt="Portada"
                                        className="page-image"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Content Pages */}
                        {pages.slice(1).map((page) => (
                            <div key={page.id} className="page">
                                <div className="page-content">
                                    <img
                                        src={`${API_URL}/api/images/${page.imagen_url}`}
                                        alt={`Página ${page.numero}`}
                                        className="page-image"
                                    />
                                    <div className="page-number">{page.numero}</div>
                                </div>
                            </div>
                        ))}

                        {/* Back Cover */}
                        <div className="page page-cover" data-density="hard">
                            <div className="page-content back-cover">
                                <div className="brand-mark">BIDXAAGUI</div>
                            </div>
                        </div>
                    </HTMLFlipBook>
                </div>

                <button
                    className="preview-nav next"
                    onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                >
                    ›
                </button>
            </div>

            <div className="preview-footer">
                <span>{currentPage + 1} / {totalPages + 2}</span>
            </div>
        </div>
    );
};

export default Reader;