import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Linker_Panel");

const sequence = panelData.sequence;
const linkerBinary = panelData.linkerBinary
const linkerScore = panelData.linkerScore

// SET COLORS FOR DATA
const COLORS = {
    linker: "#ff9408", linkerSegmentType: "Linker Residues",
    linkerType: "Linker Score"
};

// **Linker Panel**
const linkerSegments: Segment[] = extractSegments(linkerBinary, 1, COLORS.linker, COLORS.linkerSegmentType);
const linkerScoreData = extractLines(linkerScore, COLORS.linkerType);


// EXPORT DATA
export const LinkerPanel = [
    {
        type: 'rect',
        id: 'Linker_Residues',
        label: 'Linker',
        data: linkerSegments,
        color: '#000000',
        sidebar: [
            createSidebarButton('Linker_Residues', 'Linker Residues', COLORS.linker, 'box', 0)
        ]
    },
    {
        type: 'curve',
        id: 'LINKER_SCORES',
        label: ' ',
        color: COLORS.linker,
        data: linkerScoreData,
        sidebar: [
            createSidebarButton('LINKER_SCORES', 'Linker Score', COLORS.linker, 'line', 0)
        ]
    },
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, LinkerPanel);
};

