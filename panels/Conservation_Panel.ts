import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
import { initializeViewer, createSidebarButton, extractLines, extractSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// ---------------------------- CONSERVATION SPECIFIC HELPERS ----------------------------

// **Rescaling for mmseq score**
function mmseqRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => (value - min) / (max - min));
}

// ---------------------------- LOGIC STARTS HERE ----------------------------

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Conservation_Panel");

const sequence = panelData.sequence;
const mmseqBinary = panelData.mmseqBinary
const mmseqScore = panelData.mmseqScore

// SET COLORS FOR CONSERVATION LEVELS
const COLORS = {
    conv_0: "#f0f3f5",
    conv_1: "#f0f3f5",
    conv_2: "#d1dae0",
    conv_3: "#b3c2cb",
    conv_4: "#95aab7",
    conv_5: "#7691a2",
    conv_6: "#5d7889",
    conv_7: "#485d6a",
    conv_8: "#34434c",
    conv_9: "#1f282e",
    conv_score: "#607c8e"
};

// PROCESS CONSERVATION SEGMENTS
const conservationSegments: FeatureData[] = [
    ...extractSegments(mmseqBinary, 0, COLORS.conv_0, "Conservation Level 1"),
    ...extractSegments(mmseqBinary, 1, COLORS.conv_1, "Conservation Level 2"),
    ...extractSegments(mmseqBinary, 2, COLORS.conv_2, "Conservation Level 3"),
    ...extractSegments(mmseqBinary, 3, COLORS.conv_3, "Conservation Level 4"),
    ...extractSegments(mmseqBinary, 4, COLORS.conv_4, "Conservation Level 5"),
    ...extractSegments(mmseqBinary, 5, COLORS.conv_5, "Conservation Level 6"),
    ...extractSegments(mmseqBinary, 6, COLORS.conv_6, "Conservation Level 7"),
    ...extractSegments(mmseqBinary, 7, COLORS.conv_7, "Conservation Level 8"),
    ...extractSegments(mmseqBinary, 8, COLORS.conv_8, "Conservation Level 9"),
    ...extractSegments(mmseqBinary, 9, COLORS.conv_9, "Conservation Level 10")
];

// RESCALE THEN EXTRACT MMSEQ SCORE LINE DATA
const mmseqScoreRescaled = mmseqRescaleScores(mmseqScore);
const mmseqScoreData = extractLines(mmseqScoreRescaled, COLORS.conv_score, "Conservation Score");

// EXPORT DATA
export const ConservationPanel = [
  {
    type: 'rect',
    id: 'Conservation_Levels',
    label: 'Conservation',
    color: '#000000',
    flag: 4,
    data: conservationSegments,
    sidebar: [
      createSidebarButton('Conservation_Levels', 'Conservation Level 1', COLORS.conv_0, 'box', 0),
      createSidebarButton('Conservation_Levels', 'Conservation Level 2', COLORS.conv_1, 'box', 1),
      createSidebarButton('Conservation_Levels', 'Conservation Level 3', COLORS.conv_2, 'box', 2),
      createSidebarButton('Conservation_Levels', 'Conservation Level 4', COLORS.conv_3, 'box', 3),
      createSidebarButton('Conservation_Levels', 'Conservation Level 5', COLORS.conv_4, 'box', 4),
      createSidebarButton('Conservation_Levels', 'Conservation Level 6', COLORS.conv_5, 'box', 5),
      createSidebarButton('Conservation_Levels', 'Conservation Level 7', COLORS.conv_6, 'box', 6),
      createSidebarButton('Conservation_Levels', 'Conservation Level 8', COLORS.conv_7, 'box', 7),
      createSidebarButton('Conservation_Levels', 'Conservation Level 9', COLORS.conv_8, 'box', 8),
      createSidebarButton('Conservation_Levels', 'Conservation Level 10', COLORS.conv_9, 'box', 9)
    ]
  },
  {
    type: 'curve',
    id: 'CONSERVATION_SCORES',
    label: ' ',
    data: mmseqScoreData,
    sidebar: [
      createSidebarButton('CONSERVATION_SCORES', 'Conservation Score', COLORS.conv_score, 'line', 0)
    ]
  }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence,ConservationPanel);  
};

