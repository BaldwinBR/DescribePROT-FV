import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("RNA_Panel");

const sequence = panelData.sequence;
const disoRDPbindRNA = panelData.disoRDPbindRNA
const drnaPredRNA = panelData.drnaPredRNA
const disoRDPbindRNAScore = panelData.disoRDPbindRNAScore
const drnaPredRNAScore = panelData.drnaPredRNAScore

// SET COLORS FOR DATA
const COLORS = {
    disoRDPbind: "#fcc006", disoRDPbindSegmentType: "DisoRDPbind RNA Binding",
    disoRDPbindType: "DisoRDPbind RNA Score",
    drnaPred: "#fdff38", drnaPredSegmentType: "DRNApred RNA Binding",
    drnaPredType: "DRNApred RNA Score"
};

// SEGMENTS
const disoRDPbindRNAColour: Segment[] = extractSegments(disoRDPbindRNA, 1, COLORS.disoRDPbind, COLORS.disoRDPbindSegmentType);
const drnaPredRNAColour: Segment[] = extractSegments(drnaPredRNA, 1, COLORS.drnaPred, COLORS.drnaPredSegmentType);

// LINES & COLORED SCORE DATA
const disoRDPbindRNAScoreData = lineColorSegments(
    extractLines(disoRDPbindRNAScore, COLORS.disoRDPbindType),
    extractScoreSegments(disoRDPbindRNAScore, 0, COLORS.disoRDPbind, COLORS.disoRDPbindType)
);

const drnaPredRNAScoreData = lineColorSegments(
    extractLines(drnaPredRNAScore, COLORS.drnaPredType),
    extractScoreSegments(drnaPredRNAScore, 0, COLORS.drnaPred, COLORS.drnaPredType)
);

// EXPORT DATA
export const RNAPanel = [
  {
    type: 'rect',
    id: 'DisoRDPbindRNA',
    label: 'DisoRDPbind-RNA',
    data: disoRDPbindRNAColour,
    color: '#000000',
    sidebar: [
      createSidebarButton('DisoRDPbindRNA', 'DisoRDPbind RNA Binding', COLORS.disoRDPbind, 'box', 0)
    ]
  },
  {
    type: 'rect',
    id: 'drnaPredRNA',
    label: 'DRNApred-RNA',
    data: drnaPredRNAColour,
    color: '#000000',
    sidebar: [
      createSidebarButton('drnaPredRNA', 'DRNApred RNA Binding', COLORS.drnaPred, 'box', 0)
    ]
  },
  {
    type: 'curve',
    id: 'RNA_SCORES',
    label: ' ',
    color: [COLORS.disoRDPbind, COLORS.drnaPred],
    data: [disoRDPbindRNAScoreData, drnaPredRNAScoreData],
    sidebar: [
      createSidebarButton('RNA_SCORES', 'DisoRDPbind RNA Score', COLORS.disoRDPbind, 'line', 0),
      createSidebarButton('RNA_SCORES', 'DRNApred RNA Score', COLORS.drnaPred, 'line', 1)
    ]
  }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, RNAPanel);
};

