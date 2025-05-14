import { initializeViewer, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("DNA_Panel");

const sequence = panelData.sequence;
const disoRDPbindDNA = panelData.disoRDPbindDNA
const drnaPredDNA = panelData.drnaPredDNA
const disoRDPbindDNAScore = panelData.disoRDPbindDNAScore
const drnaPredDNAScore = panelData.drnaPredDNAScore

// SET COLORS FOR DATA
const COLORS = {
    disoRDPbind: "#c071fe",
    drnaPred: "#ce5dae"
};

// CONSTRUCT SEGMENTS
const disoRDPbindDNAColour: Segment[] = extractSegments(disoRDPbindDNA, 1, COLORS.disoRDPbind);
const drnaPredDNAColour: Segment[] = extractSegments(drnaPredDNA, 1, COLORS.drnaPred);

// CONSTRUCT LINES & COLORED SCORE DATA
const disoRDPbindDNAScoreData = lineColorSegments(
    extractLines(disoRDPbindDNAScore),
    extractScoreSegments(disoRDPbindDNAScore, 0, COLORS.disoRDPbind)
);

const drnaPredDNAScoreData = lineColorSegments(
    extractLines(drnaPredDNAScore),
    extractScoreSegments(drnaPredDNAScore, 0, COLORS.drnaPred)
);

// EXPORT DATA
export const DNAPanel = [         
    // ** DNA PANEL **
    { 
        type: 'rect', 
        id: 'DisoRDPbindDNA', 
        label: 'DisoRDPbind-DNA', 
        data: disoRDPbindDNAColour, 
        color: "#c071fe",
        sidebar: [
            {
                id: 'DisoRDPbindDNA_Button',
                label: 'DisoRDPbind DNA binding Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #c071fe; margin-right: 5px;"></span>
                    DisoRDPbind DNA Binding
                </button>`
            }
        ]
    },
    { 
        type: 'rect', 
        id: 'drnaPredDNA', 
        label: 'DRNApred-DNA', 
        data: drnaPredDNAColour, 
        color: "#ce5dae",
        sidebar: [
            {
                id: 'drnaPredDNA_Button',
                label: 'DRNApred DNA binding Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #ce5dae; margin-right: 5px;"></span>
                    DRNApred DNA Binding
                </button>`
            }
        ]
    },
    { 
        type: 'curve', 
        id: 'DNA_SCORES', 
        label: ' ', 
        color: ['#c071fe', '#ce5dae'],
        flag: 4,
        data: [disoRDPbindDNAScoreData, drnaPredDNAScoreData],
        sidebar: [
            {
                id: 'DNA_SCORES 0',
                label: 'DisoRDPbind DNA Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #c071fe; margin-right: 5px; vertical-align: middle;"></span>
                    DisoRDPbind DNA Score
                </button>`
            },
            {
                id: 'DNA_SCORES 1',
                label: 'DRNApred DNA Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #ce5dae; margin-right: 5px; vertical-align: middle;"></span>
                    DRNApred DNA Score 
                </button>`
            }
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, DNAPanel);
    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'DisoRDPbindDNA_Button',
            'drnaPredDNA_Button',
            'DNA_SCORES 0',
            'DNA_SCORES 1',
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

