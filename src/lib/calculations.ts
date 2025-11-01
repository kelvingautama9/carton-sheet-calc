export type Flute = 'A' | 'B' | 'C' | 'E' | 'F' | 'BC' | 'BE' | 'AB';

export const FLUTE_TAKEUP_FACTORS: Record<string, number> = {
  'A': 1.54,
  'B': 1.36,
  'C': 1.46,
  'E': 1.27,
  'F': 1.2,
  'BC': 1.36 + 1.46,
  'BE': 1.36 + 1.27,
  'AB': 1.54 + 1.36
};

// gramLiner1/gramFlute1/gramLiner2/gramFlute2/...
const parseSubstance = (substance: string): number[] => {
    return substance.split('/').map(s => parseInt(s.replace('K', '').replace('W', ''))).filter(n => !isNaN(n));
}

export const calculateGrammage = (substance: string, flute: string): number => {
    const paperWeights = parseSubstance(substance);
    if (paperWeights.length === 0) return 0;
    
    // Single Wall e.g., 125/110/125 for B flute
    if (paperWeights.length === 3 && ['A', 'B', 'C', 'E', 'F'].includes(flute)) {
        const [liner1, gramFlute, liner2] = paperWeights;
        const takeup = FLUTE_TAKEUP_FACTORS[flute] ?? 1;
        return liner1 + (gramFlute * takeup) + liner2;
    }

    // Double Wall e.g., 150/120/110/120/150 for BC flute
    if (paperWeights.length === 5 && ['BC', 'BE', 'AB'].includes(flute)) {
        const [liner1, gramFlute1, liner2, gramFlute2, liner3] = paperWeights;
        const [flute1, flute2] = flute.split('');
        const takeup1 = FLUTE_TAKEUP_FACTORS[flute1] ?? 1;
        const takeup2 = FLUTE_TAKEUP_FACTORS[flute2] ?? 1;
        return liner1 + (gramFlute1 * takeup1) + liner2 + (gramFlute2 * takeup2) + liner3;
    }
    
    // Single face e.g. 125/110
    if (paperWeights.length === 2 && ['A', 'B', 'C', 'E', 'F'].includes(flute)) {
        const [liner1, gramFlute] = paperWeights;
        const takeup = FLUTE_TAKEUP_FACTORS[flute] ?? 1;
        return liner1 + (gramFlute * takeup);
    }
    
    // Fallback: sum of papers without take-up
    return paperWeights.reduce((acc, val) => acc + val, 0);
};

export const calculateTonnage = ({
    panjang,
    lebar,
    substance,
    flute,
    quantity
}: {
    panjang: number; // in mm
    lebar: number; // in mm
    substance: string;
    flute: string;
    quantity: number;
}): number => {
    if (panjang <= 0 || lebar <= 0 || quantity <= 0) return 0;

    const grammage = calculateGrammage(substance, flute);
    if(grammage === 0) return 0;

    const areaInM2 = (panjang / 1000) * (lebar / 1000);
    const weightPerSheetInKg = (areaInM2 * grammage) / 1000;
    const totalWeightInKg = weightPerSheetInKg * quantity;
    const totalWeightInTons = totalWeightInKg / 1000;
    
    return totalWeightInTons;
};

export const calculatePrice = ({
    panjang,
    lebar,
    substance,
    flute,
    quantity,
    pricePerKg
}: {
    panjang: number;
    lebar: number;
    substance: string;
    flute: string;
    quantity: number;
    pricePerKg: number;
}): number => {
    if(pricePerKg <= 0) return 0;

    const tonnage = calculateTonnage({ panjang, lebar, substance, flute, quantity });
    const totalWeightInKg = tonnage * 1000;

    return totalWeightInKg * pricePerKg;
};

// Simplified MOQ logic: based on a minimum tonnage per production run.
export const calculateMOQ = ({
    panjang,
    lebar,
    substance,
    flute,
    minTonnage = 1.0 // default minimum 1 ton
}: {
    panjang: number;
    lebar: number;
    substance: string;
    flute: string;
    minTonnage?: number;
}): number => {
    if (panjang <= 0 || lebar <= 0 || !minTonnage || minTonnage <= 0) return 0;
    
    const grammage = calculateGrammage(substance, flute);
    if(grammage === 0) return Infinity;

    const areaInM2 = (panjang / 1000) * (lebar / 1000);
    const weightPerSheetInKg = (areaInM2 * grammage) / 1000;

    if (weightPerSheetInKg <= 0) return Infinity;

    const minWeightInKg = minTonnage * 1000;
    const moq = Math.ceil(minWeightInKg / weightPerSheetInKg);

    return moq;
};
