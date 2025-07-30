// Утилита для кэширования страниц
class PageCache {
  constructor() {
    this.cache = new Map();
    this.preloadedComponents = new Set();
  }

  // Предварительная загрузка компонента
  async preloadComponent(componentPromise) {
    try {
      const component = await componentPromise;
      return component;
    } catch (error) {
      console.error('Ошибка предварительной загрузки компонента:', error);
      return null;
    }
  }

  // Кэширование данных для страниц
  cachePageData(pageName, data) {
    this.cache.set(pageName, {
      data,
      timestamp: Date.now()
    });
  }

  // Получение кэшированных данных
  getCachedData(pageName) {
    const cached = this.cache.get(pageName);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 минут
      return cached.data;
    }
    return null;
  }

  // Очистка устаревших данных
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > 5 * 60 * 1000) {
        this.cache.delete(key);
      }
    }
  }

  // Предварительная загрузка всех необходимых страниц
  async preloadPages() {
    const pagesToPreload = [
      { name: 'EditPage', import: () => import('../pages/EditPage') },
      { name: 'Chat', import: () => import('../pages/Chat') },
      { name: 'Premium', import: () => import('../pages/Premium') },
      { name: 'ReadyLogin', import: () => import('../pages/ReadyLogin') },
      { name: 'LikesPage', import: () => import('../pages/LikesPageCopy') }
    ];

    const preloadPromises = pagesToPreload.map(async (page) => {
      if (!this.preloadedComponents.has(page.name)) {
        try {
          await this.preloadComponent(page.import());
          this.preloadedComponents.add(page.name);
          console.log(`✅ Предварительно загружена страница: ${page.name}`);
        } catch (error) {
          console.error(`❌ Ошибка предварительной загрузки ${page.name}:`, error);
        }
      }
    });

    await Promise.allSettled(preloadPromises);
  }
}

// Создаем глобальный экземпляр кэша
const pageCache = new PageCache();

export default pageCache; 