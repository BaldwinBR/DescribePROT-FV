import { FeatureViewer } from "./FeatureViewerTypeScript/src/feature-viewer";

import './feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');

// **Segment Interface**
interface Segment {
    x: number;
    y: number;
    color: string;
    stroke: string;
    opacity?: number;
}

// **Disorder Panel Data**
const sequence: string = lines[1]?.trim() || "";
const rawDisorderBinary: string = lines[30]?.trim() || "";
const rawVSLBinary: string = lines[2]?.trim() || "";
const rawVSLScore: string = lines[3]?.trim() || "";

const disorderBinary: number[] = rawDisorderBinary ? Array.from(rawDisorderBinary, Number) : [];
const vslBinary: number[] = rawVSLBinary ? Array.from(rawVSLBinary, Number) : [];
const vslScore: number[] = rawVSLScore.trim().split(',').map(val => parseFloat(val));

// **ASA Panel Data**
const rawRSABinary: string = lines[32]?.trim() || "";
const rawRSAScore: string = lines[33]?.trim() || "";
const rawASABinary: string = lines[14]?.trim() || "";
const rawASAScore: string = lines[15]?.trim() || "";

const rsaBinary: number[] = rawRSABinary ? Array.from(rawRSABinary, Number) : [];
const rsaScore: number[] = rawRSAScore.trim().split(',').map(val => parseFloat(val));
const asaBinary: number[] = rawASABinary ? Array.from(rawASABinary, Number) : [];
const asaScore: number[] = rawASAScore.trim().split(',').map(val => parseFloat(val));

//--------------------------------------------------------------------------------------------------------

// **Sec.Struc Panel Data**

const rawSECSSBinary: string = lines[31]?.trim() || "";
const SECSSBinary: number[] = rawDisorderBinary ? Array.from(rawSECSSBinary, Number) : [];

const rawPsiPredBinary: string = lines[4]?.trim() || "";
const PsiPredBinary: number[] = rawDisorderBinary ? Array.from(rawPsiPredBinary, Number) : [];


if (lines[5] != "NULL"){
    var rawHelixScore: string = lines[5]?.trim() || "";
    var rawStrandScore: string = lines[6]?.trim() || "";

    var HelixScore: number[] = rawHelixScore.trim().split(',').map(val => parseFloat(val));
    var StrandScore: number[] = rawStrandScore.trim().split(',').map(val => parseFloat(val));  

}else{
    //TODO: Check this functionality
    var HelixScore: number[] = null;
    var StrandScore: number[] = null;
}

//Plddt Scores in  case of AF results
var rawCoilScore: string = lines[7]?.trim() || "";
var CoilScore: number[] = rawCoilScore.trim().split(',').map(val => parseFloat(val));


let PsiPredScore  = [];

//TODO: THIS CAN BE FUNCKY; LOOK INTO IT 
const  SecStructScoresConcat = [CoilScore, StrandScore, HelixScore];
//const  SecStructScoresConcat = [HelixScore, StrandScore, CoilScore];

if (HelixScore !=  null){
    PsiPredScore = SecStructScoresConcat.reduce(function(final, current) {
        for (var i = 0; i < final.length; ++i) {
            if (current[i] > final[i]) {
            final[i] = current[i];
            }
        }
        return final;
        });
}else{
    //TODO: Determine if this is best way to clone array for use case
    for (var b = 0; b < CoilScore.length; b++){
        PsiPredScore[b] = CoilScore[b];
    }
}

//--------------------------------------------------------------------------------------------------------

// **Conservation Panel Data**
const rawmmseqBinary: string = lines[8]?.trim() || "";
const rawmmseqScore: string = lines[9]?.trim() || "";

const mmseqBinary: number[] = rawmmseqBinary ? Array.from(rawmmseqBinary, Number) : [];
const mmseqScore: number[] = rawmmseqScore.trim().split(',').map(val => parseFloat(val));


// **Protein Binding Data**
const rawDisoRDPbindBinary: string = lines[24]?.trim() || "";    
const rawScriberBinary: string = lines[26]?.trim() || "";  
const rawMorfChibiBinary: string = lines[28]?.trim() || "";  

const scriberBinary: number[] = rawScriberBinary ? Array.from(rawScriberBinary, Number) : [];
const disoRDPbindBinary: number[] = rawDisoRDPbindBinary ? Array.from(rawDisoRDPbindBinary, Number) : [];
const morfChibiBinary: number[] = rawMorfChibiBinary ? Array.from(rawMorfChibiBinary, Number) : [];

