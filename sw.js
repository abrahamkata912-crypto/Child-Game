const CACHE_NAME = 'kids-game-v1';
// ሴቭ የሚደረጉ ፋይሎች ዝርዝር
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json'
];

// አፑ መጀመሪያ ሲጫን ፋይሎቹን ሴቭ ማድረግ
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// ኢንተርኔት በሌለበት ጊዜ አፑን ከሴቭ የተደረገው ፋይል መክፈት
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
