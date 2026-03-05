# Deploy BeautyPass (Frontend + Backend) to Render

Проект уже настроен как единый Node.js сервис: Express отдает API и статику из `public`.

## 1) Подготовка перед деплоем

1. Убедитесь, что в git не попал `.env` (в проекте он уже игнорируется).
2. Загрузите проект в GitHub.
3. В MongoDB Atlas разрешите подключения с Render (Network Access).

## 2) Деплой через Blueprint

1. Откройте Render.
2. Нажмите **New** → **Blueprint**.
3. Подключите GitHub-репозиторий с этим проектом.
4. Render автоматически прочитает `render.yaml`.
5. Заполните environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `TBC_IPAY_KEY`
   - `TBC_IPAY_SECRET`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `OPENAI_API_KEY`
   - при необходимости переменные `BOG_*`
6. Запустите деплой.

## 3) Проверка после деплоя

1. Откройте `https://<your-service>.onrender.com/api/status`.
2. Откройте главную страницу `https://<your-service>.onrender.com`.
3. Проверьте логин/регистрацию и запросы к API.

## 4) Важно по безопасности

Если какие-либо секреты уже были в публичном доступе, их нужно заменить:
- MongoDB user/password
- `JWT_SECRET`
- email app password
- платежные ключи

## 5) Важно по uploads

На free web service локальные файлы могут очищаться при рестарте/редеплое.
Если нужна постоянная загрузка файлов пользователей, используйте:
- Render Persistent Disk, или
- внешнее хранилище (S3 / Cloudinary).