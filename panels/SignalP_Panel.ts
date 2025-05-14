import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("SignalP_Panel");

const sequence = panelData.sequence;
const signalPeptideBinary = panelData.signalPeptideBinary
const signalPeptideScore = panelData.signalPeptideScore

// SET COLORS FOR DATA
const COLORS = {
    signalPeptide: "#964e02", signalPeptideSegmentType: "Signal Peptides",
    signalPeptideType: "Signal Peptides Score"
};

// SEGMENTS
const signalPeptideSegments: Segment[] = extractSegments(signalPeptideBinary, 1, COLORS.signalPeptide, COLORS.signalPeptideSegmentType);

// LINE DATA
const signalPeptideScoreData = extractLines(signalPeptideScore, COLORS.signalPeptideType);

// EXPORT DATA
export const SignalPPanel = [
  {
    type: 'rect',
    id: 'Signal_Peptide',
    label: 'Signal Peptides',
    data: signalPeptideSegments,
    color: "#000000",
    sidebar: [
      createSidebarButton('Signal_Peptide', 'Signal Peptides', COLORS.signalPeptide, 'box', 0)
    ]
  },
  {
    type: 'curve',
    id: 'SIGNAL_PEPTIDE_SCORES',
    label: ' ',
    color: COLORS.signalPeptide,
    data: signalPeptideScoreData,
    sidebar: [
      createSidebarButton('SIGNAL_PEPTIDE_SCORES', 'Signal Peptides Score', COLORS.signalPeptide, 'line', 0)
    ]
  }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, SignalPPanel);
};

