//ALTER LATER, TEMP CURRENTLY
const cacheName = 'offline_pwa_example_version_1.0';

const filesToCache = [
    'manifest.json',
    'index.html',
    'offline_message.html',
    'css/style.css',
    'icons/icon_small_red.png',
    'icons/icon_medium_green.png',
    'icons/icon_large_blue.png'
];

// Install the service worker and cache the files in filesToCache[]
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

// Delete old versions of the cache when a new version is first loaded
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
});

//taken from chatgpt
// Fetch online first, then cache, then offline error page
self.addEventListener('fetch', e => {
    e.respondWith(
        fetch(e.request)
            .then(response => {
                // If successful, clone response and update cache
                let responseClone = response.clone();
                caches.open(cacheName).then(cache => {
                    cache.put(e.request, responseClone);
                });
                return response;
            })
            .catch(() =>
                caches.match(e.request).then(response => {
                    return response || caches.match('offline_message.html');
                })
            )
    );
});