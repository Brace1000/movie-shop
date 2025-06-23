import { ID, Query } from 'appwrite';
import { app, searchInput, movieCardTemplate, API_BASE_URL, API_OPTIONS, databases, DB_ID, COLLECTION_ID } from './variables.js';


// This local cache of the watchlist improves UI responsiveness.
let localWatchlist = [];

// API & DATA FUNCTIONS
export async function apiFetch(endpoint) {
    app.innerHTML = '<div class="loading-spinner">Loading...</div>';
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, API_OPTIONS);
        if (!response.ok) throw new Error(`TMDB API error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error("API Fetch Error:", error);
        app.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
        return null;
    }
}

export const watchlistManager = {
    // Fetches the watchlist from Appwrite and populates the local cache.
    fetch: async () => {
        try {
            const response = await databases.listDocuments(DB_ID, COLLECTION_ID);
            localWatchlist = response.documents;
            return localWatchlist;
        } catch (error) {
            console.error("Appwrite: Failed to fetch watchlist", error);
            return [];
        }
    },
    // Adds an item to Appwrite and the local cache.
    add: async (item) => {
        try {
            const doc = await databases.createDocument(DB_ID, COLLECTION_ID, ID.unique(), {
                itemId: item.id,
                itemType: item.type,
                title: item.title,
                posterPath: item.poster_path,
                releaseDate: item.release_date,
            });
            localWatchlist.push(doc);
        } catch (error) {
            console.error("Appwrite: Failed to add to watchlist", error);
        }
    },
    // Removes an item from Appwrite and the local cache.
    remove: async (itemId) => {
        const watchlistItem = localWatchlist.find(w => w.itemId === itemId);
        if (watchlistItem) {
            try {
                await databases.deleteDocument(DB_ID, COLLECTION_ID, watchlistItem.$id);
                localWatchlist = localWatchlist.filter(w => w.itemId !== itemId);
            } catch (error) {
                console.error("Appwrite: Failed to remove from watchlist", error);
            }
        }
    },
    // Checks the local cache to see if an item is on the watchlist.
    isOnWatchlist: (itemId) => !!localWatchlist.find(w => w.itemId === itemId),
};

// --- UI RENDERING FUNCTIONS ---
export function renderGrid(items, source = 'tmdb') {
    app.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'results-grid';

    if (items.length === 0) {
        app.innerHTML = `<div class="info-message">No items found.</div>`;
        return;
    }

    items.forEach(item => {
        const isFromAppwrite = source === 'appwrite';
        const posterPath = isFromAppwrite ? item.posterPath : item.poster_path;
        if (!posterPath) return; // Skip items without posters

        const card = movieCardTemplate.content.cloneNode(true).children[0];
        card.dataset.id = isFromAppwrite ? item.itemId : item.id;
        card.dataset.type = isFromAppwrite ? item.itemType : (item.media_type || (item.title ? 'movie' : 'tv'));
        
        card.querySelector('.poster').src = `https://image.tmdb.org/t/p/w400${posterPath}`;
        card.querySelector('.title').textContent = isFromAppwrite ? item.title : (item.title || item.name);
        card.querySelector('.release-date').textContent = ((isFromAppwrite ? item.releaseDate : (item.release_date || item.first_air_date)) || '').split('-')[0];
        
        grid.appendChild(card);
    });
    app.appendChild(grid);
}

export async function renderDetails(type, id) {
    const details = await apiFetch(`/${type}/${id}?append_to_response=credits`);
    if (!details) return;

    const onWatchlist = watchlistManager.isOnWatchlist(details.id);
    const genres = details.genres.map(g => g.name).join(', ');
    const cast = details.credits.cast.slice(0, 10).map(c => c.name).join(', ');
    
    app.innerHTML = `
        <div class="detail-view">
            <div class="detail-poster"><img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name} Poster"></div>
            <div class="detail-info">
                <h2>${details.title || details.name} (${(details.release_date || details.first_air_date).split('-')[0]})</h2>
                <div class="genres"><strong>Genres:</strong> ${genres}</div>
                <h3>Plot</h3><p>${details.overview}</p>
                <h3>Cast</h3><p>${cast}</p>
                <h3>TMDB Rating</h3><div class="ratings"><div class="rating-item">${details.vote_average.toFixed(1)} / 10</div></div>
                <button id="watchlist-btn-detail" class="${onWatchlist ? 'in-watchlist' : ''}" data-id="${details.id}" data-type="${type}" data-title="${details.title || details.name}" data-poster-path="${details.poster_path}" data-release-date="${details.release_date || details.first_air_date}">
                    ${onWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </button>
            </div>
        </div>
    `;
}