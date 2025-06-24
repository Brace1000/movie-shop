# Movie Search Web Application

A modern  web application for searching and exploring movies using the TMDB (The Movie Database) API. Built with Vite and React.

![Movie Search App Screenshot](./public/movie-shop.png)

## Features

- Search movies by title
- Display movie details including posters, ratings, and descriptions
- Responsive design for all devices
- Real-time search results
- Modern UI with Tailwind CSS

## Prerequisites

Before you begin, ensure you have installed:
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Brace1000/move-shop.git
cd move-shop
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```plaintext
VITE_TMDB_API_KEY="your_tmdb_api_key_here"
VITE_TMDB_BASE_URL="https://api.themoviedb.org/3"
```

4. Start the development server:
```bash
npm run dev
```

## Environment Setup

The application requires specific environment variables to function:

- `VITE_TMDB_API_KEY`: Your TMDB API key (Get one from [TMDB website](https://www.themoviedb.org/documentation/api))
- `VITE_TMDB_BASE_URL`: The TMDB API base URL

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm test` - Run tests (if configured)

## Project Structure

```
move-shop/
├── src/
│   ├── main.js/
│   │── Search.js
│   │ - variable.js
│   ├── App.jsx
│   └── helper.jsx
├── image.png
├── .env
├── index.html

```

## Technologies Used

- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TMDB API](https://www.themoviedb.org/documentation/api)
- [Appwrite](https://appwrite.io/)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure your `.env` file is in the root directory
   - All environment variables should start with `VITE_`
   - Restart the development server after changing environment variables

2. **API Errors**
   - Verify your TMDB API key is correct
   - Check your internet connection
   - Ensure you're not exceeding API rate limits

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the movie database API
- [Vite](https://vitejs.dev/) for the excellent build tool


## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/move-shop](https://github.com/yourusername/move-shop)