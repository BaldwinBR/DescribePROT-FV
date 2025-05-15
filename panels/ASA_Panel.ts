import { initializeViewer, createSidebarButton, extractSegments, extractLines} from "../utils/utils";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("ASA_Panel");

const sequence = panelData.sequence;
const rsaBinary = panelData.rsaBinary;
const rsaScore = panelData.rsaScore;
const asaBinary = panelData.asaBinary;
const asaScore = panelData.asaScore;

// SET COLORS FOR DATA
const COLORS = {
    rsaAvailable: "#fc0080",
    rsaUnavailable: "#c0c0c0",
    asaAvailable: "#ffd2df"
};

// PROCESS RSA BINARY SEGMENTS
const rsaSegments: FeatureData[] = [
    ...extractSegments(rsaBinary, 1, COLORS.rsaAvailable, "Native Buried Residues"),
    ...extractSegments(rsaBinary, 2, COLORS.rsaUnavailable, "Unavailable")
];

// PROCESS ASA BINARY SEGMENTS
const asaSegments: FeatureData[] = extractSegments(asaBinary, 1, COLORS.asaAvailable, "Putative Buried Residue");

// PROCESS SCORES
const rsaScoreData = extractLines(rsaScore, COLORS.rsaAvailable, "Native Solvent Accessibility");
const asaScoreData = extractLines(asaScore, COLORS.asaAvailable, "Predicted Solvent Accessibility");

// EXPORT DATA
export const asaPanel = [
    {
        type: 'rect',
        id: 'Native_RSA_Binary',
        label: 'Native Buried Residues',
        data: rsaSegments,
        color: "#000000", 
        sidebar: [
            createSidebarButton('Native_RSA_Binary', 'Native Buried Residue', COLORS.rsaAvailable, 'box', 0)
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Buried_Residue',
        label: 'Putative Buried Residue',
        data: asaSegments,
        color: '#000000',
        sidebar: [
            createSidebarButton('Putative_Buried_Residue', 'Putative Buried Residue', COLORS.asaAvailable, 'box', 0)
        ]
    },
    {
        type: 'curve',
        id: 'ASA_SCORES',
        label: ' ',
        data: [asaScoreData, rsaScoreData],
        sidebar: [
            createSidebarButton('ASA_SCORES', 'Native Solvent Accessibility', COLORS.rsaAvailable, 'line', 1),
            createSidebarButton('ASA_SCORES', 'Predicted Solvent Accessibility', COLORS.asaAvailable, 'line', 0)
        ]
    }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, asaPanel);
};

