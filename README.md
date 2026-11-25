# IsoArch · Фронтенд (ЛР7)

**Лабораторная работа №7 · Вариант 18 · «Изотопные сигнатуры».** Адаптивность, PWA,
развёртывание на GitHub Pages и HTTPS для SPA на React: исследования костных останков
(δ¹³C, δ¹⁵N, описание рациона, фото, видео, лайки).

React 19 · TypeScript · Vite · React Router · React-Bootstrap · Redux Toolkit · redux-thunk ·
axios · swagger-typescript-api · vite-plugin-pwa · gh-pages · mkcert. React Context не используется.

## Что добавлено в ЛР7

- **Адаптивность** трёх страниц — Плитка, Лента, Добавление (и страницы Вход). Раньше интерфейс
  был колонкой 390px, теперь подстраивается под ширину от телефона до десктопа (таблица ниже).
- **PWA**: `vite-plugin-pwa` генерирует `manifest.webmanifest` и service worker (Workbox,
  precache сборки). Приложение устанавливается на рабочий стол / главный экран и открывается
  без адресной строки (`display: standalone`), статика доступна офлайн.
- **GitHub Pages**: `npm run deploy` собирает режим `pages` и публикует `dist/` в ветку
  `gh-pages`. На Pages бэкенда нет, поэтому приложение работает **только с mock**.
- **HTTPS** на Node.js-сервере Vite (он же реверс-прокси `/api` и `/s3`) с сертификатом
  своего CA (mkcert), выпущенным на `localhost` и IP-адреса ноутбука.
- **Доступ с телефона по IP ноутбука**: сервер слушает все интерфейсы (`host: true`),
  адрес API берётся из `window.location.origin`, поэтому телефон ходит в бэкенд ноутбука
  через тот же реверс-прокси.

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

Проверка: DevTools → Toggle device toolbar (Ctrl+Shift+M) → «Responsive», менять ширину.

## Что добавлено после ЛР5

- Карточки загружаются из веб-сервиса ЛР4 (FastAPI). Если бэкенд недоступен, **гостю**
  показываются mock-объекты (с пометкой «Сервер недоступен — показаны демонстрационные данные»).
- Redux Toolkit хранит фильтр услуг, список, текущую запись, черновик и признак входа.
  Redux DevTools подключается автоматически (`configureStore`).
- Запросы домена услуг — через сгенерированный по OpenAPI клиент (axios) внутри
  `createAsyncThunk`. Вход и выход — только axios, результат вручную передаётся в Redux
  обычным action, без кодогенерации и thunk.
- Страницы «Вход» и «Добавление», кнопки «Удалить» (плитка) и лайк (лента).
- Во время запросов поверх приложения показывается анимация, блокирующая кнопки.
- CORS решён проксированием dev-сервера: `/api` → бэкенд, `/s3` → MinIO.

Признак входа хранится только в Redux (в оперативной памяти), в localStorage его не кладём:
**по F5 интерфейс возвращается к гостю** — это намеренный недостаток ЛР6.

## Запуск

```bash
npm install
npm run cert           # один раз: CA и сертификат в cert/ (см. «HTTPS»)
npm run dev            # https://localhost:3000 и https://<IP ноутбука>:3000
npm run build          # проверка типов и production-сборка в dist/ (с бэкендом)
npm run preview        # раздать dist/ тем же HTTPS-сервером с прокси
npm run build:pages    # сборка для GitHub Pages (base /isoarch-service-frontend/, только mock)
npm run preview:pages  # проверить её локально: https://localhost:3000/isoarch-service-frontend/
npm run deploy         # build:pages + публикация dist/ в ветку gh-pages
npm run lint           # oxlint
npm run generate-api   # перегенерировать src/shared/api/Api.ts по OpenAPI бэкенда
```

Открывать **только по `https://`** — адрес без него браузер открывает по http, и сервер отвечает
пустым ответом. Если `cert/` нет, Vite использует самоподписанный сертификат
`@vitejs/plugin-basic-ssl` (браузер предупредит: «Дополнительно» → «Перейти на сайт»;
service worker с таким сертификатом не регистрируется).

Бэкенд ЛР4 (репозиторий `isoarch-service-backend`, ветка `lab4-completed-spa-backend`) должен
работать на `http://localhost:8000`, MinIO — на `http://localhost:9000`:

