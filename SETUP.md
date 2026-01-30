# Инструкция по запуску проекта

## Требования
- Node.js версии 18 или выше
- npm (устанавливается вместе с Node.js)

## Установка Node.js

### Вариант 1: Через официальный сайт
1. Перейдите на https://nodejs.org/
2. Скачайте LTS версию для macOS
3. Установите скачанный файл

### Вариант 2: Через Homebrew (если установлен)
```bash
brew install node
```

### Вариант 3: Через nvm (Node Version Manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.zshrc
nvm install --lts
nvm use --lts
```

## Запуск проекта

После установки Node.js выполните:

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Проект будет доступен по адресу: http://localhost:3000

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`
