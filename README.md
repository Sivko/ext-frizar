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

3. Создайте файл `.env` в корне проекта:
   ```bash
   # Webhook URLs для Chrome расширения
   WEBHOOK_TEST_URL=https://nudhafakuepas.beget.app/webhook-test/ext-data
   WEBHOOK_PROD_URL=https://nudhafakuepas.beget.app/webhook/ext-data
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
└── background/     # Background Script
    └── background.ts # Фоновый скрипт
```

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик
- **Chrome Extensions API** - API расширений
