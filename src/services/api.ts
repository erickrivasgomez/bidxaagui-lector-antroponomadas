
import axios from 'axios';

// Base API URL with smart fallback
export const API_URL = import.meta.env.VITE_API_URL ||
    (window.location.hostname.includes('bidxaagui.com')
        ? 'https://api.bidxaagui.com'
        : 'http://localhost:8787');

const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface Edition {
    id: string;
    titulo: string;
    descripcion: string;
    cover_url: string;
    fecha: string;
    publicada: boolean;
}

export interface Page {
    id: string;
    imagen_url: string;
    numero: number;
}

export const readerAPI = {
    // Get all PUBLIC editions
    getEditions: async (): Promise<Edition[]> => {
        const response = await api.get('/ediciones'); // Assuming this public endpoint exists
        return response.data;
    },

    // Get pages for an edition
    getPages: async (id: string): Promise<Page[]> => {
        const response = await api.get(`/ediciones/${id}/pages`); // Assuming this public endpoint exists
        return response.data;
    }
};
