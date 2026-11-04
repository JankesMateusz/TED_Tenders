import { orderTypeConfig, tenderSourceConfig } from './tenderSources';

const luminance = (hex: string): number => {
    const [r, g, b] = [1, 3, 5]
        .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
        .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrastRatio = (a: string, b: string): number => {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
};

// WCAG 2.1 AA dla zwykłego tekstu
const MIN_CONTRAST = 4.5;

describe('kontrast plakietek i chipów filtrów', () => {
    const configs = [
        ...Object.entries(tenderSourceConfig),
        ...Object.entries(orderTypeConfig)
    ];

    it.each(configs)('%s: tekst na tle ma kontrast co najmniej 4.5:1', (_name, config) => {
        expect(contrastRatio(config.color, config.backgroundColor)).toBeGreaterThanOrEqual(MIN_CONTRAST);
    });
});