const disoRDPbindScore: number[] = lines[25].trim().split(',').map(val => parseFloat(val));
const scriberScore: number[] = lines[27].trim().split(',').map(val => parseFloat(val));
const morfChibiScore: number[] = lines[29].trim().split(',').map(val => parseFloat(val));


// **Linker Data**
const rawLinkerBinary: string = lines[12]?.trim() || "";
const rawLinkerScore: string = lines[13]?.trim() || "";

const linkerBinary: number[] = rawLinkerBinary ? Array.from(rawLinkerBinary, Number) : [];
const linkerScore: number[] = rawLinkerScore.split(',').map(val => parseFloat(val) || 0);

/**
 * Extract contiguous segments from binary arrays
 * @param binaryArray - The array containing binary values (0,1,2)
 * @param targetValue - The value to extract as a segment
 * @param color - Segment fill color
 * @returns Array of Segment objects
 */
function extractSegments(binaryArray: number[], targetValue: number, color: string): Segment[] {
    const segments: Segment[] = [];
    let inSegment = false;
    let start = 0;

    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] === targetValue) {
            if (!inSegment) {
                start = i;
                inSegment = true;
            }
        } else if (inSegment) {
            segments.push({ x: start + 1, y: i, color, stroke: "black" });
            inSegment = false;
        }
    }

    if (inSegment) {
        segments.push({ x: start + 1, y: binaryArray.length, color, stroke: "black" });
    }

    return segments;
}


/**
 * Converts an array of numerical scores into an array of coordinate points `{x, y}` 
 * for line plotting in FeatureViewer.
 *
 * @param {number[]} scoreArray - An array of numerical scores representing Y-values.
 * @returns {{x: number; y: number}[]} An array of objects, where each object contains an X (position) and Y (score) value.
 */
function extractLines(scoreArray: number[]): { x: number; y: number }[] {
    return scoreArray.map((value, index) => ({
        x: index + 1,
        y: value
    }));
}


// **Rescaling for psi pred score**
function psipredRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => 0.33 + ((value - min) / (max - min)) * (1 - 0.33));
}

// **Rescaling for mmseq score**
function mmseqRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => (value - min) / (max - min));
}

<<<<<<< HEAD




=======
>>>>>>> 95d98afd109c902f367b6b013d52ea99bfe0247c
// ** CALCULATING DATA **

// **Disorder panel**
const nativeDisorderColor: Segment[] = extractSegments(disorderBinary, 1, "#2da02c"); // assigned color for data exists
const nativeDisorderGrey: Segment[] = extractSegments(disorderBinary, 2, "grey"); // Grey overlay for not available data

// This is to plot the available and unavailable data at the same line
const mergedNativeDisorder: Segment[] = [
    ...nativeDisorderColor.map(s => ({ ...s, color: "#2da02c"})),
    ...nativeDisorderGrey.map(s => ({ ...s, color: "grey"}))
];

const putativeDisorder: Segment[] = extractSegments(vslBinary, 1, "#76fd63");


// **RSA panel**
const nativeRSABinaryColor: Segment[] = extractSegments(rsaBinary, 1, "#fc0080"); // assigned color for available RSA data
const nativeRSABinaryGrey: Segment[] = extractSegments(rsaBinary, 2, "grey"); // Grey for not available RSA data

// This is to plot the available and unavailable data at the same line
const mergedRSABinary: Segment[] = [
    ...nativeRSABinaryColor.map(s => ({ ...s, color: "#fc0080" })),
    ...nativeRSABinaryGrey.map(s => ({ ...s, color: "grey" }))
];

// Extract line data
const vslScoreData = extractLines(vslScore);
const rsaScoreData = extractLines(rsaScore);
const asaScoreData = extractLines(asaScore);

// Extract ASA and RSA Binary Data
const buriedResiduesResults: Segment[] = extractSegments(asaBinary, 1, "#ffd2df");

// **Conservation Panel**
const conv_0_residues: Segment[] = extractSegments(mmseqBinary, 0, "#f0f3f5");
const conv_1_residues: Segment[] = extractSegments(mmseqBinary, 1, "#f0f3f5");
const conv_2_residues: Segment[] = extractSegments(mmseqBinary, 2, "#d1dae0");
const conv_3_residues: Segment[] = extractSegments(mmseqBinary, 3, "#b3c2cb");
const conv_4_residues: Segment[] = extractSegments(mmseqBinary, 4, "#95aab7");
const conv_5_residues: Segment[] = extractSegments(mmseqBinary, 5, "#7691a2");
const conv_6_residues: Segment[] = extractSegments(mmseqBinary, 6, "#5d7889");
const conv_7_residues: Segment[] = extractSegments(mmseqBinary, 7, "#485d6a");
const conv_8_residues: Segment[] = extractSegments(mmseqBinary, 8, "#34434c");
const conv_9_residues: Segment[] = extractSegments(mmseqBinary, 9, "#1f282e");

