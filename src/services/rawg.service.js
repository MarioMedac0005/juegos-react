import {
    RAWG_ENDPOINTS,
    RAWG_ORDERING,
    RAWG_PAGE_SIZE,
    RAWG_DEFAULT_PARAMS
} from "../config/rawg.config";
import toast from 'react-hot-toast';

export const fetchTrendingGames = async (pageSize = 5, search = '', page = 1) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const url = `${RAWG_ENDPOINTS.games}?ordering=${RAWG_ORDERING.TRENDING}&page_size=${pageSize}&page=${page}&key=${RAWG_DEFAULT_PARAMS.key}${searchParam}`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!data.results) throw new Error('No se encontraron resultados en la respuesta');

        return {
            success: true,
            next: data.next,
            data: data.results,
        };
    } catch (error) {
        console.error('Error al obtener juegos destacados:', error);
        toast.error('Error al cargar juegos destacados');
        return {
            success: false,
            error: error.message,
            data: [],
        };
    }
};

export const fetchGenres = async () => {
    const url = `${RAWG_ENDPOINTS.genres}?page_size=${RAWG_PAGE_SIZE.CUSTOM(8)}&key=${RAWG_DEFAULT_PARAMS.key}`

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        if (!data.results) throw new Error('No se encontraron resultados en la respuesta');

        return {
            success: true,
            data: data.results,
        };
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        toast.error('Error al cargar géneros');
        return {
            success: false,
            error: error.message,
            data: [],
        }
    }
}

export const fetchGameDetails = async (id) => {
    const url = `${RAWG_ENDPOINTS.gameDetails(id)}?key=${RAWG_DEFAULT_PARAMS.key}`;

    try {
        const response = await fetch(url);

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        return {
            success: true,
            data: data,
        };
    } catch (error) {
        console.error('Error al obtener detalles del juego:', error);
        toast.error('Error al cargar detalles del juego');
        return {
            success: false,
            error: error.message,
            data: null,
        };
    }
};

export const fetchGames = async ({ page = 1, pageSize = 20, search = '', genres = '', ordering = '-added' } = {}) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const genresParam = genres ? `&genres=${genres}` : '';
    
    const url = `${RAWG_ENDPOINTS.games}?ordering=${ordering}&page_size=${pageSize}&page=${page}&key=${RAWG_DEFAULT_PARAMS.key}${searchParam}${genresParam}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        return {
            success: true,
            data: data.results,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
    } catch (error) {
        console.error('Error al obtener juegos:', error);
        return { success: false, error: error.message, data: [] };
    }
};