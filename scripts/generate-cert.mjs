import { execFileSync } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { networkInterfaces } from 'os';
import { resolve } from 'path';

import { createCA, createCert } from 'mkcert';

const CERT_DIR = resolve(process.cwd(), 'cert');
const CA_KEY = resolve(CERT_DIR, 'ca.key');
const CA_CRT = resolve(CERT_DIR, 'ca.crt');

const localIps = () =>
  Object.values(networkInterfaces())
    .flat()
    .filter((item) => item && item.family === 'IPv4')
    .map((item) => item.address);

const windowsIps = () => {
  if (!readFileSync('/proc/version', { encoding: 'utf8', flag: 'r' }).toLowerCase().includes('microsoft')) {
    return [];
  }
  try {
    return execFileSync(
      'powershell.exe',
      [
        '-NoProfile',
        '-Command',
        "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.PrefixOrigin -in 'Dhcp','Manual' }).IPAddress",
      ],
      { encoding: 'utf8', timeout: 20000 },
    )
      .split(/\s+/)
      .filter(Boolean);
  } catch {
    return [];
  }
};

const safeWindowsIps = () => {
  try {
    return windowsIps();
  } catch {
    return [];
  }
};

const extraHosts = (process.env.CERT_HOSTS ?? '').split(',').map((host) => host.trim()).filter(Boolean);

const domains = [...new Set(['localhost', '127.0.0.1', ...localIps(), ...safeWindowsIps(), ...extraHosts])];

mkdirSync(CERT_DIR, { recursive: true });

let ca;
if (existsSync(CA_KEY) && existsSync(CA_CRT)) {
  ca = { key: readFileSync(CA_KEY, 'utf8'), cert: readFileSync(CA_CRT, 'utf8') };
  console.log('Используется существующий CA: cert/ca.crt');
} else {
  ca = await createCA({
    organization: 'IsoArch Dev CA',
    countryCode: 'RU',
    state: 'Moscow',
    locality: 'Moscow',
    validity: 825,
  });
  writeFileSync(CA_KEY, ca.key);
  writeFileSync(CA_CRT, ca.cert);
  console.log('Создан новый CA: cert/ca.crt (его нужно установить как доверенный на ноутбуке и телефоне)');
}

const cert = await createCert({ ca, domains, validity: 365, organization: 'IsoArch' });
writeFileSync(resolve(CERT_DIR, 'cert.key'), cert.key);
writeFileSync(resolve(CERT_DIR, 'cert.crt'), `${cert.cert}\n${ca.cert}`);

console.log('Сертификат cert/cert.crt выпущен для адресов:');
for (const domain of domains) console.log(`  https://${domain}:3000`);
