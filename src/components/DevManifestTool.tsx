/*
 * TYMCZASOWE NARZĘDZIE DEWELOPERSKIE (do usunięcia przed wdrożeniem produkcyjnym).
 *
 * Generuje pliki manifestu (kontrakt v1 Tender Explorera) dla wskazanych przetargów, żeby można było
 * ręcznie uruchomić `scripts/analyze_manifest.py`. Woła admińskie callable `resolveDocuments` (TT-2),
 * które niczego nie zapisuje i nie pobiera plików.
 *
 * JAK USUNĄĆ: skasuj ten plik oraz dwie linie oznaczone `DEV-MANIFEST` w AdminPanel.tsx (import i użycie).
 * Szukaj frazy `DEV-MANIFEST` w całym repozytorium. Nic innego od tego pliku nie zależy.
 * Po zakończeniu etapu 4 planu integracji usunąć też wpis o narzędziu z integracja-plan.md.
 */
import React, { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase';
import styles from './Auth.module.css';

interface ResolvedFile {
    path: string;
    url: string;
}

interface ResolverResult {
    status: string;
    note?: string;
    platform?: string;
    files?: ResolvedFile[];
}

type Outcome = { docId: string; ok: true; result: ResolverResult } | { docId: string; ok: false; error: string };

const resolveDocuments = httpsCallable<{ docIds: string[] }, { outcomes: Outcome[] }>(functions, 'resolveDocuments');

const download = (filename: string, content: unknown) => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
};

const safeName = (docId: string) => docId.replace(/[^A-Za-z0-9._-]+/g, '_');

const DevManifestTool: React.FC = () => {
    const [input, setInput] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [lines, setLines] = useState<string[]>([]);

    const run = async () => {
        const docIds = input.split(/[\s,;]+/).filter(Boolean);
        if (docIds.length === 0) return;
        setIsRunning(true);
        setLines([]);
        try {
            const { data } = await resolveDocuments({ docIds });
            const report: string[] = [];
            for (const outcome of data.outcomes) {
                if (!outcome.ok) {
                    report.push(`${outcome.docId}: błąd ${outcome.error}`);
                    continue;
                }
                const { status, files, platform, note } = outcome.result;
                if (status !== 'RESOLVED' || !files) {
                    report.push(`${outcome.docId}: ${status}${note ? ` (${note})` : ''}`);
                    continue;
                }
                const filename = `manifest-${safeName(outcome.docId)}.json`;
                download(filename, {
                    contract_version: '1',
                    request_id: safeName(outcome.docId),
                    files: files.map((file) => ({ path: file.path, url: file.url, expected_bytes: null }))
                });
                report.push(`${outcome.docId}: zapisano ${filename} (${files.length} plików, ${platform})`);
            }
            setLines(report);
        } catch (error) {
            setLines([(error as { message?: string })?.message || 'Nie udało się wywołać resolveDocuments.']);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <>
            <h3 style={{ margin: '20px 0 8px' }}>Manifesty do analizy (DEV, tymczasowe)</h3>
            <p style={{ margin: '0 0 8px' }}>
                <small className={styles.role}>
                    Podaj identyfikatory przetargów (docId, do 20, rozdzielone spacją lub nową linią). Dla każdego pobierze się plik manifest-&lt;docId&gt;.json
                    dla <code>scripts/analyze_manifest.py</code>.
                </small>
            </p>
            <div className={styles.inviteRow}>
                <input
                    className={styles.input}
                    type="text"
                    aria-label="docId przetargów"
                    placeholder="docId, docId, ..."
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                />
                <button className={styles.primaryButton} style={{ margin: 0 }} type="button" disabled={isRunning} onClick={run}>
                    {isRunning ? 'Pobieranie...' : 'Generuj manifesty'}
                </button>
            </div>
            {lines.length > 0 && (
                <ul className={styles.userList} role="status">
                    {lines.map((line) => <li key={line} className={styles.userItem}><small className={styles.role}>{line}</small></li>)}
                </ul>
            )}
        </>
    );
};

export default DevManifestTool;
