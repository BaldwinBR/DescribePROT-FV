import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
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
  {
    type: 'rect',
    id: 'DisoRDPbindDNA',
    label: 'DisoRDPbind-DNA',
    data: disoRDPbindDNAColour,
    color: '#000000',
    sidebar: [
      createSidebarButton('DisoRDPbindDNA', 'DisoRDPbind DNA Binding', COLORS.disoRDPbind, 'box', 0)
    ]
  },
  {
    type: 'rect',
    id: 'drnaPredDNA',
    label: 'DRNApred-DNA',
    data: drnaPredDNAColour,
    color: '#000000',
    sidebar: [
      createSidebarButton('drnaPredDNA', 'DRNApred DNA Binding', COLORS.drnaPred,'box', 0)
    ]
  },
  {
    type: 'curve',
    id: 'DNA_SCORES',
    label: ' ',
    color: [COLORS.disoRDPbind, COLORS.drnaPred],
    flag: 4,
    data: [disoRDPbindDNAScoreData, drnaPredDNAScoreData],
    sidebar: [
      createSidebarButton('DNA_SCORES', 'DisoRDPbind DNA Score', COLORS.disoRDPbind, 'line', 0),
      createSidebarButton('DNA_SCORES', 'DRNApred DNA Score', COLORS.drnaPred, 'line', 1)
    ]
  }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, DNAPanel);
};

