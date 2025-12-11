
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readerAPI, API_URL, type Edition } from '../services/api';
import '../styles/Home.css';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [editions, setEditions] = useState<Edition[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEditions = async () => {
            try {
                const data = await readerAPI.getEditions();
                // Filter only published ones if API returns all (though endpoint usually filters)
                // Assuming public endpoint only returns published or we filter client side
                // For now showing ALL for testing purposes, even drafts.
                setEditions(data);
                // setEditions(data.filter(e => Boolean(e.publicada)));
            } catch (error) {
                console.error('Error fetching editions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEditions();
    }, []);

    if (loading) return <div className="loading-container">Cargando ediciones...</div>;

    return (
        <div className="home-container">
            <header className="home-header">
                <h1>Revista Bidxaagui</h1>
                <p>Explora nuestras ediciones digitales</p>
                <a href="https://bidxaagui.com" className="back-link">← Volver al sitio principal</a>
            </header>

            <main className="editions-grid">
                {editions.length === 0 ? (
                    <div className="empty-state">No hay ediciones publicadas aún.</div>
                ) : (
                    editions.map(edition => (
                        <div key={edition.id} className="edition-card" onClick={() => navigate(`/leer/${edition.id}`)}>
                            <div className="card-cover">
                                <img
                                    src={edition.cover_url?.startsWith('http') ? edition.cover_url : `${API_URL}/api/images/${edition.cover_url || 'placeholder'}`}
                                    alt={edition.titulo}
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x560?text=Cover'; }}
                                    loading="lazy"
                                />
                            </div>
                            <div className="card-info">
                                <h3>{edition.titulo}</h3>
                                <span className="card-date">
                                    {new Date(edition.fecha).toLocaleDateString('es-MX', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                                <button 
                                    className="btn-read"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/leer/${edition.id}`);
                                    }}
                                >
                                    Leer Ahora
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;
