import { IT_CPV_CODES } from './cpvCodes';
import { normalizeCpv } from './cpvFilter';

export const getCpvName = (code: string): string => {
    const name = IT_CPV_CODES[normalizeCpv(code)];
    return name ?? code;
};
