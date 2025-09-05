// Пример конфигурации эндпоинтов webhook'ов
// Скопируйте этот файл в endpoints.ts и укажите ваши реальные URL'ы

export const WEBHOOK_ENDPOINTS = {
  test: 'https://your-domain.com/webhook-test/ext-data',
  prod: 'https://your-domain.com/webhook/ext-data'
}

// Функция для получения URL
export function getWebhookUrl(type: 'test' | 'prod'): string {
  return WEBHOOK_ENDPOINTS[type]
}

// Инструкции:
// 1. Скопируйте этот файл: cp endpoints.example.ts endpoints.ts
// 2. Замените URL'ы на ваши реальные эндпоинты
// 3. Файл endpoints.ts автоматически игнорируется git'ом
