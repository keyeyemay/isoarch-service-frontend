# IsoArch · Фронтенд (ЛР7)

**Лабораторная работа №7 · Вариант 18 · «Изотопные сигнатуры».** Адаптивность, PWA,
развёртывание на GitHub Pages и HTTPS для SPA на React: исследования костных останков
(δ¹³C, δ¹⁵N, описание рациона, фото, видео, лайки).

React 19 · TypeScript · Vite 8 · React Router · React-Bootstrap · Redux Toolkit · redux-thunk ·
axios · swagger-typescript-api · vite-plugin-pwa · gh-pages · mkcert.

- **Демо на GitHub Pages (только mock):** https://keyeyemay.github.io/isoarch-service-frontend/
- **Диаграмма развёртывания:** [PNG](docs/diagrams/deployment_diagram.png) · [SVG](docs/diagrams/deployment_diagram.svg)
- Бэкенд — репозиторий `isoarch-service-backend`, ветка `lab4-completed-spa-backend` (ЛР4).

## Что сделано в ЛР7

- **Адаптивность** страниц Плитка, Лента, Добавление (и Вход): от телефона до десктопа.
- **PWA**: `vite-plugin-pwa` генерирует `manifest.webmanifest` и service worker (Workbox).
  Приложение ставится на главный экран, открывается без адресной строки и работает офлайн.
- **GitHub Pages**: `npm run deploy` публикует сборку в ветку `gh-pages`. Бэкенда там нет,
  поэтому данные только mock.
- **HTTPS** на Node.js-сервере Vite. Он же реверс-прокси `/api` → FastAPI и `/s3` → MinIO.
  Сертификат подписан собственным CA (`npm run cert`).
- **Доступ с телефона по IP ноутбука**: адрес API берётся из `window.location.origin`,
  поэтому телефон ходит в бэкенд ноутбука через тот же прокси. Сам бэкенд слушает
  только `127.0.0.1`, напрямую он из сети недоступен.

## Запуск

Сначала бэкенд ЛР4 (отдельный терминал):

```bash
cd ../isoarch-service-backend
docker compose up -d --wait                                          # PostgreSQL, Redis, MinIO, Adminer
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt   # один раз
.venv/bin/python main.py                                             # http://127.0.0.1:8000
```

Демонстрационные пользователи: `archaeologist_main`, `researcher_petrov`, `student_sidorov`,
пароль `StudyPassword123`.

Затем фронтенд, в папке `isoarch-service-frontend`:

```bash
npm install            # один раз
npm run cert           # один раз и после смены Wi-Fi-сети (см. «HTTPS и телефон»)
npm run dev            # https://localhost:3000 и https://<IP ноутбука>:3000
```

Открывать **только по `https://`**: на запрос по `http://` сервер отвечает пустым ответом.

Остальные команды:

```bash
npm run build          # проверка типов и production-сборка в dist/ (с бэкендом)
npm run preview        # раздать dist/ тем же HTTPS-сервером с прокси
npm run build:pages    # сборка для GitHub Pages (base /isoarch-service-frontend/, только mock)
npm run preview:pages  # проверить её локально: https://localhost:3000/isoarch-service-frontend/
npm run deploy         # build:pages + публикация dist/ в ветку gh-pages
npm run cert:share     # раздать cert/ca.crt на телефон по Wi-Fi
npm run lint           # oxlint
npm run generate-api   # перегенерировать src/shared/api/Api.ts по OpenAPI бэкенда
```

| Адрес в браузере | Куда проксируется |
|---|---|
| `https://localhost:3000/api/...` или `https://<IP>:3000/api/...` | `http://localhost:8000/...` (FastAPI) |
| `https://localhost:3000/s3/<bucket>/<key>` | `http://localhost:9000/<bucket>/<key>` (MinIO) |

## HTTPS и телефон

