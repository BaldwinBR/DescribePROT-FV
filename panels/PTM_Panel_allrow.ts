import { initializeViewer, createSidebarButton } from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// ---------------------------- PTM SPECIFIC HELPERS ----------------------------

interface PTMEntry {
    x: number; // For plotting
    type: string; // PTM Type name (ex: Phosphorylation)
    color: string;
    stroke?: string;
    opacity?: number;
    _stackY?: number; // For stacking in fillSvg
}

const ptmTypes: Record<string, { type: string; color: string }> = {
    '1': { type: 'Phosphorylation', color: '#DC143C' },
    '2': { type: 'Glycosylation', color: '#1E90FF' },
    '3': { type: 'Ubiquitination', color: '#FF4500' },
    '4': { type: 'SUMOylation', color: '#C71585' },
    '5': { type: 'Acetyllysine', color: '#00CED1' },
    '6': { type: 'Methylation', color: '#DAA520' },
    '7': { type: 'Pyrrolidone carboxylic acid', color: '#228B22' },
    '8': { type: 'Palmitoylation', color: '#9932CC' },
    '9': { type: 'Hydroxylation', color: '#6A5ACD' },
};

// Parse PTM data from givenn array and return an array of PTMEntry
function parsePTMPanel(lines: string[]): PTMEntry[] {
    const ptmEntries: PTMEntry[] = [];

    // PTM data starts from line 34
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [ptmID, binaryString] = line.split(',', 2);
        const meta = ptmTypes[ptmID];

        if (!meta || !binaryString) continue;

        // For each position where PTM exists (non-zero), create PTMEntry
        for (let j = 0; j < binaryString.length; j++) {
            if (binaryString[j] !== '0') {
                ptmEntries.push({
                    x: j + 1,
                    type: meta.type,
                    color: meta.color
                });
            }
        }
    }

    return ptmEntries;
}

// ---------------------------- START OF LOGIC HERE ----------------------------

// RETRIEVE DATA 
declare var inputValues: string;

// GET PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("PTM_Panel_allrow");
const sequence = panelData.sequence

// FORMAT DATA RECEIVED (Only need data not keys) 
const lines = Object.entries(panelData)
  .filter(([key]) => key !== "sequence")
  .map(([, value]) => value);

// CALL ENTRIES METHOD
const ptmEntries = parsePTMPanel(lines);

// ---------------------------- PANEL CONSTRUCTION ----------------------------

// EXPORT DATA
export const PTMPanel = [
    {
        type: 'ptmTriangle',
        id: 'PTM_Sites',
        label: 'PTM Sites',
        data: ptmEntries,
        color: '#000000',
        sidebar: Object.entries(ptmTypes).map(([key, { type, color }], index) => 
            createSidebarButton('PTM_Sites', type, color, 'triangle', index)
        )
    }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, PTMPanel);
};

