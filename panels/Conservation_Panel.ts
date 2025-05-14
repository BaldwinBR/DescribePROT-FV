import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment, mmseqRescaleScores} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

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
    conv_0: "#f0f3f5", conv0Type: "Conservation Level 1",
    conv_1: "#f0f3f5", conv1Type: "Conservation Level 2",
    conv_2: "#d1dae0", conv2Type: "Conservation Level 3",
    conv_3: "#b3c2cb", conv3Type: "Conservation Level 4",
    conv_4: "#95aab7", conv4Type: "Conservation Level 5",
    conv_5: "#7691a2", conv5Type: "Conservation Level 6",
    conv_6: "#5d7889", conv6Type: "Conservation Level 7",
    conv_7: "#485d6a", conv7Type: "Conservation Level 8",
    conv_8: "#34434c", conv8Type: "Conservation Level 9",
    conv_9: "#1f282e", conv9Type: "Conservation Level 10",
    conv_score: "#607c8e", convScoreType: "Conservation Score"
};

// PROCESS CONSERVATION SEGMENTS
const conservationSegments: Segment[] = [
    ...extractSegments(mmseqBinary, 0, COLORS.conv_0, COLORS.conv0Type),
    ...extractSegments(mmseqBinary, 1, COLORS.conv_1, COLORS.conv1Type),
    ...extractSegments(mmseqBinary, 2, COLORS.conv_2, COLORS.conv2Type),
    ...extractSegments(mmseqBinary, 3, COLORS.conv_3, COLORS.conv3Type),
    ...extractSegments(mmseqBinary, 4, COLORS.conv_4, COLORS.conv4Type),
    ...extractSegments(mmseqBinary, 5, COLORS.conv_5, COLORS.conv5Type),
    ...extractSegments(mmseqBinary, 6, COLORS.conv_6, COLORS.conv6Type),
    ...extractSegments(mmseqBinary, 7, COLORS.conv_7, COLORS.conv7Type),
    ...extractSegments(mmseqBinary, 8, COLORS.conv_8, COLORS.conv8Type),
    ...extractSegments(mmseqBinary, 9, COLORS.conv_9, COLORS.conv9Type)
];

// RESCALE THEN EXTRACT MMSEQ SCORE LINE DATA
const mmseqScoreRescaled = mmseqRescaleScores(mmseqScore);
const mmseqScoreData = extractLines(mmseqScoreRescaled, COLORS.convScoreType);

// EXPORT DATA
export const ConservationPanel = [
  {
    type: 'rect',
    id: 'Conservation_Levels',
    label: 'Conservation',
    color: '#000000',
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
    color: COLORS.conv_score,
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