PWA и service worker работают только по HTTPS с **доверенным** сертификатом. На Pages он есть
всегда, а для ноутбука нужен свой удостоверяющий центр (CA), которому доверяют ноутбук и телефон.

### 1. Выпустить сертификат — на ноутбуке

В терминале, в папке фронтенда:

```bash
cd isoarch-service-frontend
npm run cert
```

Скрипт `scripts/generate-cert.mjs` (пакет `mkcert`) создаёт папку `cert/`:

| Файл | Что это |
|---|---|
| `ca.crt` | публичный сертификат CA «IsoArch Dev CA» — **его** ставят на ноутбук и телефон |
| `ca.key` | закрытый ключ CA — никому не передавать |
| `cert.crt`, `cert.key` | сертификат сервера на `localhost`, `127.0.0.1` и все IPv4 ноутбука |

В конце скрипт печатает адреса, на которые выписан сертификат. Сменилась сеть и IP —
запустите `npm run cert` ещё раз: CA переиспользуется, на телефон его ставить заново не нужно.
Дополнительные адреса: `CERT_HOSTS=192.168.1.10 npm run cert`. Папка `cert/` в `.gitignore`,
ключи в репозиторий не попадают. `vite.config.ts` сам подхватывает `cert/cert.crt` и
`cert/cert.key` при следующем `npm run dev`. Если `cert/` нет, используется временный
самоподписанный сертификат, и service worker не регистрируется.

### 2. Доверять CA на ноутбуке

| ОС | Как |
|---|---|
| macOS | `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain cert/ca.crt`, затем перезапустить Chrome |
| Windows | двойной клик по `cert\ca.crt` → «Установить сертификат» → «Локальный компьютер» → «Доверенные корневые центры сертификации», перезапустить браузер |

### 3. Передать `ca.crt` на телефон

Телефон и ноутбук — в одной Wi-Fi-сети. На ноутбуке, в папке фронтенда:

```bash
npm run cert:share
```

Команда печатает ссылку вида `http://192.168.0.172:8001/ca.crt`. Откройте её на телефоне:
в Chrome на Android файл скачается, в Safari на iPhone появится запрос на загрузку профиля.
Сервер отдаёт только `ca.crt`, закрытые ключи недоступны. После установки остановите его: `Ctrl+C`.
Если ссылка не открывается — проверьте, что выбран адрес Wi-Fi (`ipconfig getifaddr en0`
на macOS), а не VPN-интерфейс, и что брандмауэр macOS разрешает входящие подключения для Node.
Можно и без сервера: отправить `cert/ca.crt` себе через AirDrop или мессенджер.

### 4. Установить `ca.crt` на телефоне

| Телефон | Как |
|---|---|
| Android | Настройки → Безопасность → Дополнительные настройки → Шифрование и учётные данные → Установить сертификат → **Сертификат ЦС** → «Всё равно установить» → выбрать скачанный `IsoArch-ca.crt` (названия пунктов немного отличаются у производителей; можно найти поиском по настройкам «сертификат ЦС»). Затем перезапустить Chrome |
| iPhone | после загрузки: Настройки → «Профиль загружен» → Установить. Затем **обязательно** Настройки → Основные → Об этом устройстве → Доверие сертификатам → включить «IsoArch Dev CA» |

### 5. Открыть приложение с телефона

1. На ноутбуке запущены бэкенд и `npm run dev`. В консоли Vite — строка
   `Network: https://<IP ноутбука>:3000` (берите адрес Wi-Fi, например `192.168.0.172`).
2. На телефоне открыть `https://<IP ноутбука>:3000` — замок без предупреждений.
3. Войти: запросы идут на `https://<IP>:3000/api/...`, Vite проксирует их в FastAPI
   ноутбука на `localhost:8000`, медиа — через `/s3` в MinIO. Cookie сессии ставится на `<IP>:3000`.
4. Установить как приложение: Android — меню Chrome → «Установить приложение»;
   iPhone — «Поделиться» → «На экран „Домой“».

