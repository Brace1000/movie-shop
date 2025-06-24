import { Client, Databases } from 'appwrite';

// --- DOM ELEMENTS ---
export const app = document.getElementById('app');
export const searchInput = document.getElementById('search-input');
export const movieCardTemplate = document.getElementById('movie-card-template');

// --- TMDB API CONFIG ---
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const API_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: API_KEY,
  },
};

const client = new Client();
client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const databases = new Databases(client);
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;