// Plotting all conservation levels on the same line
const mergedConservationLevels: Segment[] = [
    ...conv_0_residues.map(s => ({ ...s, color: "#f0f3f5"})),
    ...conv_1_residues.map(s => ({ ...s, color: "#f0f3f5"})),
    ...conv_2_residues.map(s => ({ ...s, color: "#d1dae0"})),
    ...conv_3_residues.map(s => ({ ...s, color: "#b3c2cb"})),
    ...conv_4_residues.map(s => ({ ...s, color: "#95aab7"})),
    ...conv_5_residues.map(s => ({ ...s, color: "#7691a2"})),
    ...conv_6_residues.map(s => ({ ...s, color: "#5d7889"})),
    ...conv_7_residues.map(s => ({ ...s, color: "#485d6a"})),
    ...conv_8_residues.map(s => ({ ...s, color: "#34434c"})),
    ...conv_9_residues.map(s => ({ ...s, color: "#1f282e"})),
];

// Rescale then extract mmseq score line data
const mmseqScoreRescaled = mmseqRescaleScores(mmseqScore);
const mmseqScoreData = extractLines(mmseqScoreRescaled);

<<<<<<< HEAD
//--------------------------------------------------------------------------------------------

=======
// **Protein Panel**
const disoRDPbindSegments: Segment[] = extractSegments(disoRDPbindBinary, 1, "#3d7afd");
const morfChibiSegments: Segment[] = extractSegments(morfChibiBinary, 1, "#01889f");
const scriberSegments: Segment[] = extractSegments(scriberBinary, 1, "#3b5b92");

const disoRDPbindScoreData = extractLines(disoRDPbindScore);
const scriberScoreData = extractLines(scriberScore);
const morfChibiScoreData = extractLines(morfChibiScore);

// **Linker Panel**
const linkerSegments: Segment[] = extractSegments(linkerBinary, 1, "#ff9408");
const linkerScoreData = extractLines(linkerScore);

>>>>>>> 95d98afd109c902f367b6b013d52ea99bfe0247c
// SECSSBinary Data to Segment
const SECSSBinaryHelix: Segment[] = extractSegments(SECSSBinary, 1, "#cf6275");
const SECSSBinaryStrand: Segment[] = extractSegments(SECSSBinary, 2, "#fffd01");
const SECSSBinaryCoil: Segment[] = extractSegments(SECSSBinary, 3, "#25a36f");
const SECSSBinaryUnavailable: Segment[] = extractSegments(SECSSBinary, 0, "#c0c0c0"); 

const mergedSECSSBinary: Segment[] = [
    ...SECSSBinaryHelix.map(s => ({ ...s, color: "#cf6275"})),
    ...SECSSBinaryStrand.map(s => ({ ...s, color: "#fffd01"})),
    ...SECSSBinaryCoil.map(s => ({ ...s, color: "#25a36f"})),
    ...SECSSBinaryUnavailable.map(s => ({ ...s, color: "#c0c0c0"})),
];

//Psi Binary Data to Segment
const PsiPrepBinaryHelix: Segment[] = extractSegments(PsiPredBinary, 0, "#cf6275");
const PsiPrepBinaryStrand: Segment[] = extractSegments(PsiPredBinary, 1, "#fffd01");
const PsiPrepBinaryCoil: Segment[] = extractSegments(PsiPredBinary, 2, "#25a36f");
//For unknown assignment from DSSP on AF-derived structures
const PsiPrepBinaryUnavailable: Segment[] = extractSegments(PsiPredBinary, 3, "#c0c0c0"); 

//TODO: Is SS_Code value X needed from original?

const mergedPsiPrepBinary: Segment[] = [
    ...PsiPrepBinaryHelix.map(s => ({ ...s, color: "#cf6275"})),
    ...PsiPrepBinaryStrand.map(s => ({ ...s, color: "#fffd01"})),
    ...PsiPrepBinaryCoil.map(s => ({ ...s, color: "#25a36f"})),
    ...PsiPrepBinaryUnavailable.map(s => ({ ...s, color: "#c0c0c0"})),
];

