const CACHE_NAME = 'movielist-v3';

const ASSETS_TO_CACHE = [
    '/',
    '/about',
    '/index.html',
    '/about.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon.svg',
    '/api/movies',
    '/posters/1.jpg',
    '/posters/2.jpg',
    '/posters/3.jpg',
    '/posters/4.jpg',
    '/posters/5.jpg',
    '/posters/6.jpg',
    '/posters/7.jpg',
    '/posters/8.jpg',
    '/posters/9.jpg',
    '/posters/10.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
        )
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                if (event.request.method === 'GET' && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => caches.match(event.request))
    );
});