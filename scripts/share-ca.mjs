// Раздаёт по локальной сети только публичный cert/ca.crt, чтобы установить его на телефон.
// Закрытые ключи (ca.key, cert.key) этот сервер не отдаёт. Остановить: Ctrl+C.
import { existsSync, readFileSync } from 'fs';
import { createServer } from 'http';
import { networkInterfaces } from 'os';
import { resolve } from 'path';

const PORT = Number(process.env.PORT ?? 8001);
const CA_CRT = resolve(process.cwd(), 'cert/ca.crt');

if (!existsSync(CA_CRT)) {
  console.error('Нет cert/ca.crt — сначала выполните npm run cert');
  process.exit(1);
}

const caCert = readFileSync(CA_CRT);

createServer((request, response) => {
  if (request.url !== '/' && request.url !== '/ca.crt') {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    'Content-Type': 'application/x-x509-ca-cert',
    'Content-Disposition': 'attachment; filename="IsoArch-ca.crt"',
  });
  response.end(caCert);
}).listen(PORT, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => item.address);
  console.log('Откройте на телефоне (та же Wi-Fi-сеть):');
  for (const ip of ips) console.log(`  http://${ip}:${PORT}/ca.crt`);
  console.log('После установки сертификата остановите сервер: Ctrl+C');
});
