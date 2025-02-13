// Import feature viewer
import {FeatureViewer} from "./FeatureViewerTypeScript/src/feature-viewer";

// Import styles
import './feature-constructor.scss';

// Data from file
declare var inputValues: string;

// Split lines into array
let lines = inputValues.split('\n');
console.log(lines);

// Data Needed for Disorder
let sequence = lines[1];
let unprocessed_VSL_Binary = lines[2];
let unprocessed_VSL_Score = lines[3];
let unprocessed_Disorder_Binary = lines[30];
let VSL_Score: number[] = unprocessed_VSL_Score.trim().split(',').map(val => parseFloat(val));

// Create array from binary data values
let Disorder_Binary = Array.from(unprocessed_Disorder_Binary, Number);
let VSL_Binary = Array.from(unprocessed_VSL_Binary, Number);

// ASA Panel
let unprocessed_RSA_binary = lines[32];
let RSA_residues = Array.from(unprocessed_RSA_binary, Number);

let unprocessed_RSA_score = lines[33];
let RSA_score: number[] = unprocessed_RSA_score.trim().split(',').map(val => parseFloat(val));
// let RSA_score: number[] = replaceNegativesWithZeros(unprocessed_RSA_score.trim().split(',').map(val => parseFloat(val)));

let unprocessed_ASA_score = lines[15];
let ASA_score: number[] = unprocessed_ASA_score.trim().split(',').map(val => parseFloat(val));

let unprocessed_ASA_binary = lines[14];
let buried_residues = Array.from(unprocessed_ASA_binary, Number);

/* function replaceNegativesWithZeros(arr: number[]): number[] {
    return arr.map(num => (isNaN(num) || num < 0 ? 0 : num));
} */

function extractSegments(binaryArray) {
    //Format that the Data Array requires 
    let pos: { x: number; y: number; color: string; stroke: string }[] = [];
    let neg: { x: number; y: number; color: string; stroke: string }[] = [];
    
    let currentValue = null;
    let start = 0;
    
    //Cycle through array, analyze each value
    //Looking for sets of same value
    for (let i = 0; i < binaryArray.length; i++) {
        //Different value found than previous so end segment
        if (binaryArray[i] !== currentValue) {
            if (currentValue !== null) {
                let segment = {
                    x: start + 1,
                    y: i,
                    color: "#gray",
                    stroke: "black"
                };
                //TODO: Currently this checks for value of 1
                //This is due to there being two different binary data types
                // (0,1) and (1,2)
                //Since they both contain 1 I split the differnce
                //This should change!
                //Variables above are named pos & neg in hopes of identifying type of binary
                //and filling in accordingly instead
                if (currentValue === 1) {
                    pos.push(segment);
                } else {
                    neg.push(segment);
                }
            }
            // Start a new segment
            // set start to end of last segment
            currentValue = binaryArray[i];
            start = i;
        }
    }
    
    // Adds the last segment
    if (currentValue !== null) {
        let segment = {
            x: start+ 1,
            //TODO: Change
            //Dont love assuming binary will run length of sequence
            y: binaryArray.length,
            color: "#gray",
            stroke: "black"
        };
        if (currentValue === 1) {
            pos.push(segment);
        } else {
            neg.push(segment);
        }
    }

    return { pos, neg };
}

// function to extract line graph data
function extractLines(LinesArray: number[]): { x: number; y: number }[] {
    // gets positions starting at 1 -> sequence length
    const positions = Array.from({ length: LinesArray.length }, (_, i) => i + 1);

    return LinesArray
        .map((value, index) => ({
            x: positions[index], // x is the position from array
            y: value // y is the score at that position
        }))
}




// Wait for page to load
window.onload = () => {

    let result = extractSegments(Disorder_Binary);
    let vslResults = extractSegments(VSL_Binary);
    let vslScoreData = extractLines(VSL_Score);

    // panel 2
    let buriedresiduesResults = extractSegments(buried_residues);
    let RSAresidues = extractSegments(RSA_residues);
    let RSAScoreData = extractLines(RSA_score); 
    let ASAScoreData = extractLines(ASA_score);


    let ASA_panel = new FeatureViewer(sequence, '#feature-viewer',
        // Define optional settings
        {
            toolbar: true,
            toolbarPosition: 'left',
            brushActive: true,
            zoomMax: 5,
            flagColor: 'white',
            flagTrack: 170,
            flagTrackMobile: 150
        },
        // Define optional features
        [
            {
                type: 'rect',
                id: 'Native_Disorder',
                label: 'Native Disorder',
                data: result.pos,
                color:'grey'
            },
            {
                type: 'rect',
                id: 'Unk_Exp_Disoredered_Residues',
                label: 'Not Avaliable',
                data: result.neg,
                color:'grey'
            },
            {
                type: 'rect',
                id: 'Putative_Disorder',
                label: 'Putative Diorder',
                data: vslResults.pos,
                color:'grey'
            },
            {
                type: 'curve',
                id: 'Curve1',
                label: 'Predictive Disorder Score',
                color: '#75fd63',
                height: 3,
                data: vslScoreData
            },
            {
                type: 'rect',
                id: 'Native_RSA_Binary',
                label: 'Native RSA Binary',
                data: RSAresidues.pos,
                color: 'grey',
                stroke: "black",
            },
            {
                type: 'rect',
                id: 'Unk_Native_RSA_Binary',
                label: 'Not Avaliable Native RSA Binary',
                data: RSAresidues.neg,
                color: 'grey',
                stroke: "black",
            },
            {
                type: 'rect',
                id: 'Putative_Buried_Residue',
                label: 'Putative Buried Residue',
                data: buriedresiduesResults.pos,
                color: 'grey',
                stroke: "black",
            },
            {
                type: 'curve',
                id: 'Native_Solvent_accessibility',
                label: 'Native Solvent accessibility',
                color: 'grey',
                stroke: "black",
                height: 3,
                data: ASAScoreData, 
            },
            {
                type: 'curve',
                id: 'Predicted_accessibility',
                label: 'Predicted accessibility',
                color: 'grey',
                stroke: "black",
                height: 3,
                data: RSAScoreData, 
            },
        ]);
};
