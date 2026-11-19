if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => { });
    });
}

const moviesGrid = document.getElementById('moviesGrid');
const ratingInput = document.getElementById('ratingInput');
const filterBtn = document.getElementById('filterBtn');
const resetBtn = document.getElementById('resetBtn');
const errorBox = document.getElementById('errorBox');
const statusEl = document.getElementById('serverStatus');

const modal = document.getElementById('movieModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBackdrop = document.getElementById('modalBackdrop');

async function loadMovies(minRating = '') {
    if (!moviesGrid) return;

    errorBox.classList.add('hidden');
    let url = '/api/movies';
    if (minRating !== '') {
        url += `?minRating=${encodeURIComponent(minRating)}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            errorBox.textContent = `Ошибка ${response.status}: ${data.error}`;
            errorBox.classList.remove('hidden');
            moviesGrid.innerHTML = '';
            return;
        }

        renderMovies(data);
    } catch {
        errorBox.textContent = 'Нет связи с сервером — показаны данные из кеша';
        errorBox.classList.remove('hidden');
    }
}

function renderMovies(movies) {
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p style="color:#6b7280; grid-column:1/-1;">Фильмы с таким рейтингом не найдены.</p>';
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => {
        let pillClass = '';
        if (movie.rating < 6.5) pillClass = 'low';
        else if (movie.rating < 8.0) pillClass = 'mid';

        return `
      <article class="movie-card" onclick="openMovieDetails(${movie.id})">
        <div class="poster-box">
          <img class="poster-img" src="${movie.poster}" alt="${movie.title}" loading="lazy">
          <span class="rating-pill ${pillClass}">${movie.rating.toFixed(1)}</span>
        </div>
        <h2 class="movie-title">${movie.title}</h2>
        <p class="movie-meta">${movie.year} • ${movie.genre} • ${movie.director}</p>
      </article>
    `;
    }).join('');
}

async function openMovieDetails(id) {
    try {
        const res = await fetch(`/api/movies/${id}`);
        if (!res.ok) return;
        const movie = await res.json();

        document.getElementById('modalPoster').src = movie.poster;
        document.getElementById('modalRating').textContent = movie.rating.toFixed(1);
        document.getElementById('modalGenre').textContent = movie.genre;
        document.getElementById('modalTitle').textContent = movie.title;
        document.getElementById('modalSub').textContent = `${movie.year} г. • ${movie.duration || ''} • Реж. ${movie.director}`;
        document.getElementById('modalDesc').textContent = movie.desc || 'Описание отсутствует.';

        modal.classList.remove('hidden');
    } catch (err) {
        console.error('Ошибка загрузки деталей фильма:', err);
    }
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => modal.classList.add('hidden'));
    modalBackdrop.addEventListener('click', () => modal.classList.add('hidden'));
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') modal.classList.add('hidden');
    });
}

async function checkStatus() {
    if (!statusEl) return;
    try {
        const res = await fetch('/api/status');
        const data = await res.json();
        statusEl.textContent = `Сервер активен • ${data.serverTime}`;
    } catch {
        statusEl.textContent = 'Офлайн-режим (кеш)';
    }
}

if (filterBtn) {
    filterBtn.addEventListener('click', () => {
        document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
        loadMovies(ratingInput.value.trim());
    });

    ratingInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
            loadMovies(ratingInput.value.trim());
        }
    });

    resetBtn.addEventListener('click', () => {
        ratingInput.value = '';
        document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
        document.querySelector('.preset[data-val=""]').classList.add('active');
        loadMovies();
    });

    document.querySelectorAll('.preset').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.preset').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const val = btn.dataset.val;
            ratingInput.value = val;
            loadMovies(val);
        });
    });

    loadMovies();
}

checkStatus();