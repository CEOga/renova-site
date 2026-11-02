# Renova

Адаптивный сайт по макетам Figma Renova: desktop, tablet и mobile. Макеты реализованы в одной странице с адаптивными контрольными точками.

## Запуск

Откройте `index.html` в браузере или запустите любой статический сервер из этой папки.

## Cloudflare Pages

В репозитории Renova оставьте корневую папку проекта по умолчанию (`/`), команду сборки пустой, а папку публикации задайте `/`. Страница и Pages Function публикуются из корня репозитория.

### Форма заявок в Telegram

Форма отправляет заявку в Cloudflare Pages Function `functions/api/lead.js`. Чтобы Function могла писать в Telegram, добавьте в настройках проекта Cloudflare Pages (`Settings → Variables and Secrets`) два секретных значения для Production и Preview:

- `TELEGRAM_BOT_TOKEN` — токен бота от `@BotFather`.
- `TELEGRAM_CHAT_ID` — ID личного чата или группы, куда присылать заявки.

Создайте бота через `@BotFather`, откройте его и нажмите Start, затем определите свой chat ID (например, через `@userinfobot`). Не добавляйте токен в HTML, JavaScript, GitHub или публичные сообщения. После сохранения секретов запустите новый deployment в Cloudflare Pages.
