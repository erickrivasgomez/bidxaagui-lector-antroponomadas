
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
                setEditions(data.filter(e => e.publicada));
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
                        <div key={edition.id} className="edition-card" onClick={() => navigate(`/read/${edition.id}`)}>
                            <div className="card-cover">
                                {/* Using API_URL for cover image (assuming cover_url is stored as key) */}
                                {/* If cover_url is full URL, use it directly. If key, prepend API_URL/images/ */}
                                {/* Based on previous logic, cover_url might just be the Key */}
                                <img
                                    src={edition.cover_url?.startsWith('http') ? edition.cover_url : `${API_URL}/api/images/${edition.cover_url || 'placeholder'}`}
                                    alt={edition.titulo}
                                    onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x560?text=Cover'; }}
                                />
                            </div>
                            <div className="card-info">
                                <h3>{edition.titulo}</h3>
                                <span className="card-date">{new Date(edition.fecha).toLocaleDateString()}</span>
                                <button className="btn-read">Leer Ahora</button>
                            </div>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
};

export default Home;
