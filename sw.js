// ============================================================
// НАСТРОЙКИ PWA АВТООБНОВЛЕНИЯ
// ============================================================
const APP_VERSION = '1.4.2';
const UPDATE_INTERVAL_MS = 60000;
const CACHE_NAME = `rubinchik-v${APP_VERSION}`;

// ===== КРИТИЧЕСКИЕ ФАЙЛЫ (БЕЗ НИХ PWA НЕ РАБОТАЕТ) =====
const criticalFiles = [
  './',
  './index.html',
  './manifest.json',
  './style.css',
  './script.js',
  './icon/icon-192.png',
  './icon/icon-512.png'
];

// ===== АУДИОФАЙЛЫ (КЭШИРУЮТСЯ В ФОНЕ, НЕ БЛОКИРУЮТ УСТАНОВКУ) =====
const audioFiles = [
  './sound/intro.mp3',
  './sound/click.mp3',
  './sound/sound1.mp3', './sound/sound2.mp3', './sound/sound3.mp3', './sound/sound4.mp3', './sound/sound5.mp3',
  './sound/sound6.mp3', './sound/sound7.mp3', './sound/sound8.mp3', './sound/sound9.mp3', './sound/sound10.mp3',
  './sound/sound11.mp3', './sound/sound12.mp3', './sound/sound13.mp3', './sound/sound14.mp3', './sound/sound15.mp3',
  './sound/end.mp3',
  './sound/place.mp3', './sound/place1.mp3', './sound/place2.mp3', './sound/place3.mp3'
];

// Внешняя библиотека
const externalFiles = [
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js'
];

// Все файлы вместе (для логики)
const allFiles = [...criticalFiles, ...externalFiles, ...audioFiles];

// ============================================================
// ОБРАБОТКА СООБЩЕНИЙ
// ============================================================
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CHECK_VERSION') {
        event.ports[0].postMessage({ version: APP_VERSION });
    }
});

// ============================================================
// УСТАНОВКА - СНАЧАЛА КРИТИЧЕСКИЕ ФАЙЛЫ
// ============================================================
self.addEventListener('install', event => {
  console.log('[SW] Установка версии:', APP_VERSION);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async cache => {
        // ШАГ 1: Кэшируем критические файлы (СИНХРОННО, ОБЯЗАТЕЛЬНО)
        console.log('[SW] Кэширование критических файлов...');
        for (const url of criticalFiles) {
          try {
            await cache.add(url);
            console.log(`[SW] ✅ Критический: ${url}`);
          } catch (err) {
            console.error(`[SW] ❌ Ошибка критического файла: ${url}`, err);
          }
        }
        
        // ШАГ 2: Кэшируем внешние библиотеки
        for (const url of externalFiles) {
          try {
            await cache.add(url);
            console.log(`[SW] ✅ Внешний: ${url}`);
          } catch (err) {
            console.error(`[SW] ❌ Ошибка внешнего: ${url}`, err);
          }
        }
        
        // ШАГ 3: Аудиофайлы кэшируем в фоне (НЕ ЖДЕМ)
        console.log('[SW] Запуск фонового кэширования аудио...');
        for (const url of audioFiles) {
          fetch(url)
            .then(response => {
              if (response.ok) {
                cache.put(url, response);
                console.log(`[SW] ✅ Аудио (фон): ${url}`);
              }
            })
            .catch(err => console.warn(`[SW] ⚠️ Аудио не загружено: ${url}`, err));
        }
      })
      .then(() => {
        console.log('[SW] Установка завершена, активируем...');
        return self.skipWaiting();
      })
  );
});

// ============================================================
// АКТИВАЦИЯ - УДАЛЕНИЕ СТАРЫХ КЭШЕЙ
// ============================================================
self.addEventListener('activate', event => {
  console.log('[SW] Активация версии:', APP_VERSION);
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      const toDelete = cacheNames.filter(name => name !== CACHE_NAME);
      return Promise.all(toDelete.map(name => {
        console.log('[SW] Удаление старого кэша:', name);
        return caches.delete(name);
      }));
    }).then(() => {
      console.log('[SW] Активация завершена, захватываем клиентов');
      return self.clients.claim();
    })
  );
});

// ============================================================
// ПЕРЕХВАТ ЗАПРОСОВ
// ============================================================
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

    throw err;
  }
}