```bash
cd ../isoarch-service-backend
docker compose up -d --wait          # PostgreSQL, Redis, MinIO, Adminer
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt   # один раз
.venv/bin/python main.py             # http://localhost:8000
```

Демонстрационные пользователи новой БД: `archaeologist_main`, `researcher_petrov`, `student_sidorov`,
пароль `StudyPassword123`.

| Адрес в браузере | Куда проксируется |
|---|---|
| `https://localhost:3000/api/...` (или `https://<IP>:3000/api/...`) | `http://localhost:8000/...` (FastAPI) |
| `https://localhost:3000/s3/<bucket>/<key>` | `http://localhost:9000/<bucket>/<key>` (MinIO) |

Кодогенерация: `npm run generate-api` берёт схему с `http://localhost:8000/openapi.json`
(или из файла: `OPENAPI_FILE=./openapi.json npm run generate-api`). Генерируются только семь
методов услуг (список задан в `scripts/generate-api.mjs`), названия — по функциям бэкенда:
`api.services.getServices`, `api.services.createDraft` и т. д. Все они вызываются через thunk.
Всего приложение делает 9 запросов к веб-сервису, все через axios: эти 7 и вход/выход.
Регистрации нет.

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

## GitHub Pages (только mock)

- `vite.config.ts`: в режиме `pages` `base: '/isoarch-service-frontend/'` (имя репозитория).
  `BrowserRouter` получает `basename` из `import.meta.env.BASE_URL`, пути к заглушкам
  (`default_signature.*`) тоже строятся от него.
- `.env.pages`: `VITE_DATA_SOURCE=mock` → `IS_MOCK_ONLY` в `shared/config/api.ts`. Thunk
  `getSignaturesList` и `getSignature` сразу возвращают mock (с фильтрацией), запросы не
  отправляются; на плитке — пометка «Демо-версия на GitHub Pages — показаны mock-данные»,
  вход недоступен (кнопка «Войти» выключена, показано пояснение).
- `build:pages` копирует `index.html` в `404.html`: GitHub Pages отдаёт его на любой
  неизвестный путь, поэтому прямые ссылки и F5 на `/feed/2` открывают SPA.
- `npm run deploy` (пакет `gh-pages`) пушит `dist/` в ветку `gh-pages` с `.nojekyll`.
  Один раз в настройках репозитория: Settings → Pages → Source: «Deploy from a branch»,
  ветка `gh-pages`, папка `/ (root)`. Адрес: https://keyeyemay.github.io/isoarch-service-frontend/

## PWA

- `vite.config.ts` → `VitePWA({ registerType: 'autoUpdate', devOptions: { enabled: true }, manifest, workbox })`.
  Манифест: имя «IsoArch — изотопные сигнатуры», `display: standalone`, цвет темы `#CF3B3B`,
  иконки `public/pwa-192x192.png`, `pwa-512x512.png` (+ maskable), `apple-touch-icon.png`.
  `start_url` и `scope` относительные, поэтому одинаково работают на `/` и на Pages.
- Service worker (Workbox `generateSW`) кэширует всю сборку (js, css, html, иконки, заглушки);
  запросы `/api/*` и `/s3/*` не перехватываются навигационным fallback.
- Регистрация — `src/main.tsx`: `registerSW` из `virtual:pwa-register`, если браузер
  поддерживает `serviceWorker`. Типы — `vite-plugin-pwa/client.d.ts` в `tsconfig.app.json`.
- Проверка: DevTools → Application → Manifest (без ошибок) и Service workers (activated).
  Установка: на ПК — значок «Установить приложение» в адресной строке; на Android в Chrome —
  меню → «Добавить на главный экран» / «Установить приложение»; на iPhone в Safari —
  «Поделиться» → «На экран „Домой“».
- PWA требует HTTPS с **доверенным** сертификатом: на Pages это есть всегда, локально — после
  установки нашего CA (ниже).

## HTTPS

Сервер Vite — Node.js реверс-прокси: отдаёт фронтенд и проксирует `/api` → `:8000`, `/s3` → `:9000`.
HTTPS включён в `vite.config.ts` (`server.https` и `preview.https`): если есть
`cert/cert.key` и `cert/cert.crt`, используются они, иначе — `plugin-basic-ssl`.

`npm run cert` (`scripts/generate-cert.mjs`, пакет `mkcert`):

1. Создаёт свой удостоверяющий центр `cert/ca.crt` + `cert/ca.key` (один раз; при повторном
   запуске переиспользуется, чтобы не переустанавливать его на телефоне).
