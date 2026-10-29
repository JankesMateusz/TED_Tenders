import { IT_CPV_CODES } from './cpvCodes';

export const normalizeCpv = (code: string): string => code.split('-')[0].trim();

export const isItRelatedCpv = (code: string): boolean => {
    if (!code) return false;
    return Object.prototype.hasOwnProperty.call(IT_CPV_CODES, normalizeCpv(code));
};

export const filterTendersByCpvCodes = <T extends { cpvCodes: string[] }>(tenders: T[]): T[] => {
    return tenders.filter(tender => tender.cpvCodes.some((tenderCpv: string) => isItRelatedCpv(tenderCpv)));
};
