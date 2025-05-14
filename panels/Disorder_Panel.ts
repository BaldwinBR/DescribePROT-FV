import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment } from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Disorder_Panel");

const sequence = panelData.sequence;
const disorderBinary = panelData.disorderBinary;
const vslBinary = panelData.vslBinary;
const vslScore = panelData.vslScore;

// SET COLORS FOR DATA
const COLORS = {
    nativeDisorder: "#2da02c",
    nativeUnavailable: "#c0c0c0",
    putativeDisorder: "#76fd63"
};

// PROCESS NATIVE DISORDER SEGMENTS
const nativeDisorderSegments: Segment[] = [
    ...extractSegments(disorderBinary, 1, COLORS.nativeDisorder),
    ...extractSegments(disorderBinary, 2, COLORS.nativeUnavailable)
];

// PROCESS PUTATIVE DISORDER SEGMENTS
const putativeDisorderSegments: Segment[] = extractSegments(vslBinary, 1, COLORS.putativeDisorder);

// EXTRACT VSL SCORES FOR LINE GRAPH
const vslScoreData = extractLines(vslScore);

// EXPORT DATA
export const disorderPanel = [
    {
        type: 'rect',
        id: 'Native_Disorder',
        label: 'Native Disorder',
        data: nativeDisorderSegments,
        color: "#000000",
        className : 'Native_Disorder',
        sidebar: [
            createSidebarButton('Native_Disorder', 'Native Disordered', COLORS.nativeDisorder, 'box', 0)
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Disorder',
        label: 'Putative Disorder',
        data: putativeDisorderSegments,
        color: '#000000',
        sidebar: [
                
            createSidebarButton('Putative_Disorder', 'Putative Disordered', COLORS.putativeDisorder, 'box', 0)
            
        ]
    },
    {
        type: 'curve',
        id: 'PREDICTIVE_DISORDER_SCORES',
        label: ' ',
        color: COLORS.putativeDisorder,
        flag: 6,
        data: vslScoreData,
        sidebar: [
            createSidebarButton('PREDICTIVE_DISORDER_SCORES', 'Predictive Disordered', COLORS.putativeDisorder, 'line', 0)
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, disorderPanel);
};