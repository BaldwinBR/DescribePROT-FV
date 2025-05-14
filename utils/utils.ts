import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";

// Initializes a FeatureViewer instance with the provided sequence and panel data.
export function initializeViewer(sequence: string, panel: any, elementId: string = '#feature-viewer') {
  
    const viewer = new FeatureViewer(sequence, elementId, {
        toolbar: true,
        toolbarPosition: 'left',
        brushActive: true,
        zoomMax: 7,
        flagColor: 'white',
        flagTrack: 155,
        flagTrackMobile: 155,
        sideBar: 235
    }, 
    panel);

    // Handle sidebar button selections
    const sidebarButtonIds = panel.flatMap(
        feature => feature.sidebar ? feature.sidebar.map(button => button.id) 
        : []);

    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;

        if (sidebarButtonIds.includes(buttonId)) {
        viewer.featureToggle(buttonId);
        }
    });
    
    return viewer;
}

/**
 * Creates a sidebar button for a given feature, with customizable label, color, and shape.
 * The button's ID is constructed from the feature ID and an index number, which is used
 * for matching the button to the corresponding feature in toggle logic.
 *
 * Helpful Tips:
 * - The `id` of your feature and the `id` of the button should match.
 * - The `label` is what will be displayed as text in the button
 * - The `index` number helps the toggle method find and operate on the correct feature.
 */
export function createSidebarButton(featureId: string, label: string, color: string, shape: 'box' | 'line' | 'triangle', index: number = 0): {
    // Returns:
    id: string;
    label: string;
    content: string;
    tooltip?: string;
} 
{
    // Line Styling
    const lineVisual = `<span style="display: inline-block; width: 10px; height: 2px; background-color: ${color}; margin-right: 5px; vertical-align: middle;"></span>`;
    
    // Box Styling
    const boxVisual = `<span style="display: inline-block; width: 10px; height: 10px; background-color: ${color}; margin-right: 5px;"></span>`;
    
    // Triangle Styling
    const triangleVisual = `<span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid ${color}; margin-right: 5px;"></span>`;

    // Choose the visual based on the shape type
    const visual = shape === 'line' ? lineVisual 
        : shape === 'triangle' ? triangleVisual 
        : boxVisual;  // default to box

    // Tooltip for line type, optional for others
    const tooltip = shape === 'line' ? 'Click to Turn Off Line' : undefined;

    return {
        id: `${featureId} ${index}`,
        label: `${label} Button`,
        content: `
        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
            ${visual}
            ${label}
        </button>`,
        ...(tooltip ? { tooltip } : {}) // include tooltip only if it's defined
    };
}

// **Segment Interface**
export interface Segment {
    x: number;
    y: number;
    color: string;
    stroke: string;
    opacity?: number;
}

/**
 * Extract contiguous segments from score arrays
 * @param scoreArray - The array containing score values
 * @param threshold - The minimum value to extract as a segment
 * @param color - Segment fill color
 * @returns Array of Segment objects
 */
export function extractScoreSegments(scoreArray, threshold, color) {
    const segments: Segment[] = [];
    let inSegment = false;
    let start = 0;

    for (let i = 0; i < scoreArray.length; i++) {
        if (scoreArray[i] >= threshold) {
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
        segments.push({ x: start + 1, y: scoreArray.length, color, stroke: "black" });
    }

    return segments;
}

/**
 * Extract contiguous segments from binary arrays
 * @param binaryArray - The array containing binary values (0,1,2)
 * @param targetValue - The value to extract as a segment
 * @param color - Segment fill color
 * @returns Array of Segment objects
 */
export function extractSegments(binaryArray: number[], targetValue: number, color: string): Segment[] {
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

// Give Segments color data
export function lineColorSegments(data : {x: number; y: number;}[], segments: Segment[]): any {

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

/**
 * Converts an array of numerical scores into an array of coordinate points `{x, y}` 
 * for line plotting in FeatureViewer.
 *
 * @param {number[]} scoreArray - An array of numerical scores representing Y-values.
 * @returns {{x: number; y: number}[]} An array of objects, where each object contains an X (position) and Y (score) value.
 */
export function extractLines(scoreArray: number[]): { x: number; y: number }[] {
    return scoreArray.map((value, index) => ({
        x: index + 1,
        y: value
    }));
}

// **Rescaling for psi pred score**
export function psipredRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => 0.33 + ((value - min) / (max - min)) * (1 - 0.33));
}

// **Rescaling for mmseq score**
export function mmseqRescaleScores(scores) {
    // find min and max values in array
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    
    // apply min-max scaling
    return scores.map(value => (value - min) / (max - min));
}