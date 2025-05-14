import { initializeViewer } from "../utils/utils";
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
        color: 'black',
        sidebar: [
            {
                id: 'PTM_Sites 0',
                label: 'PTM Phophorylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DC143C; margin-right: 5px;"></span>
                    Phophorylation
                </button>`
            },
            {
                id: 'PTM_Sites 1',
                label: 'PTM Glycosylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #1E90FF; margin-right: 5px;"></span>
                    Glycosylation
                </button>`
            },
            {
                id: 'PTM_Sites 2',
                label: 'PTM Ubiquitination Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #FF4500; margin-right: 5px;"></span>
                    Ubiquitination
                </button>`
            },
            {
                id: 'PTM_Sites 3',
                label: 'PTM SUMOylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #C71585; margin-right: 5px;"></span>
                    SUMOylation
                </button>`
            },
            {
                id: 'PTM_Sites 4',
                label: 'PTM Acetyllysine Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #00CED1; margin-right: 5px;"></span>
                    Acetyllysine
                </button>`
            },
            {
                id: 'PTM_Sites 5',
                label: 'PTM Methylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DAA520; margin-right: 5px;"></span>
                    Methylation
                </button>`
            },
            {
                id: 'PTM_Sites 6',
                label: 'PTM Pyrrolidone carboxylic acid Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #228B22; margin-right: 5px;"></span>
                    Pyrrolidone carboxylic acid
                </button>`
            },
            {
                id: 'PTM_Sites 7',
                label: 'PTM Palmitoylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #9932CC; margin-right: 5px;"></span>
                    Palmitoylation
                </button>`
            },
            {
                id: 'PTM_Sites 8',
                label: 'PTM Hydroxylation Button',
                tooltip: 'Click to Turn Off Site',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                    <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #6A5ACD; margin-right: 5px;"></span>
                    Hydroxylation
                </button>`
            }
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, PTMPanel);
    
    viewer.onButtonSelected((event) => { 
        const buttonId = event.detail.id;
        const resetButtons = [
            'PTM_Sites 0',
            'PTM_Sites 1',
            'PTM_Sites 2',
            'PTM_Sites 3',
            'PTM_Sites 4',
            'PTM_Sites 5',
            'PTM_Sites 6',
            'PTM_Sites 7',
            'PTM_Sites 8'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