Если macOS спрашивает, разрешить ли `node` входящие подключения, — разрешить.

## GitHub Pages (только mock)

Адрес: https://keyeyemay.github.io/isoarch-service-frontend/

- `vite.config.ts`: в режиме `pages` `base: '/isoarch-service-frontend/'` (имя репозитория).
  `BrowserRouter` получает `basename` из `import.meta.env.BASE_URL`, пути к заглушкам
  (`default_signature.*`) тоже строятся от него.
- `.env.pages`: `VITE_DATA_SOURCE=mock` → `IS_MOCK_ONLY` в `shared/config/api.ts`. Thunk
  `getSignaturesList` и `getSignature` сразу возвращают mock (с фильтрацией), запросы не
  отправляются; на плитке — пометка «Демо-версия на GitHub Pages — показаны mock-данные»,
  кнопка «Войти» выключена с пояснением.
- `build:pages` копирует `index.html` в `404.html`: GitHub Pages отдаёт его на любой
  неизвестный путь, поэтому прямые ссылки и F5 на `/feed/2` открывают SPA.
- `npm run deploy` (пакет `gh-pages`) пушит `dist/` в ветку `gh-pages` с `.nojekyll`.
  В настройках репозитория: Settings → Pages → Source «Deploy from a branch», ветка `gh-pages`, `/ (root)`.

## PWA

- `vite.config.ts` → `VitePWA({ registerType: 'autoUpdate', devOptions: { enabled: true }, manifest, workbox })`.
  Манифест: имя «IsoArch — изотопные сигнатуры», `display: standalone`, цвет темы `#CF3B3B`,
  иконки `public/pwa-192x192.png`, `pwa-512x512.png` (+ maskable), `apple-touch-icon.png`.
  `start_url` и `scope` относительные, поэтому одинаково работают на `/` и на Pages.
- Service worker (Workbox `generateSW`) кэширует всю сборку (js, css, html, иконки, заглушки);
  запросы `/api/*` и `/s3/*` не перехватываются навигационным fallback.
- Регистрация — `src/main.tsx`: `registerSW` из `virtual:pwa-register`. Типы —
  `vite-plugin-pwa/client.d.ts` в `tsconfig.app.json`.
- Проверка: DevTools → Application → Manifest (без ошибок) и Service workers (activated).
  На ПК — значок «Установить приложение» в адресной строке.

## Адаптивность: точки перелома и значения

Точки перелома — стандартные Bootstrap: `sm` ≥ 576px, `md` ≥ 768px, `lg` ≥ 992px, `xl` ≥ 1200px.

| Что | Где в коде | Значения |
|---|---|---|
| Ширина контента | `shared/ui/page.css` `.page-main` | на всю ширину, но не шире **1200px** (Добавление — **960px**, Вход — **480px**), по центру; поля 16px → 24px (`md`) → 32px (`lg`) |
| Колонки плитки | `widgets/signature-grid/ui/SignatureGrid.tsx` `GRID_COLUMNS` → `<Row xs sm md lg xl>` | **2** (< 576) → **3** (`sm`) → **4** (`md`) → **3** (`lg`, появляется боковая панель фильтра) → **4** (`xl`) |
| Отступы между карточками | `SignatureGrid.css` `--bs-gutter-x/y` | **12px** → **16px** (`md`) → **20px** (`xl`) |
| Размер карточки | `SignatureTile.css` | ширина = ширина колонки, фото квадратное (`aspect-ratio: 1/1`), все карточки строки одной высоты (`.grid__col` — flex); на `md` шрифт заголовка 13 → 14px, бейджей 11 → 12px |
| Фильтр на плитке | `pages/tiles/ui/TilesPage.css` | над сеткой; на `md` не шире 560px; на `lg` — боковая колонка **300px** слева, «прилипает» при прокрутке (`position: sticky`) |
| Лента | `pages/feed/ui/FeedPage.css` `.feed__stage` | видео-«сцена» формата **9:16** по центру: ширина `clamp(min(100%, 360px), 100dvh·9/16, 100%)` — на телефоне на весь экран, на десктопе вертикальная колонка, по бокам тёмный фон |
| Текст в ленте | `widgets/signature-slide/ui/SignatureSlide.css` | блок описания 246px → 360px (`sm`); заголовок 22 → 26px (`md`) |
| Добавление | `features/create-signature/ui/DraftForm.css`, `MediaUpload.css` | одна колонка; на `sm` превью фото и видео рядом; на `md` две колонки **5fr : 7fr** — слева превью (sticky), справа поля и кнопки |
| Навигация | `widgets/tab-bar/ui/TabBar.css`, `widgets/top-nav/ui/TopNav.css` | таббар снизу всегда; на `md` пункты по **160px** по центру; верхняя панель выровнена по краю контента |

