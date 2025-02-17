/**
 * major change: I noticed that we've been declaring the same array for data plotting. 
 * For maintainability + reusability, I declared an interface called "Segment" and changed the code using the interface.
 * 
 * Also, for the data, apparently it's better to use const instead of let to prevent reassignment and works safer with objects and arrays.
 */

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

// **Extract Disorder data**
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

// **Disorder panel**
const nativeDisorderColor: Segment[] = extractSegments(disorderBinary, 1, "#75fd63"); // assigned color for data exists
const nativeDisorderGrey: Segment[] = extractSegments(disorderBinary, 2, "grey"); // Grey overlay for not available data

// This is to plot the available and unavailable data at the same line
const mergedNativeDisorder: Segment[] = [
    ...nativeDisorderColor.map(s => ({ ...s, color: "#75fd63"})),
    ...nativeDisorderGrey.map(s => ({ ...s, color: "grey"}))
];

const putativeDisorder: Segment[] = extractSegments(vslBinary, 1, "black");


// **RSA panel**
const nativeRSABinaryColor: Segment[] = extractSegments(rsaBinary, 1, "#75fd63"); // assigned color for available RSA data
const nativeRSABinaryGrey: Segment[] = extractSegments(rsaBinary, 2, "grey"); // Grey for not available RSA data

// This is to plot the available and unavailable data at the same line
const mergedRSABinary: Segment[] = [
    ...nativeRSABinaryColor.map(s => ({ ...s, color: "#75fd63" })),
    ...nativeRSABinaryGrey.map(s => ({ ...s, color: "grey" }))
];



/**
 * Extract data for line plots (Score Data)
 * @param scoreArray - Numerical score array
 * @returns Array of `{x, y}` points
 */
function extractLines(scoreArray: number[]): { x: number; y: number }[] {
    return scoreArray.map((value, index) => ({
        x: index + 1,
        y: value
    }));
}

// **Extract Line Data**
const vslScoreData = extractLines(vslScore);
const rsaScoreData = extractLines(rsaScore);
const asaScoreData = extractLines(asaScore);

// **Extract ASA and RSA Binary Data**
const buriedResiduesResults: Segment[] = extractSegments(asaBinary, 1, "grey");


window.onload = () => {
    let ASA_panel = new FeatureViewer(sequence, '#feature-viewer',
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
            {
                type: 'rect',
                id: 'Native_Disorder',
                label: 'Native Disorder',
                data: mergedNativeDisorder,
                color: "grey"
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
                color: '#75fd63', 
                height: 3,
                data: vslScoreData
            },
            {
                type: 'rect',
                id: 'Native_RSA_Binary',
                label: 'Native RSA Binary',
                data: mergedRSABinary,
                color: "grey"
            },
            {
                type: 'rect',
                id: 'Putative_Buried_Residue',
                label: 'Putative Buried Residue',
                data: buriedResiduesResults,
                color: 'grey',
                stroke: "black",
            },
            {
                type: 'curve',
                id: 'Native_Solvent_accessibility',
                label: 'Native Solvent Accessibility',
                color: 'grey',
                stroke: "black",
                height: 3,
                data: asaScoreData, 
            },
            {
                type: 'curve',
                id: 'Predicted_accessibility',
                label: 'Predicted Accessibility',
                color: 'grey',
                stroke: "black",
                height: 3,
                data: rsaScoreData, 
            },
        ]);
};
