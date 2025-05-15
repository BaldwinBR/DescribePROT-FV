import { initializeViewer, createSidebarButton, extractSegmentsNEW, extractLinesNEW} from "../utils/utils";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
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
    disoRDPbind: "#fcc006", 
    drnaPred: "#fdff38"   
};

// SEGMENTS
const disoRDPbindRNAColour: FeatureData[] = extractSegmentsNEW(disoRDPbindRNA, 1, COLORS.disoRDPbind, "DisoRDPbind RNA Binding");
const drnaPredRNAColour: FeatureData[] = extractSegmentsNEW(drnaPredRNA, 1, COLORS.drnaPred, "DRNApred RNA Binding");

// LINES & COLORED SCORE DATA
const disoRDPbindRNAScoreData = extractLinesNEW(disoRDPbindRNAScore, COLORS.disoRDPbind, "DisoRDPbind RNA Score")
const drnaPredRNAScoreData = extractLinesNEW(drnaPredRNAScore, COLORS.drnaPred, "DRNApred RNA Score")

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

