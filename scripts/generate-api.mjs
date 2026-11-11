import { resolve } from 'path';

import { generateApi } from 'swagger-typescript-api';

const SERVICE_ROUTES = new Set([
  'GET /services',
  'GET /services/feed/{id}',
  'GET /services/draft',
  'POST /services',
  'PUT /services/{id}',
  'DELETE /services/{id}',
  'POST /services/{id}/like',
]);

const camelCase = (value) => value.replace(/_+([a-z0-9])/g, (_, char) => char.toUpperCase());

generateApi({
  fileName: 'Api.ts',
  output: resolve(process.cwd(), './src/shared/api'),
  ...(process.env.OPENAPI_FILE
    ? { input: resolve(process.cwd(), process.env.OPENAPI_FILE) }
    : { url: process.env.OPENAPI_URL ?? 'http://localhost:8000/openapi.json' }),
  httpClientType: 'axios',
  typeOnlyImports: true,
  hooks: {
    onCreateRoute: (route) =>
      SERVICE_ROUTES.has(`${route.raw.method.toUpperCase()} ${route.raw.route}`) ? route : false,
    onFormatRouteName: ({ operationId, route, method }) => {
      if (!operationId) return undefined;
      const suffix = `${route.replace(/\W/g, '_')}_${method.toLowerCase()}`;
      return camelCase(operationId.endsWith(suffix) ? operationId.slice(0, -suffix.length) : operationId);
    },
  },
});
