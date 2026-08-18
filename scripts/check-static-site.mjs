import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, isAbsolute, join, normalize, relative, resolve, sep } from 'node:path';

const root = resolve(process.cwd());
const failures = [];

function isExternal(reference) {
  return /^(?:[a-z]+:|\/\/|#)/i.test(reference);
}

function cleanReference(reference, sourcePath) {
  const value = reference.split('#')[0].split('?')[0];
  if (!value) return '';

  try {
    return decodeURIComponent(value);
  } catch {
    failures.push(`${relative(root, sourcePath)} has invalid URL encoding: ${reference}`);
    return null;
  }
}

function isInsideRepository(target) {
  const repositoryRelative = relative(root, target);
  return repositoryRelative === '' || (!repositoryRelative.startsWith(`..${sep}`) && repositoryRelative !== '..' && !isAbsolute(repositoryRelative));
}

function collectHtmlFiles(directory) {
  const htmlFiles = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;

    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      htmlFiles.push(...collectHtmlFiles(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      htmlFiles.push(entryPath);
    }
  }

  return htmlFiles;
}

function validateLocalReferences(htmlPath) {
  const html = readFileSync(htmlPath, 'utf8');
  const references = [...html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)].map((match) => match[1]);

  for (const reference of references) {
    if (isExternal(reference)) continue;

    const cleaned = cleanReference(reference, htmlPath);
    if (cleaned === null || !cleaned) continue;

    const target = normalize(resolve(dirname(htmlPath), cleaned));
    if (!isInsideRepository(target)) {
      failures.push(`${relative(root, htmlPath)} references a path outside the repository: ${cleaned}`);
      continue;
    }

    if (!existsSync(target)) {
      failures.push(`${relative(root, htmlPath)} references missing local file: ${cleaned}`);
    }
  }
}

const homePage = join(root, 'index.html');
if (!existsSync(homePage)) {
  failures.push('index.html is missing');
}

const htmlFiles = collectHtmlFiles(root);
for (const htmlPath of htmlFiles) {
  validateLocalReferences(htmlPath);
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

console.log(`Static-site integrity checks passed for ${htmlFiles.length} HTML file(s), local assets, and sitemap.xml.`);
