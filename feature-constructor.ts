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

// TODO: Potenitally overhaul --Ben
// Works for testing
// Sort and nested for loop bring complexity questions
function lineColorSegments(data : {x: number; y: number;}[], segments: Segment[]): any {

    const colorData = data.map(point => ({...point, color: ""}));
    segments.sort((a, b) => a.x - b.x);

    let inSegment: boolean = false;
    let colorValue: string = "";
    for (let i = 0; i < colorData.length; i++){

        for (let segIndex = 0; segIndex < segments.length; segIndex++){

            if (colorData[i].x == segments[segIndex].x){
                inSegment = true;
                colorValue = segments[segIndex].color;
            }
    
            if (inSegment){
                colorData[i].color = colorValue;
            }
    
            if (colorData[i].x == segments[segIndex].y){
                inSegment == false;
            }

        }

    }
    return colorData;
}

const PsiPredScoreDataColored = lineColorSegments(PsiPredScoreData, mergedPsiPrepBinary);

//--------------------------------------------------------------------------------------------
// Mahmuda Panesl
//--------------------------------------------------------------------------------------------

const rawDisoRDPbindDNA: string = lines[20]?.trim() || "";
const rawDRNApredDNA: string = lines[22]?.trim() || "";
const rawDisoRDPbindDNAScore: string = lines[21]?.trim() || "";
const rawDRNApredDNAScore: string = lines[23]?.trim() || "";

const disoRDPbindDNA: number[] = rawDisoRDPbindDNA ? rawDisoRDPbindDNA.split('').map(Number) : [];
const dRNApredDNA: number[] = rawDRNApredDNA ? rawDRNApredDNA.split('').map(Number) : [];
const disoRDPbindDNAScore: number[] = rawDisoRDPbindDNAScore.split(',').map(val => parseFloat(val));
const dRNApredDNAScore: number[] = rawDRNApredDNAScore.split(',').map(val => parseFloat(val));

 const disoRDPbindDNAColour: Segment[] = extractSegments(disoRDPbindDNA, 1, "#c071fe");
 const dRNApredDNAColour: Segment[] = extractSegments(dRNApredDNA, 1, "#ce5dae");

 const disoRDPbindDNAScoreData = extractLines(disoRDPbindDNAScore);
 const dRNApredDNAScoreData = extractLines(dRNApredDNAScore);


//---------

const rawDisoRDPbindRNA: string = lines[16]?.trim() || "";
const rawDisoRDPbindRNAScore: string = lines[17]?.trim() || "";
const rawDRNApredRNA: string = lines[18]?.trim() || "";
const rawDRNApredRNAScore: string = lines[19]?.trim() || "";

const disoRDPbindRNA: number[] = rawDisoRDPbindRNA ? rawDisoRDPbindRNA.split('').map(Number) : [];
const disoRDPbindRNAScore: number[] = rawDisoRDPbindRNAScore.split(',').map(val => parseFloat(val));
const dRNApredRNA: number[] = rawDRNApredRNA ? rawDRNApredRNA.split('').map(Number) : [];
const dRNApredRNAScore: number[] = rawDRNApredRNAScore.split(',').map(val => parseFloat(val));


const disoRDPbindRNAColour: Segment[] = extractSegments(disoRDPbindRNA, 1, "orange");
const dRNApredRNAColour: Segment[] = extractSegments(dRNApredRNA, 1, "yellow");

const disoRDPbindRNAScoreData = extractLines(disoRDPbindRNAScore);
const dRNApredRNAScoreData = extractLines(dRNApredRNAScore);

//---------

const rawSignalPeptideBinary: string = lines[10]?.trim() || "";
const rawSignalPeptideScore: string = lines[11]?.trim() || "";

const signalPeptideBinary: number[] = rawSignalPeptideBinary ? rawSignalPeptideBinary.split('').map(Number) : [];
const signalPeptideScore: number[] = rawSignalPeptideScore.split(',').map(val => parseFloat(val));

 const signalPeptideSegments: Segment[] = extractSegments(signalPeptideBinary, 1, "brown");
 const signalPeptideScoreData = extractLines(signalPeptideScore);

 console.log("HERE: " + JSON.stringify(signalPeptideScoreData))

//----------------------------------------------------------------------------------------------

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
                id: 'ASA_SCORES',
                label: ' ',
                color: ['#ffd2df', '#fc0080'],
                stroke: "black",
                height: 1,
                data: [asaScoreData,  rsaScoreData], 
            },
            // ** Secondary Structure PANEL **
            {
                type: 'rect',
                id: 'Native_Sec_Struc',
                label: 'Native Sec.Struc',
                color: 'black',
                flag: 2,
                data: mergedSECSSBinary, 
            },
            {
                type: 'rect',
                id: 'Putative_Sec_Struc',
                label: 'Putative Sec.Struc',
                color: 'black',
                flag: 2,
                data: mergedPsiPrepBinary, 
            },
            {
                type: 'curve',
                id: 'Secondary_Struct_Score',
                label: 'Secondary Struct Score',
                height: 5,
                flag: 1,
                data: PsiPredScoreDataColored, 
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
                id: 'PROTEIN_SCORES',
                label: ' ',
                color: ['#3d7afd', '#3b5b92', '#01889f'],
                height: 3,
                flag: 1,
                data:[disoRDPbindScoreData, scriberScoreData, morfChibiScoreData]
            },            
            // ** DNA PANEL **
            { 
                type: 'rect', 
                id: 'DisoRDPbindDNA', 
                label: 'DisoRDPbind DNA binding', 
                data: disoRDPbindDNAColour, 
                color: "#c071fe",
            },
            { 
                type: 'rect', 
                id: 'DRNApredDNA', 
                label: 'DRNApred DNA binding', 
                data: dRNApredDNAColour, 
                color: "#ce5dae",
            },
            { 
                type: 'curve', 
                id: 'DNA_SCORES', 
                label: ' ', 
                color: ['#c071fe', '#ce5dae'], 
                height: 3, 
                data: [disoRDPbindDNAScoreData, dRNApredDNAScoreData],
            },
            // ** RNA PANEL ** 
            { 
                type: 'rect', 
                id: 'DisoRDPbindRNA', 
                label: 'DisoRDPbind RNA binding', 
                data: disoRDPbindRNAColour, 
                color: "#fcc006",
            },
            { 
                type: 'rect', 
                id: 'DRNApredRNA', 
                label: 'DRNApred RNA binding', 
                data: dRNApredRNAColour, 
                color: "#fdff38",
            },
            { 
                type: 'curve', 
                id: 'RNA_SCORES', 
                label: ' ', 
                color: ['#fcc006', '#fdff38'], 
                height: 3, 
                data: [disoRDPbindRNAScoreData, dRNApredRNAScoreData],
            },
            // ** SIGNAL PEPTIDE **
              { 
                type: 'rect', 
                id: 'Signal_Peptide', 
                label: 'Signal peptides', 
                data: signalPeptideSegments, 
                color: "#964e02",
            },
            { 
                type: 'curve', 
                id: 'Signal_Peptide_Score', 
                label: 'Signal Peptides score', 
                color: '#964e02', 
                height: 3, 
                data: signalPeptideScoreData,
            },
             // ** CONSERVATION PANEL **
            {
                type: 'rect',
                id: 'Conservation_Levels',
                label: 'Conservation Levels',
                color: 'black',
                height: 3,
                flag: 4,
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