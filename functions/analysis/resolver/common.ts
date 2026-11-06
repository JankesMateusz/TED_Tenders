import { createHash } from 'node:crypto';
import { Platform, ResolvedFile } from './types';

export const fingerprintOf = (platform: Platform, files: ResolvedFile[]): string => {
  const entries = files
    .map((file) => [file.platformFileId, file.publishedAt ?? '', file.path])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  return createHash('sha256').update(JSON.stringify([platform, entries])).digest('hex');
};

/** Zapewnia unikalne ścieżki w manifeście: powtórzoną nazwę dopisuje z numerem przed rozszerzeniem. */
export const uniquePaths = <T extends { path: string }>(files: T[]): T[] => {
  const seen = new Map<string, number>();
  return files.map((file) => {
    const count = (seen.get(file.path) ?? 0) + 1;
    seen.set(file.path, count);
    if (count === 1) return file;
    const dot = file.path.lastIndexOf('.');
    const hasExtension = dot > file.path.lastIndexOf('/') + 1;
    const path = hasExtension ? `${file.path.slice(0, dot)} (${count})${file.path.slice(dot)}` : `${file.path} (${count})`;
    return { ...file, path };
  });
};

/** Zamienia fragment HTML na zwykły tekst (bez znaczników, z rozwiniętymi podstawowymi encjami). */
export const htmlToText = (html: string): string =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

export const hostOf = (url: string): string | null => {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
};
