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
      { name: 'LikesPage', import: () => import('../pages/LikesPageCopy') },
      { name: 'FindPage', import: () => import('../pages/FindPageNoSwipe') }
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

  // Предварительная загрузка изображений пользователей
  async preloadUserImages(users) {
    if (!users || !Array.isArray(users)) return;

    const imagePromises = users.flatMap((user) =>
      (user.photos || []).map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve; // чтобы не висело при ошибке
        });
      })
    );

    try {
      await Promise.allSettled(imagePromises);
      console.log(`✅ Предварительно загружены изображения для ${users.length} пользователей`);
    } catch (error) {
      console.error('❌ Ошибка предварительной загрузки изображений:', error);
    }
  }

  // Кэширование данных для страниц с пользователями
  async cacheUsersData(userId, userData) {
    try {
      // Кэшируем данные пользователей для LikesPage
      if (userData.likedBy && userData.likedBy.length > 0) {
        const axios = (await import('../axios')).default;
        const likedUsersResponse = await axios.post("/getLikedUsers", {
          userIds: userData.likedBy,
          currentUserId: userId,
        });
        
        if (likedUsersResponse.data) {
          this.cachePageData('likedUsers', likedUsersResponse.data);
          await this.preloadUserImages(likedUsersResponse.data);
          console.log('✅ Кэшированы данные лайкнувших пользователей');
        }
      }

      // Кэшируем данные кандидатов для FindPage
      const axios = (await import('../axios')).default;
      const candidatesResponse = await axios.post("/users/getCandidates", { 
        userId, 
        filters: {} // Базовые фильтры
      });
      
      if (candidatesResponse.data) {
        this.cachePageData('candidates', candidatesResponse.data);
        await this.preloadUserImages(candidatesResponse.data);
        console.log('✅ Кэшированы данные кандидатов');
      }

    } catch (error) {
      console.error('❌ Ошибка кэширования данных пользователей:', error);
    }
  }
}

// Создаем глобальный экземпляр кэша
const pageCache = new PageCache();

export default pageCache; 