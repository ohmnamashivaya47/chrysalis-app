/**
 * Service Worker for Chrysalis Meditation App
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'chrysalis-v1';
const STATIC_CACHE = 'chrysalis-static-v1';
const DYNAMIC_CACHE = 'chrysalis-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/meditation-sounds/bell.mp3',
  '/meditation-sounds/ocean.mp3',
  '/meditation-sounds/forest.mp3',
  '/meditation-sounds/rain.mp3',
  '/meditation-sounds/singing-bowls.mp3'
];

// API endpoints to cache
const CACHE_PATTERNS = [
  /^https:\/\/api\.chrysalis\.app\/meditation-types/,
  /^https:\/\/api\.chrysalis\.app\/user\/profile/,
  /^https:\/\/api\.chrysalis\.app\/achievements/
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Error caching static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request.url)) {
    event.respondWith(handleStaticAsset(request));
  } else if (isAPIRequest(request.url)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else {
    event.respondWith(handleOtherRequest(request));
  }
});

// Helper functions
function isStaticAsset(url) {
  return STATIC_ASSETS.some(asset => url.includes(asset)) ||
         url.includes('.js') ||
         url.includes('.css') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg') ||
         url.includes('.mp3') ||
         url.includes('.wav');
}

function isAPIRequest(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url)) ||
         url.includes('/api/');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

async function handleStaticAsset(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Error handling static asset:', error);
    
    // Return offline fallback for critical assets
    if (request.url.includes('.mp3') || request.url.includes('.wav')) {
      return new Response('', { status: 204, statusText: 'No Content' });
    }
    
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function handleAPIRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache for API request');
    
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to cached response
      const modifiedResponse = cachedResponse.clone();
      modifiedResponse.headers.set('X-Offline', 'true');
      return modifiedResponse;
    }
    
    // Return offline response for API failures
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'Unable to fetch data while offline' 
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Network failed for navigation, serving cached index.html');
    
    // Fallback to cached index.html for SPA routing
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Ultimate fallback
    return new Response(
      '<!DOCTYPE html><html><head><title>Offline</title></head><body><h1>You are offline</h1><p>Please check your internet connection.</p></body></html>',
      {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
}

async function handleOtherRequest(request) {
  try {
    // Try cache first for other requests
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fallback to network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  switch (event.tag) {
    case 'sync-meditation-data':
      event.waitUntil(syncMeditationData());
      break;
    case 'sync-social-actions':
      event.waitUntil(syncSocialActions());
      break;
    case 'sync-achievements':
      event.waitUntil(syncAchievements());
      break;
  }
});

async function syncMeditationData() {
  try {
    // Get offline meditation sessions from IndexedDB
    const offlineSessions = await getOfflineData('meditation-sessions');
    
    for (const session of offlineSessions) {
      try {
        const response = await fetch('/api/meditation-sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(session)
        });
        
        if (response.ok) {
          await removeOfflineData('meditation-sessions', session.id);
        }
      } catch (error) {
        console.error('Failed to sync meditation session:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed for meditation data:', error);
  }
}

async function syncSocialActions() {
  try {
    // Sync likes, comments, follows, etc.
    const offlineActions = await getOfflineData('social-actions');
    
    for (const action of offlineActions) {
      try {
        const response = await fetch(`/api/${action.endpoint}`, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
        
        if (response.ok) {
          await removeOfflineData('social-actions', action.id);
        }
      } catch (error) {
        console.error('Failed to sync social action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed for social actions:', error);
  }
}

async function syncAchievements() {
  try {
    const offlineAchievements = await getOfflineData('achievements');
    
    for (const achievement of offlineAchievements) {
      try {
        const response = await fetch('/api/achievements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(achievement)
        });
        
        if (response.ok) {
          await removeOfflineData('achievements', achievement.id);
        }
      } catch (error) {
        console.error('Failed to sync achievement:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed for achievements:', error);
  }
}

// IndexedDB helpers (simplified)
async function getOfflineData(storeName) {
  // In a real implementation, you would use IndexedDB here
  return [];
}

async function removeOfflineData(storeName, id) {
  // In a real implementation, you would remove from IndexedDB here
  console.log(`Removing ${id} from ${storeName}`);
}

// Push notifications
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'chrysalis-notification',
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/open-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ],
    data: data.data || {}
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync (experimental)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'refresh-leaderboard') {
    event.waitUntil(refreshLeaderboard());
  }
});

async function refreshLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put('/api/leaderboard', response);
    }
  } catch (error) {
    console.error('Failed to refresh leaderboard:', error);
  }
}

console.log('Service Worker: Loaded');
