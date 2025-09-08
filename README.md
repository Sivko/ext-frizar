# Ext Frizar

Google Chrome расширение, созданное с использованием TypeScript и React.


## Возможности

- Современный интерфейс на React
- TypeScript для типобезопасности
- Content Script для взаимодействия с веб-страницами
- Background Script для фоновых задач
- Красивый popup интерфейс

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm install
   ```

3. Настройте эндпоинты webhook'ов:
   ```bash
   # Скопируйте пример конфигурации
   cp src/config/endpoints.example.ts src/config/endpoints.ts
   
   # Отредактируйте файл src/config/endpoints.ts и укажите ваши реальные URL'ы
   ```

4. Соберите проект:
   ```bash
   npm run build
   ```

5. Загрузите расширение в Chrome:
   - Откройте `chrome://extensions/`
   - Включите "Режим разработчика"
   - Нажмите "Загрузить распакованное расширение"
   - Выберите папку `dist`

## Разработка

```bash
# Запуск в режиме разработки
npm run dev

# Проверка типов
npm run type-check

# Сборка для продакшена
npm run build
```

## Структура проекта

```
src/
├── popup/           # Popup интерфейс
│   ├── App.tsx     # Основной компонент
│   ├── App.css     # Стили
│   ├── main.tsx    # Точка входа
│   └── index.html  # HTML шаблон
├── content/        # Content Script
│   └── content.ts  # Скрипт для веб-страниц
├── background/     # Background Script
│   └── background.ts # Фоновый скрипт
└── config/        # Конфигурация
    ├── endpoints.example.ts # Пример конфигурации эндпоинтов
    ├── endpoints.ts         # Реальные эндпоинты (не в git)
    └── webhooks.ts          # Логика работы с webhook'ами
```

## Безопасность

- Файл `src/config/endpoints.ts` с реальными эндпоинтами автоматически игнорируется git'ом
- Используйте `endpoints.example.ts` как шаблон для настройки
- Никогда не коммитьте реальные URL'ы в репозиторий

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Chrome Extensions API** - API расширений

## Яндекс барузер

Для установки необходимо аключить режим разработчика здесь browser://extensions/