// ============================================================
// НАСТРОЙКИ PWA АВТООБНОВЛЕНИЯ (меняй только здесь)
// ============================================================
const APP_VERSION = '1.3.1';      // Версия приложения — увеличивай при каждом изменении кода
const UPDATE_INTERVAL_MS = 60000; // Интервал проверки обновлений (мс): 60 секунд
const CACHE_NAME = `rubinchik-v${APP_VERSION}`; // Имя кэша привязано к версии

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './script.js',
  './icon-192.png',
  './icon-512.png',
  './sound/intro.mp3',
  './sound/sound1.mp3', './sound/sound2.mp3', './sound/sound3.mp3', './sound/sound4.mp3', './sound/sound5.mp3',
  './sound/sound6.mp3', './sound/sound7.mp3', './sound/sound8.mp3', './sound/sound9.mp3', './sound/sound10.mp3',
  './sound/sound11.mp3', './sound/sound12.mp3', './sound/sound13.mp3', './sound/sound14.mp3', './sound/sound15.mp3',
  './sound/end.mp3',
  './sound/place.mp3', './sound/place1.mp3', './sound/place2.mp3', './sound/place3.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js'
];

// ============================================================
// ОБРАБОТКА СООБЩЕНИЙ ОТ СТРАНИЦЫ (для проверки версии)
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CHECK_VERSION') {
        event.ports[0].postMessage({ version: APP_VERSION });
    }
});

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return Promise.allSettled(
          urlsToCache.map(url =>
            cache.add(url).catch(err => {
              console.warn('Не удалось кэшировать:', url, err);
            })
          )
        );
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const toDelete = cacheNames.filter(name => name !== CACHE_NAME);
      return Promise.all(toDelete.map(name => {
        console.log('Удаление старого кэша:', name);
        return caches.delete(name);
      }));
    }).then(() => self.clients.claim())
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  const isSameOrigin = url.origin === self.location.origin;
  const isAllowedCdn = url.hostname === 'cdnjs.cloudflare.com';
  if (!isSameOrigin && !isAllowedCdn) return;

  event.respondWith(handleFetch(event));
});

async function handleFetch(event) {
  const { request } = event;

  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (!response || response.status !== 200 || response.type === 'error') {
      return response;
    }

    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());

    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === 'navigate') {
      const fallback = await caches.match('./index.html');
      if (fallback) return fallback;
    }

    if (request.mode === 'navigate') {
      return new Response(
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Офлайн</title></head><body><p>Нет подключения к интернету. Откройте приложение позже.</p></body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    throw err;
  }
}