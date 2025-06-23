import './style.css';
import { debounce } from './helpers.js';
import { apiFetch, watchlistManager, renderGrid, renderDetails } from './app.js';
import { app, searchInput } from './variables.js';

// --- ROUTING & PAGE DISPLAY ---
async function showTrending() {
    const data = await apiFetch('/trending/all/week');
    if (data && data.results) renderGrid(data.results);
}

async function showWatchlist() {
    app.innerHTML = '<h2>My Watchlist</h2>';
    const watchlistItems = await watchlistManager.fetch();
    renderGrid(watchlistItems, 'appwrite');
}

// --- EVENT HANDLERS ---
const handleSearch = debounce(async (e) => {
    const query = e.target.value.trim();
    if (query.length < 2) {
        if (query.length === 0) showTrending();
        return;
    }
    const data = await apiFetch(`/search/multi?query=${encodeURIComponent(query)}`);
    if (data && data.results) renderGrid(data.results);
}, 500);

async function handleAppClick(e) {
    if (e.target.matches('.movie-card, .movie-card *')) {
        const card = e.target.closest('.movie-card');
        renderDetails(card.dataset.type, card.dataset.id);
    } else if (e.target.matches('#watchlist-btn-detail')) {
        const btn = e.target;
        const item = { 
            id: parseInt(btn.dataset.id), 
            type: btn.dataset.type, 
            title: btn.dataset.title,
            poster_path: btn.dataset.posterPath,
            release_date: btn.dataset.releaseDate
        };

        if (watchlistManager.isOnWatchlist(item.id)) {
            await watchlistManager.remove(item.id);
            btn.textContent = 'Add to Watchlist';
            btn.classList.remove('in-watchlist');
        } else {
            await watchlistManager.add(item);
            btn.textContent = 'Remove from Watchlist';
            btn.classList.add('in-watchlist');
        }
    }
}


async function init() {
    // Set up event listeners
    searchInput.addEventListener('input', handleSearch);
    app.addEventListener('click', handleAppClick);
    document.getElementById('home-btn').addEventListener('click', showTrending);
    document.getElementById('watchlist-btn').addEventListener('click', showWatchlist);

    // Initial load
    await watchlistManager.fetch(); 
    showTrending(); 
}

// Run the app
init();