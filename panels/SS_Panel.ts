import { initializeViewer, createSidebarButton, extractSegments, extractLines, Segment, psipredRescaleScores, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("SS_Panel");

const sequence = panelData.sequence;
const secssBinary = panelData.secssBinary;
const psiPredBinary = panelData.psiPredBinary
const coilScore = panelData.coilScore
let strandScore = panelData.strandScore
let helixScore =  panelData.helixScore

// Checking data format for pddt case
if (Number.isNaN(helixScore[0])){
    helixScore = null;
    strandScore = null;
}

// SET COLORS FOR DATA
const COLORS = {
    helix: "#cf6275", helixType: "Helix",
    strand: "#fffd01", strandType: "Strand",
    coil: "#25a36f", coilType: "Coil",
    unavailable: "#c0c0c0", unavailableType: "Unavailable",
    type: ""
};

// NOTE: Changing the order of this breaks the concact
const  secStructScores  = [coilScore, strandScore, helixScore];
let psiPredScore: number[] = [];

// PDDT EXCEPTION
if (helixScore !=  null){
    psiPredScore = secStructScores .reduce(function(final, current) {
        for (var i = 0; i < final.length; ++i) {
            if (current[i] > final[i]) {
            final[i] = current[i];
            }
        }
        return final;
        });
}else{
    psiPredScore = [...coilScore];
}

// PROCESS SECSS BINARY SEGMENTS
const secssSegments: Segment[] = [
    ...extractSegments(secssBinary, 1, COLORS.helix, COLORS.helixType),
    ...extractSegments(secssBinary, 2, COLORS.strand, COLORS.strandType),
    ...extractSegments(secssBinary, 3, COLORS.coil, COLORS.coilType),
    ...extractSegments(secssBinary, 0, COLORS.unavailable, COLORS.unavailableType)
];

// PROCESS PSIPRED BINARY SEGMENTS
const psiPredSegments: Segment[] = [
    ...extractSegments(psiPredBinary, 0, COLORS.helix, COLORS.helixType),
    ...extractSegments(psiPredBinary, 1, COLORS.strand, COLORS.strandType),
    ...extractSegments(psiPredBinary, 2, COLORS.coil, COLORS.coilType),
    //For unknown assignment from DSSP on AF-derived structures
    ...extractSegments(psiPredBinary, 3, COLORS.unavailable, COLORS.unavailableType)
];

//TODO: Is SS_Code value X needed from original?

// RESCALE SECSTRUCT SCORES
const psiPredScoreRescaled = psipredRescaleScores(psiPredScore);
const psiPredScoreData =  extractLines(psiPredScoreRescaled, COLORS.type);

const psiPredScoreDataColored = lineColorSegments(psiPredScoreData, psiPredSegments);

// EXPORT DATA
export const SSPanel = [
    {
        type: 'rect',
        id: 'Native_Sec_Struc',
        label: 'Native Sec.Struc',
        color: '#000000',
        flag: 1,
        data: secssSegments,
        sidebar: [
            createSidebarButton('Native_Sec_Struc', 'Coil', COLORS.coil, 'box', 0),
            createSidebarButton('Native_Sec_Struc', 'Helix', COLORS.helix, 'box', 1),
            createSidebarButton('Native_Sec_Struc', 'Strand', COLORS.strand, 'box', 2)
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Sec_Struc',
        label: 'Putative Sec.Struc',
        color: '#000000',
        flag: 1,
        data: psiPredSegments
    },
    {
        type: 'curve',
        id: 'SECONDARY_STRUC_SCORES',
        label: ' ',
        flag: 1,
        data: psiPredScoreDataColored,
        sidebar: [
            createSidebarButton('SECONDARY_STRUC_SCORES', 'Secondary Struc.Score', COLORS.coil, 'line', 0)
        ]
    }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, SSPanel);
};

