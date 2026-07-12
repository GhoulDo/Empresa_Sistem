import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const failures = [];

function isExternal(reference) {
  return /^(?:[a-z]+:|\/\/|#)/i.test(reference);
}

function cleanReference(reference) {
  return decodeURIComponent(reference.split('#')[0].split('?')[0]);
}

function validateLocalHtmlReferences(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
  const references = [...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const reference of references) {
    if (isExternal(reference)) continue;

    const cleaned = cleanReference(reference);
    if (!cleaned || extname(cleaned) !== '.html') continue;

    const target = normalize(resolve(dirname(htmlPath), cleaned));
    if (!existsSync(target)) {
      failures.push(`${relative(root, htmlPath)} references missing page: ${cleaned}`);
    }
  }
}

const homePage = join(root, 'index.html');
if (!existsSync(homePage)) {
  failures.push('index.html is missing');
} else {
  validateLocalHtmlReferences(homePage);
}

const sitemapPath = join(root, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  failures.push('sitemap.xml is missing');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const baseUrl = 'https://ghouldo.github.io/Empresa_Sistem/';
  const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());

  for (const location of locations) {
    if (!location.startsWith(baseUrl)) continue;

    const repositoryPath = location.slice(baseUrl.length);
    const target = repositoryPath ? join(root, repositoryPath) : homePage;
    if (!existsSync(target)) {
      failures.push(`sitemap.xml references missing page: ${repositoryPath || 'index.html'}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Static-site integrity checks failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Static-site integrity checks passed for index.html and sitemap.xml.');
