// Bump version string to invalidate cache on deploy
const CACHE = 'lydias-v1'
const PRECACHE = ['/chrishicks-ca/depanneur-os/']

// Precache the app shell and activate immediately (skipWaiting)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first: try fetch, cache the response for offline, fall back to cache on failure.
// Only GET requests are cached; POST/PUT pass through unhandled.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone()
        caches.open(CACHE).then((cache) => cache.put(e.request, clone))
        return res
      })
      .catch(() => caches.match(e.request))
  )
})
