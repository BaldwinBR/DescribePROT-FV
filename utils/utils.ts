import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { FeatureData } from '../FeatureViewerTypeScript/src/interfaces';

/**
 * Initializes and configures a FeatureViewer instance with a given sequence and panel configuration.
 * 
 * @param sequence - The sequence of the protein to visualize.
 * @param panel - An array of panel configurations, each defining tracks, features, and sidebar buttons.
 * @param elementId - The CSS selector of the DOM element where the viewer will be rendered. Defaults to '#feature-viewer'.
 * 
 * @returns The initialized FeatureViewer instance with sidebar button interactions.
 */ 
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

/**
 * Extracts contiguous segments from a binary array based on a target value.
 * @param binaryArray - An array of numeric values.
 * @param targetValue - The value to extract segments for (e.g., 1 to extract all 1s).
 * @param color - The color to assign to the extracted segments.
 * @param title - The title or to assign to each segment. Used by tooltips.
 * @param type - (Optional) A type descriptor to include in each segment object. Used by tooltips
 * @returns An array of FeatureData objects representing the start and end positions of each extracted segment.
 */
export function extractSegmentsNEW(binaryArray: number[], targetValue: number, color: string, title: string, type?: string): FeatureData[] {
    const segments: FeatureData[] = [];
    let inSegment = false;
    let start = 0;

    for (let i = 0; i < binaryArray.length; i++) {
        if (binaryArray[i] === targetValue) {
            if (!inSegment) {
                start = i;
                inSegment = true;
            }
        } else if (inSegment) {
            segments.push({ x: start + 1, y: i, color, title, stroke: "black", ...(type && { type }) });
            inSegment = false;
        }
    }

    if (inSegment) {
        segments.push({ x: start + 1, y: binaryArray.length, color, title, stroke: "black", ...(type && { type }) });
    }

    return segments;
}

/**
 * Converts an array of numerical scores into FeatureData points with color and title.
 *
 * @param scoreArray Array of numerical scores (Y-values).
 * @param color Color to assign to each point.
 * @param title Title to assign to each point. Used by tooltips.
 * @returns Array of FeatureData objects.
 */
export function extractLinesNEW(scoreArray: number[], color: string, title: string): FeatureData[] {
  return scoreArray.map((value, index) => ({
    x: index + 1,
    y: value,
    color,
    title
  }));
}