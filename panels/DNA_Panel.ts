import { initializeViewer, createSidebarButton, extractSegmentsNEW, extractLinesNEW} from "../utils/utils";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
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
const disoRDPbindDNAColour: FeatureData[] = extractSegmentsNEW(disoRDPbindDNA, 1, COLORS.disoRDPbind, "DisoRDPbind DNA Binding");
const drnaPredDNAColour: FeatureData[] = extractSegmentsNEW(drnaPredDNA, 1, COLORS.drnaPred, "DRNApred DNA Binding");

// CONSTRUCT LINES & COLORED SCORE DATA
const disoRDPbindDNAScoreData = extractLinesNEW(disoRDPbindDNAScore, COLORS.disoRDPbind, "DisoRDPbind DNA Score")
const drnaPredDNAScoreData =  extractLinesNEW(drnaPredDNAScore, COLORS.drnaPred, "DRNApred DNA Score")


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

