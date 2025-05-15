import { initializeViewer, createSidebarButton, extractSegmentsNEW, extractLinesNEW} from "../utils/utils";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Protein_Panel");

const sequence = panelData.sequence;
const disoRDPbindBinary = panelData.disoRDPbindBinary
const scriberBinary = panelData.scriberBinary
const morfChibiBinary = panelData.morfChibiBinary
const disoRDPbindScore = panelData.disoRDPbindScore
const scriberScore = panelData.scriberScore
const morfChibiScore = panelData.morfChibiScore

// SET COLORS FOR DATA
const COLORS = {
    disoRDPbind: "#3d7afd",
    morfChibi: "#01889f",
    scriber: "#3b5b92"
};

// PROCESS BINARY SEGMENTS
const disoRDPbindSegments: FeatureData[] = extractSegmentsNEW(disoRDPbindBinary, 1, COLORS.disoRDPbind, "DisoRDPbind Protein Binding");
const scriberSegments: FeatureData[] = extractSegmentsNEW(scriberBinary, 1, COLORS.scriber, "SCRIBER Protein Binding");
const morfChibiSegments: FeatureData[] = extractSegmentsNEW(morfChibiBinary, 1, COLORS.morfChibi, "MoRFchibi Protein Binding");

// PROCESS SCORED SEGMENTS
const disoRDPbindScoreData = extractLinesNEW(disoRDPbindScore, COLORS.disoRDPbind, "DisoRDPbind Score")
const scriberScoreData = extractLinesNEW(scriberScore, COLORS.scriber, "SCRIBER Score")
const morfChibiScoreData = extractLinesNEW(morfChibiScore, COLORS.morfChibi, "MoRFchibi Score")


export const ProteinPanel = [
  {
    type: 'rect',
    id: 'DisoRDPbind_Binding',
    label: 'DisoRDPbind-Protein',
    data: disoRDPbindSegments,
    color: '#000000',
    sidebar: [
      createSidebarButton('DisoRDPbind_Binding', 'DisoRDPbind Protein Binding', COLORS.disoRDPbind, 'box', 0)
    ]
  },
  {
    type: 'rect',
    id: 'Scriber_Binding',
    label: 'SCRIBER',
    data: scriberSegments,
    color: '#000000',
    sidebar: [
      createSidebarButton('Scriber_Binding', 'SCRIBER Protein Binding', COLORS.scriber, 'box', 0)
    ]
  },
  {
    type: 'rect',
    id: 'MoRFchibi_Binding',
    label: 'MoRFchibi',
    data: morfChibiSegments,
    color: '#000000',
    sidebar: [
      createSidebarButton('MoRFchibi_Binding', 'MoRFchibi Protein Binding', COLORS.morfChibi, 'box', 0)
    ]
  },
  {
    type: 'curve',
    id: 'PROTEIN_SCORES',
    label: ' ',
    data: [disoRDPbindScoreData, scriberScoreData, morfChibiScoreData],
    sidebar: [
      createSidebarButton('PROTEIN_SCORES', 'DisoRDPbind Score', COLORS.disoRDPbind, 'line', 0),
      createSidebarButton('PROTEIN_SCORES', 'Scriber Score', COLORS.scriber, 'line', 1),
      createSidebarButton('PROTEIN_SCORES', 'MoRFchibi Score', COLORS.morfChibi, 'line', 2)
    ]
  }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, ProteinPanel);
};

