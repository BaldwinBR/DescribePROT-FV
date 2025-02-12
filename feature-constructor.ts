// Import feature viewer
import {FeatureViewer} from "./FeatureViewerTypeScript/src/feature-viewer";

// Import styles
import './feature-constructor.scss';

//Testing 1 2 3

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
        console.log("Inside");
        let segment = {
            x: start+ 1,
            //TODO: Change
            //Dont love assuming binary will run length of sequence
            y: binaryArray.length,
            color: "#blue",
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

// function to extract VSL score data
function extractVSL(VSLArray: number[]): { x: number; y: number }[] {
    // gets postions starting at 1 -> sequence length
    const positions = Array.from({length: VSLArray.length}, (_, i) => i + 1);

    return VSLArray.map((value, index) => ({
        // x is the position from array
        x: positions[index],
        // y is the VSL score at that position
        y: value
    }));
}


// Wait for page to load
window.onload = () => {

    let result = extractSegments(Disorder_Binary);
    let vslResults = extractSegments(VSL_Binary);
    let vslScoreData = extractVSL(VSL_Score);
    console.log(vslScoreData);
    console.log(sequence.length);

    // Instantiate feature viewer
    let featureViewer = new FeatureViewer(sequence, '#feature-viewer',
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
            color:'75fd63'
        },
        {
            type: 'curve',
            id: 'Curve1',
            label: 'Predictive Disorder Score',
            color: '#75fd63',
            height: 3,
            yLim: 1,
            data: vslScoreData
           
            
        },
    ]);
};
