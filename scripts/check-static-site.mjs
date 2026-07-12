import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, normalize, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const supportedExtensions = new Set(['.html', '.css', '.js']);
const failures = [];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const absolutePath = join(directory, entry);
    return statSync(absolutePath).isDirectory() ? walk(absolutePath) : [absolutePath];
  });
}

function isExternal(reference) {
  return /^(?:[a-z]+:|\/\/|#)/i.test(reference);
}

function cleanReference(reference) {
  return decodeURIComponent(reference.split('#')[0].split('?')[0]);
}

const htmlFiles = walk(root).filter((file) => extname(file) === '.html' && !file.includes(`${join(root, '.git')}`));

for (const htmlFile of htmlFiles) {
  const html = readFileSync(htmlFile, 'utf8');
  const references = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const reference of references) {
    if (isExternal(reference)) continue;

    const cleaned = cleanReference(reference);
    if (!cleaned || !supportedExtensions.has(extname(cleaned))) continue;

    const target = normalize(resolve(dirname(htmlFile), cleaned));
    if (!existsSync(target)) {
      failures.push(`${relative(root, htmlFile)} references missing file: ${cleaned}`);
    }
  }
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
    const target = repositoryPath ? join(root, repositoryPath) : join(root, 'index.html');
    if (!existsSync(target)) {
      failures.push(`sitemap.xml references missing file: ${repositoryPath || 'index.html'}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Static-site integrity checks failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Static-site integrity checks passed for ${htmlFiles.length} HTML files.`);
