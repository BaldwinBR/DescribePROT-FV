import { initializeViewer, createSidebarButton, extractSegments} from "../utils/utils";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';
import { PanelDataService } from '../utils/PanelDataService'; 

// ---------------------------- SEC.STRUCT SPECIFIC HELPERS ----------------------------

/**
 * Converts a score array into an array of FeatureData points,
 * then applies color and type information to each point based on given segments.
 *
 * @param scoreArray - Array of numerical scores representing Y-values.
 * @param title - A label/title to apply to each FeatureData point.
 * @param segments - Array of segments defining color and type ranges along the X-axis.
 * @returns Array of FeatureData points with color and type assigned according to segments.
 */
function extractAndColorLines(scoreArray: number[], title: string, segments: FeatureData[]): FeatureData[] {
    
    // Map the score array to FeatureData points with default color and type
    const data: FeatureData[] = scoreArray.map((value, index) => ({x: index + 1, y: value,color: "", title, type: undefined}));

    // Sort segments by their x for sequential processing
    segments.sort((a, b) => a.x - b.x);

    let inSegment = false;
    let colorValue = "";
    let typeValue: string | undefined = undefined;

    // Loop through each data point and assign color/type based on segments
    for (let i = 0; i < data.length; i++) {
        for (let segIndex = 0; segIndex < segments.length; segIndex++) {
        const seg = segments[segIndex];

        // If data point matches the start of a segment, enter segment and set color/type
        if (data[i].x === seg.x) {
            inSegment = true;
            colorValue = seg.color;
            typeValue = seg.type;
        }

        // If currently inside a segment, apply the segment's color and type
        if (inSegment) {
            data[i].color = colorValue;
            data[i].type = typeValue;
        }

        // If data point matches the end of a segment, exit the segment
        if (data[i].x === seg.y) {
            inSegment = false;
        }
        }
    }

    return data;
}

// **Rescaling for psi pred score**
function psipredRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => 0.33 + ((value - min) / (max - min)) * (1 - 0.33));
}

// ---------------------------- LOGIC STARTS HERE ----------------------------

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("SS_Panel");

const sequence = panelData.sequence;
const secssBinary = panelData.secssBinary;
const psiPredBinary = panelData.psiPredBinary
let strandScore = panelData.strandScore
let helixScore =  panelData.helixScore
const coilScore = panelData.coilScore //PLddt Scores in  case of AF results

// Checking data format for plddt case
if (Number.isNaN(helixScore[0])){
    helixScore = null;
    strandScore = null;
}

// Flag indicating whether pLDDT data is available  
const isPLDDT = helixScore == null;

// SET COLORS FOR DATA
const COLORS = {
    helix: "#cf6275",
    strand: "#fffd01",
    coil: "#25a36f",
    plddt: "#202124",
    unavailable: "#c0c0c0"
};

// NOTE: Changing the order of this breaks the concact
const  secStructScores  = [coilScore, strandScore, helixScore];
let psiPredScore: number[] = [];

// PDDT EXCEPTION
if (!isPLDDT){
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

// RESCALE SECSTRUCT SCORES
const psiPredScoreRescaled = psipredRescaleScores(psiPredScore);

// PROCESS SECSS BINARY SEGMENTS
const secssSegments: FeatureData[] = [
    ...extractSegments(secssBinary, 1, COLORS.helix, "Helix", "Helix"),
    ...extractSegments(secssBinary, 2, COLORS.strand, "Strand", "Strand"),
    ...extractSegments(secssBinary, 3, COLORS.coil, "Coil", "Coil"),
    ...extractSegments(secssBinary, 0, COLORS.unavailable, "Unavaliable", "Unavaliable")
];

// PROCESS PSIPRED BINARY SEGMENTS
const psiPredSegments: FeatureData[] = [
    ...extractSegments(psiPredBinary, 0, COLORS.helix, "Helix", "Helix"),
    ...extractSegments(psiPredBinary, 1, COLORS.strand, "Strand", "Strand"),
    ...extractSegments(psiPredBinary, 2, COLORS.coil, "Coil", "Coil"),
    //For unknown assignment from DSSP on AF-derived structures
    ...extractSegments(psiPredBinary, 3, COLORS.unavailable, "Unavaliable", "Unavaliable")
];

//PROCESS SCORE DATA
var coloredScoreData: FeatureData[]
//PLddt case needs different line color for all the segments
if (isPLDDT){
    const PsiPredBinaryPLDDT: FeatureData[] =  [
        ...extractSegments(psiPredBinary, 0, COLORS.plddt, "Helix", "Helix"),
        ...extractSegments(psiPredBinary, 1, COLORS.plddt, "Strand", "Strand"),
        ...extractSegments(psiPredBinary, 2, COLORS.plddt, "Coil", "Coil"),
        //For unknown assignment from DSSP on AF-derived structures
        ...extractSegments(psiPredBinary, 3, COLORS.plddt, "Unavaliable", "X")
    ];

    coloredScoreData = extractAndColorLines(psiPredScoreRescaled, "pLDDT Score From AlphaFold", PsiPredBinaryPLDDT);
    
}else{
    coloredScoreData = extractAndColorLines(psiPredScoreRescaled, "Secondary Struc.Score", psiPredSegments);
}

const scoresSidebarButton = [
    createSidebarButton(
        'SECONDARY_STRUC_SCORES',
        isPLDDT ? 'pLDDT Score From AlphaFold' : 'Secondary Struc.Score',
        isPLDDT ? COLORS.plddt : COLORS.coil,
        'line',
        0
    )
];

// EXPORT DATA
export const SSPanel = [
    {
        type: 'rect',
        id: 'Native_Sec_Struc',
        label: 'Native Sec.Struc',
        color: '#000000',
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
        data: psiPredSegments
    },
    {
        type: 'curve',
        id: 'SECONDARY_STRUC_SCORES',
        label: ' ',
        data: coloredScoreData,
        sidebar: scoresSidebarButton
    }
];


// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    initializeViewer(sequence, SSPanel);
};