// Rescale SecStruct Scores
//  TODO: Consider round to two digits like Python code
//  Could impact performance to have library round it
const PsiPredScoreRescaled = psipredRescaleScores(PsiPredScore);
const PsiPredScoreData =  extractLines(PsiPredScoreRescaled);

//--------------------------------------------------------------------------------------------

window.onload = () => {
    let panels = new FeatureViewer(sequence, '#feature-viewer',
        {
            toolbar: true,
            toolbarPosition: 'left',
            brushActive: true,
            zoomMax: 5,
            flagColor: 'white',
            flagTrack: 170,
            flagTrackMobile: 150
        },
        [
            // ** DISORDER PANEL **
            {
                type: 'rect',
                id: 'Native_Disorder',
                label: 'Native Disorder',
                data: mergedNativeDisorder,
                color: "black"
            },
            {
                type: 'rect',
                id: 'Putative_Disorder',
                label: 'Putative Disorder',
                data: putativeDisorder,
                color: 'black'
            },
            {
                type: 'curve',
                id: 'Curve1',
                label: 'Predictive Disorder Score',
                color: '#76fd63', 
                height: 3,
                data: vslScoreData
            },
            // ** ASA PANEL **
            {
                type: 'rect',
                id: 'Native_RSA_Binary',
                label: 'Native RSA Binary',
                data: mergedRSABinary,
                color: "black"
            },
            {
                type: 'rect',
                id: 'Putative_Buried_Residue',
                label: 'Putative Buried Residue',
                data: buriedResiduesResults,
                color: 'black',
            },
            {
                type: 'curve',
                id: 'Native_Solvent_accessibility',
                label: 'Native Solvent Accessibility',
                color: '#ffd2df',
                stroke: "black",
                height: 3,
                data: asaScoreData, 
            },
            {
                type: 'curve',
                id: 'Predicted_accessibility',
                label: 'Predicted Accessibility',
                color: '#fc0080',
                stroke: "black",
                height: 1,
                data: rsaScoreData,
            },
            // ** Secondary Structure PANEL **
            {
                type: 'rect',
                id: 'Native_Sec_Struc',
                label: 'Native Sec.Struc',
                color: 'black',
                height: 3,
                data: mergedSECSSBinary, 
            },
            {
                type: 'rect',
                id: 'Putative_Sec_Struc',
                label: 'Putative Sec.Struc',
                color: 'black',
                height: 3,
                data: mergedPsiPrepBinary, 
            },
            {
                type: 'curve',
                id: 'Secondary_Struct_Score',
                label: 'Secondary Struct Score',
                height: 3,
                data: PsiPredScoreData, 
            },
            // ** CONSERVATION PANEL **
            {
                type: 'rect',
                id: 'Conservation_Levels',
                label: 'Conservation Levels',
                color: 'black',
                height: 3,
                data: mergedConservationLevels, 
            },
            {
                type: 'curve',
                id: 'Conservation_Score',
                label: 'Conservation Score',
                color: '#607c8e',
                height: 4,
                data: mmseqScoreData, 
            },
            // ** PROTEIN PANEL **
            {
                type: 'rect',
                id: 'DisoRDPbind_Binding',
                label: 'DisoRDPbind Protein Binding',
                data: disoRDPbindSegments,
                color: '#3d7afd'
            },
            {
                type: 'rect',
                id: 'Scriber_Binding',
                label: 'SCRIBER',
                data: scriberSegments,
                color: '#3b5b92'
            },
            {
                type: 'rect',
                id: 'MoRFchibi_Binding',
                label: 'MoRFchibi',
                data: morfChibiSegments,
                color: '#01889f'
            },
            {
                type: 'curve',
                id: 'DisoRDPbind_Score',
                label: 'DisoRDPbind Score',
                color: '#3d7afd',
                height: 3,
                data: disoRDPbindScoreData
            },            
            {
                type: 'curve',
                id: 'Scriber_Score',
                label: 'SCRIBER Score',
                color: '#3b5b92',
                height: 3,
                data: scriberScoreData
            },
            {
                type: 'curve',
                id: 'MoRFchibi_Score',
                label: 'MoRFchibi Score',
                color: '#01889f',
                height: 3,
                data: morfChibiScoreData
            },
            // ** LINKER PANEL **
            {
                type: 'rect',
                id: 'Linker_Residues',
                label: 'Linker Residues',
                data: linkerSegments,
                color: '#ff9408'
            },
            {
                type: 'curve',
                id: 'Linker_Score',
                label: 'Linker Score',
                color: '#ff9408',
                height: 3,
                data: linkerScoreData
            }
        ]);
};