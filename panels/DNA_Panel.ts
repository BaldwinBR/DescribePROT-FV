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
    disoRDPbind: "#c071fe", disoRDPbindSegmentType: "DisoRDPbind DNA Binding",
    disoRDPbindType: "DisoRDPbind DNA Score",
    drnaPred: "#ce5dae", drnaPredSegmentType: "DRNApred DNA Binding",
    drnaPredType: "DRNApred DNA Score"
};

// CONSTRUCT SEGMENTS
const disoRDPbindDNAColour: Segment[] = extractSegments(disoRDPbindDNA, 1, COLORS.disoRDPbind, COLORS.disoRDPbindSegmentType);
const drnaPredDNAColour: Segment[] = extractSegments(drnaPredDNA, 1, COLORS.drnaPred, COLORS.drnaPredSegmentType);

// CONSTRUCT LINES & COLORED SCORE DATA
const disoRDPbindDNAScoreData = lineColorSegments(
    extractLines(disoRDPbindDNAScore, COLORS.disoRDPbindType),
    extractScoreSegments(disoRDPbindDNAScore, 0, COLORS.disoRDPbind, COLORS.disoRDPbindType)
);

const drnaPredDNAScoreData = lineColorSegments(
    extractLines(drnaPredDNAScore, COLORS.drnaPredType),
    extractScoreSegments(drnaPredDNAScore, 0, COLORS.drnaPred, COLORS.drnaPredType)
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