Проверка: DevTools → Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M) → «Responsive», менять ширину.

## Работа с веб-сервисом (ЛР6)

- Карточки загружаются из веб-сервиса ЛР4 (FastAPI). Если бэкенд недоступен, **гостю**
  показываются mock-объекты с пометкой «Сервер недоступен — показаны демонстрационные данные».
- Redux Toolkit хранит фильтр услуг, список, текущую запись, черновик и признак входа.
- Запросы домена услуг — через сгенерированный по OpenAPI клиент (axios) внутри
  `createAsyncThunk`. Вход и выход — только axios, результат вручную передаётся в Redux
  обычным action, без кодогенерации и thunk.
- Во время запросов поверх приложения показывается анимация, блокирующая кнопки.
- Признак входа хранится только в Redux, не в localStorage: **по F5 интерфейс возвращается
  к гостю** — намеренный недостаток ЛР6.

Кодогенерация: `npm run generate-api` берёт схему с `http://localhost:8000/openapi.json`
(или из файла: `OPENAPI_FILE=./openapi.json npm run generate-api`). Генерируются только семь
методов услуг (список в `scripts/generate-api.mjs`), все вызываются через thunk.

| Thunk | Метод клиента | Запрос |
|---|---|---|
| `getSignaturesList` | `getServices` | `GET /services?c13_max=&filter=` |
| `getSignature` | `getFeedById` | `GET /services/feed/{id}` |
| `getDraft` | `getDraft` | `GET /services/draft` |
| `createDraft` | `createDraft` | `POST /services` (multipart: title, image, video) |
| `publishDraft` | `publishDraft` | `PUT /services/{id}` |
| `deleteSignature` | `deleteService` | `DELETE /services/{id}` |
| `toggleLike` | `toggleLike` | `POST /services/{id}/like` |

Авторизация вручную через axios: `POST /auth/login`, `POST /auth/logout`
(`src/features/auth/api/authApi.ts`). Сессия — HttpOnly cookie `session_id`, её ставит бэкенд.

## Страницы

### Плитка — `/`

| Элемент | Описание |
|---|---|
| Верхняя панель | Логотип IsoArch; после входа справа — логин пользователя |
| Поле «Поиск по названию» | Подстрока названия (параметр `filter` запроса) |
| Поле «до … ‰» | Верхняя граница δ¹³C, шаг 0.1, от −25 до −10 (параметр `c13_max`) |
| Слайдер | То же значение, шаг 0.5; слайдер и поле синхронизированы |
| Кнопка «Применить» | Отправляет фильтр в запрос к бэкенду (также Enter) |
| Кнопка «Сбросить» | Видна при активном фильтре; очищает поля и загружает весь список |
| Карточка сигнатуры | Фото, название, бейджи δ¹³C и δ¹⁵N, число лайков. Клик открывает её в ленте |
| Кнопка «Удалить» на карточке | Только после входа и только у своих записей; с подтверждением |
| «Ничего не найдено по заданному фильтру» | С кнопкой «Сбросить фильтр» |