2. Выпускает `cert/cert.crt` + `cert/cert.key`, подписанный этим CA, на `localhost`,
   `127.0.0.1`, все IPv4 машины, а в WSL — ещё и IPv4 Windows (сетевой адрес ноутбука).
   Дополнительные адреса: `CERT_HOSTS=192.168.1.10,laptop.local npm run cert`.
   Список адресов выводится в консоль. Сменился IP (другая сеть) — запустить ещё раз.

Папка `cert/` в `.gitignore` — **закрытые ключи в репозиторий не попадают**.

Сделать сертификат доверенным (устанавливается только `ca.crt`):

| Где | Как |
|---|---|
| Windows (Chrome/Edge) | двойной клик по `cert\ca.crt` → «Установить сертификат» → «Локальный компьютер» → «Поместить все сертификаты в хранилище» → «Доверенные корневые центры сертификации». Перезапустить браузер |
| Android | скопировать `ca.crt` на телефон → Настройки → Безопасность → Шифрование и учётные данные → Установить сертификат → «Сертификат ЦС» |
| iPhone | открыть `ca.crt` в Safari → установить профиль → Настройки → Основные → Об этом устройстве → Доверие сертификатам → включить |

После этого замок в адресной строке без предупреждений, а service worker регистрируется и по IP.

## Телефон в одной сети с ноутбуком

1. Телефон и ноутбук — в одной Wi-Fi-сети (или телефон раздаёт точку доступа).
2. Запустить бэкенд ЛР4 (ниже) и `npm run dev`. В консоли Vite — строки `Network: https://<IP>:3000`.
3. На телефоне открыть `https://<IP ноутбука>:3000`, войти — запросы идут на
   `https://<IP>:3000/api/...`, Vite проксирует их в FastAPI ноутбука на `localhost:8000`,
   медиа — через `/s3` в MinIO. Cookie сессии ставится на адрес `<IP>:3000`.

**Если проект запущен в WSL2** (режим сети NAT), у WSL свой внутренний IP, и телефон его не видит.
Варианты (PowerShell от администратора):

```powershell
# вариант 1: проброс порта Windows → WSL (IP WSL: `hostname -I` в WSL; меняется после перезапуска WSL)
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=3000 connectaddress=<IP WSL> connectport=3000
New-NetFirewallRule -DisplayName "IsoArch 3000" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow
# убрать: netsh interface portproxy delete v4tov4 listenaddress=0.0.0.0 listenport=3000
```

Вариант 2: в `%UserProfile%\.wslconfig` указать `[wsl2]` / `networkingMode=mirrored`,
выполнить `wsl --shutdown` — тогда WSL получает адреса Windows, проброс не нужен
(правило брандмауэра для порта 3000 всё равно может понадобиться).
IP ноутбука в Wi-Fi-сети — `ipconfig` в Windows («Беспроводная сеть», IPv4-адрес).

## Страницы

Интерфейс адаптивный: на телефоне — как в ЛР6, на планшете и компьютере — см. «Адаптивность».

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

Значения полей фильтра хранятся в Redux и сохраняются при переходах между страницами.
При выходе фильтр сбрасывается.

### Лента — `/feed` и `/feed/:id`

| Элемент | Описание |
|---|---|
| Видео | Автовоспроизведение без звука, по кругу; постер — фото |
| Заголовок и описание | Описание обрезано до двух строк |
| Кнопка «Ещё» / «Свернуть» | Раскрывает и сворачивает описание |
| Чипы δ¹³C и δ¹⁵N | Значения изотопов, например `-19.5 ‰` |
| Кнопка-сердечко с числом | После входа ставит/снимает лайк (заливка = лайк поставлен). Гостя переводит на «Вход» |
| Кнопка со стрелкой вниз | Следующая сигнатура в порядке плитки (с учётом фильтра), после последней — первая |

`/feed` открывает первую сигнатуру текущего списка.

### Вход — `/login`

| Элемент | Описание |
|---|---|
| Поле «Логин» | Имя пользователя |
| Поле «Пароль» | Пароль |
| Кнопка «Войти» | Вход; при ошибке — «Неверный логин или пароль». После входа — возврат на страницу, откуда пришли (по умолчанию плитка) |

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
`scripts/generate-cert.mjs` (сертификаты), `scripts/generate-api.mjs` (кодогенерация),
`public/` (иконки PWA, заглушки медиа).
