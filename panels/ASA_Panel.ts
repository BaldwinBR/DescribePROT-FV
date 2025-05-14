import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
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
    rsaAvailable: "#fc0080", rsaAvailableSegmentType: "Native Buried Residue",
    rsaAvailableType: "Native Solvent Accessibility",
    rsaUnavailable: "#c0c0c0", unavailableType: "Unavailable",
    asaAvailable: "#ffd2df", asaAvailableSegmentType: "Putative Buried Residue",
    asaAvailableType: "Predicted Solvent Accessibility"
};

// PROCESS RSA BINARY SEGMENTS
const rsaSegments: Segment[] = [
    ...extractSegments(rsaBinary, 1, COLORS.rsaAvailable, COLORS.rsaAvailableSegmentType),
    ...extractSegments(rsaBinary, 2, COLORS.rsaUnavailable, COLORS.unavailableType)
];

// EXTRACT RSA SCORES FOR LINE GRAPH
const rsaLines = extractLines(rsaScore, COLORS.rsaAvailableType);
const rsaScoreSegments: Segment[] = extractScoreSegments(rsaScore, 0, COLORS.rsaAvailable, COLORS.rsaAvailableType);
const rsaScoreData = lineColorSegments(rsaLines, rsaScoreSegments);

// EXTRACT ASA SCORES FOR LINE GRAPH
const asaLines = extractLines(asaScore, COLORS.asaAvailableType);
const asaScoreSegments: Segment[] = extractScoreSegments(asaScore, 0, COLORS.asaAvailable, COLORS.asaAvailableType);
const asaScoreData = lineColorSegments(asaLines, asaScoreSegments);

// PROCESS ASA BINARY SEGMENTS
const asaSegments: Segment[] = extractSegments(asaBinary, 1, COLORS.asaAvailable, COLORS.asaAvailableSegmentType);

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
        color: [COLORS.asaAvailable, COLORS.rsaAvailable],
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

