import { ID, Query } from 'appwrite';
import { app, searchInput, movieCardTemplate, API_BASE_URL, API_OPTIONS, databases, DB_ID, COLLECTION_ID } from './variables.js';


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
    // Fetch the watchlist from local memory
    fetch: async () => {
        console.log("Fetching from local watchlist");
        return localWatchlist;
    },
    
    // Add an item to the local watchlist
    add: async (item) => {
        console.log("Adding to local watchlist:", item.title);
        const newItem = {
            $id: `local_${Date.now()}`,
            itemId: item.id,
            itemType: item.type,
            title: item.title,
            posterPath: item.poster_path,
            releaseDate: item.release_date,
        };
        localWatchlist.push(newItem);
        return newItem;
    },
    
    // Remove an item from the local watchlist
    remove: async (itemId) => {
        console.log("Removing from local watchlist:", itemId);
        localWatchlist = localWatchlist.filter(w => w.itemId !== itemId);
        return true;
    },
    
    // Check if an item is in the local watchlist
    isOnWatchlist: (itemId) => {
        return localWatchlist.some(w => w.itemId === itemId);
    },
    
   
    initSampleData: () => {
        localWatchlist = [
            {
                $id: 'sample1',
                itemId: 550,
                itemType: 'movie',
                title: 'Fight Club',
                posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
                releaseDate: '1999-10-15'
            },
            {
                $id: 'sample2',
                itemId: 155,
                itemType: 'movie',
                title: 'The Dark Knight',
                posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
                releaseDate: '2008-07-16'
            }
        ];
    }
};

// Initialize with sample data (optional)
watchlistManager.initSampleData();
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
    // Fetch both movie details and videos in parallel
    const [details, videos] = await Promise.all([
        apiFetch(`/${type}/${id}?append_to_response=credits`),
        apiFetch(`/${type}/${id}/videos`)
    ]);
    
    if (!details) return;

    const onWatchlist = watchlistManager.isOnWatchlist(details.id);
    const genres = details.genres.map(g => g.name).join(', ');
    const cast = details.credits.cast.slice(0, 10).map(c => c.name).join(', ');
    
    // Find the first official trailer
    const trailer = videos?.results?.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
    );

    app.innerHTML = `
        <div class="detail-view">
            <div class="detail-poster">
                <img src="https://image.tmdb.org/t/p/w500${details.poster_path}" alt="${details.title || details.name} Poster">
                ${trailer ? `
                    <div class="trailer-container">
                        <iframe 
                            width="560" 
                            height="315" 
                            src="https://www.youtube.com/embed/${trailer.key}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                ` : ''}
            </div>
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