const CACHE_NAME = 'financeai-v1';
const urlsToCache = [
  '/',
  '/client/App.tsx',
  '/client/global.css',
  '/manifest.json',
  // Add other static assets as needed
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        // If it's a chat API request and we're offline, return a custom offline message
        if (event.request.url.includes('/api/chat') && !navigator.onLine) {
          return new Response(
            JSON.stringify({
              response: "Maaf, Anda sedang offline. Silakan coba lagi ketika terhubung ke internet."
            }),
            {
              status: 200,
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
        }
        
        return fetch(event.request).catch(() => {
          // If fetch fails (offline), return a generic offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for offline chat messages (optional enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'chat-sync') {
    event.waitUntil(
      // Handle offline message queue here if implemented
      console.log('Background sync triggered for chat messages')
    );
  }
});

// Handle push notifications (optional enhancement)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      data: data.data || {}
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
