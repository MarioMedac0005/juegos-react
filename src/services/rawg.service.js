import {
    RAWG_ENDPOINTS,
    RAWG_ORDERING,
    RAWG_PAGE_SIZE,
    RAWG_DEFAULT_PARAMS
} from "../config/rawg.config";
import toast from 'react-hot-toast';

const apiGet = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
};

export const fetchTrendingGames = async (pageSize = 5, search = '', page = 1) => {
    const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
    const url = `${RAWG_ENDPOINTS.games}?ordering=${RAWG_ORDERING.TRENDING}&page_size=${pageSize}&page=${page}&key=${RAWG_DEFAULT_PARAMS.key}${searchParam}`;

    try {
        const data = await apiGet(url);
        if (!data.results) throw new Error('No se encontraron resultados en la respuesta');
        return { success: true, next: data.next, count: data.count, data: data.results };
    } catch (error) {
        console.error('Error al obtener juegos destacados:', error);
        toast.error('Error al cargar juegos destacados');
        return { success: false, error: error.message, data: [] };
    }
};

export const fetchGenres = async () => {
    const url = `${RAWG_ENDPOINTS.genres}?page_size=${RAWG_PAGE_SIZE.CUSTOM(8)}&key=${RAWG_DEFAULT_PARAMS.key}`

    try {
        const data = await apiGet(url);
        if (!data.results) throw new Error('No se encontraron resultados en la respuesta');
        return { success: true, data: data.results };
    } catch (error) {
        console.error('Error al obtener géneros:', error);
        toast.error('Error al cargar géneros');
        return { success: false, error: error.message, data: [] }
    }
}

export const fetchGameDetails = async (id) => {
    const url = `${RAWG_ENDPOINTS.gameDetails(id)}?key=${RAWG_DEFAULT_PARAMS.key}`;

    try {
        const data = await apiGet(url);
        return { success: true, data };
    } catch (error) {
        console.error('Error al obtener detalles del juego:', error);
        toast.error('Error al cargar detalles del juego');
        return { success: false, error: error.message, data: null };
    }
};

export const fetchGames = async ({ page = 1, pageSize = 20, search = '', genres = '', tags = '', publishers = '', ordering = '-added' } = {}) => {
    const params = new URLSearchParams({
        ordering,
        page_size: pageSize,
        page,
        key: RAWG_DEFAULT_PARAMS.key,
    });
    if (search) params.append('search', search);
    if (genres) params.append('genres', genres);
    if (tags) params.append('tags', tags);
    if (publishers) params.append('publishers', publishers);

    const url = `${RAWG_ENDPOINTS.games}?${params.toString()}`;

    try {
        const data = await apiGet(url);
        return {
            success: true,
            data: data.results,
            count: data.count,
            next: data.next,
            previous: data.previous
        };
    } catch (error) {
        console.error('Error al obtener juegos:', error);
        return { success: false, error: error.message, data: [], count: 0 };
    }
};

export const fetchPublishers = async ({ page = 1, pageSize = 20, search = '' } = {}) => {
    const params = new URLSearchParams({ page_size: pageSize, page, key: RAWG_DEFAULT_PARAMS.key });
    if (search) params.append('search', search);
    const url = `${RAWG_ENDPOINTS.publishers}?${params.toString()}`;

    try {
        const data = await apiGet(url);
        return { success: true, data: data.results, count: data.count, next: data.next, previous: data.previous };
    } catch (error) {
        console.error('Error al obtener publishers:', error);
        toast.error('Error al cargar publishers');
        return { success: false, error: error.message, data: [], count: 0 };
    }
};

export const fetchPublisherDetails = async (id) => {
    const url = `${RAWG_ENDPOINTS.publisherDetails(id)}?key=${RAWG_DEFAULT_PARAMS.key}`;

    try {
        const data = await apiGet(url);
        return { success: true, data };
    } catch (error) {
        console.error('Error al obtener detalles del publisher:', error);
        toast.error('Error al cargar el publisher');
        return { success: false, error: error.message, data: null };
    }
};