Значения фильтра хранятся в Redux и сохраняются при переходах между страницами.
При выходе фильтр сбрасывается.

### Лента — `/feed` и `/feed/:id`

| Элемент | Описание |
|---|---|
| Видео | Автовоспроизведение без звука, по кругу; постер — фото |
| Заголовок и описание | Описание обрезано до двух строк |
| Кнопка «Ещё» / «Свернуть» | Раскрывает и сворачивает описание |
| Чипы δ¹³C и δ¹⁵N | Значения изотопов, например `-19.5 ‰` |
| Кнопка-сердечко с числом | После входа ставит/снимает лайк. Гостя переводит на «Вход» |
| Кнопка со стрелкой вниз | Следующая сигнатура в порядке плитки (с учётом фильтра), после последней — первая |

`/feed` открывает первую сигнатуру текущего списка.

### Вход — `/login`

| Элемент | Описание |
|---|---|
| Поля «Логин» и «Пароль» | Учётные данные |
| Кнопка «Войти» | При ошибке — «Неверный логин или пароль». После входа — возврат на страницу, откуда пришли (по умолчанию плитка) |

### Добавление — `/add` (только после входа, иначе — переход на «Вход»)

Шаг 1 — новый черновик:

| Элемент | Описание |
|---|---|
| Предпросмотр «Фото образца» и «Видео анализа» | Показывают выбранные файлы сразу после выбора |
| Поле «Название сигнатуры» | Обязательное |
| Поле «Фото» | PNG, JPEG, WebP до 10 МиБ |
| Поле «Видео» | MP4 до 64 МиБ и 60 секунд |
| Кнопка «Далее» | Загружает файлы и создаёт черновик |

Шаг 2 — публикация (открывается и при наличии незавершённого черновика):

| Элемент | Описание |
|---|---|
| Предпросмотр | Фото и видео черновика |
| Поле «Краткое описание исследования» | Обязательное |
| Поля «δ¹⁵N (‰)» и «δ¹³C (‰)» | Числа, шаг 0.1 |
| Кнопка «Удалить черновик» | Удаляет черновик (с подтверждением) |
| Кнопка «Опубликовать» | Публикует и открывает запись в ленте |

### Нижняя панель навигации (на всех страницах)

**Лента**, **Добавление**, **Плитка**, **Вход/Выход**. Гостю «Добавление» недоступно
(приглушено). После входа вместо «Вход» показано «Выход»: выход завершает сессию,
сбрасывает фильтр и возвращает интерфейс гостя. Неизвестные адреса ведут на плитку.

## Структура (Feature-Sliced Design)

| Слой | Содержимое |
|---|---|
| `app/` | Роутер, layout с таббаром и анимацией загрузки, `store/` (Redux), глобальные стили |
| `processes/` | Пусто |
| `pages/` | `tiles`, `feed`, `login`, `add` |
| `widgets/` | `tab-bar`, `top-nav`, `signature-grid`, `signature-slide` |
| `features/` | `c13-filter`, `auth`, `create-signature`, `delete-signature`, `toggle-like`, `expand-description`, `next-signature` |
| `entities/` | `isotopic-signature` (слайс с фильтром и thunk, mock, карточка), `user` (слайс входа) |
| `shared/` | Сгенерированный клиент `api/`, конфиг маршрутов, API и режима mock (`config/api.ts`), обработка ошибок, общие UI |

Вне `src/`: `vite.config.ts` (прокси, HTTPS, PWA, base для Pages), `.env.pages`,
`scripts/generate-cert.mjs` и `scripts/share-ca.mjs` (сертификаты),
`scripts/generate-api.mjs` (кодогенерация), `public/` (иконки PWA, заглушки медиа),
`docs/` (материалы курса, диаграммы, РПЗ).
