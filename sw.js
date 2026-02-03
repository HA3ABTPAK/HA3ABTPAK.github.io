const CACHE_NAME = 'rubinchik-v1.1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './intro.mp3',
  './sound1.mp3',
  './sound2.mp3',
  './sound3.mp3',
  './sound4.mp3',
  './sound5.mp3',
  './sound6.mp3',
  './sound7.mp3',
  './sound8.mp3',
  './sound9.mp3',
  './sound10.mp3',
  './sound11.mp3',
  './sound12.mp3',
  './sound13.mp3',
  './sound14.mp3',
  './sound15.mp3',
  './end.mp3',
  './place.mp3',
  './place1.mp3',
  './place2.mp3',
  './place3.mp3',
  'https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js'
];

// Установка Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Кэширование файлов');
        return cache.addAll(urlsToCache);
      })
  );
});

// Активация Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Удаление старого кэша:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный файл или загружаем из сети
        return response || fetch(event.request);
      })
      .catch(() => {
        // Для аудиофайлов возвращаем из кэша даже при ошибке сети
        if (event.request.url.includes('.mp3')) {
          return caches.match(event.request);
        }
      })
  );

});
