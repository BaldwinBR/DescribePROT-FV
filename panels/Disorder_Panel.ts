import { initializeViewer, extractSegments, extractLines, Segment } from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Disorder_Panel");

const sequence = panelData.sequence;
const disorderBinary = panelData.disorderBinary;
const vslBinary = panelData.vslBinary;
const vslScore = panelData.vslScore;

// SET COLORS FOR DATA
const COLORS = {
    nativeDisorder: "#2da02c",
    nativeUnavailable: "grey",
    putativeDisorder: "#76fd63"
};

// PROCESS NATIVE DISORDER SEGMENTS
const nativeDisorderSegments: Segment[] = [
    ...extractSegments(disorderBinary, 1, COLORS.nativeDisorder),
    ...extractSegments(disorderBinary, 2, COLORS.nativeUnavailable)
];

// PROCESS PUTATIVE DISORDER SEGMENTS
const putativeDisorderSegments: Segment[] = extractSegments(vslBinary, 1, COLORS.putativeDisorder);

// EXTRACT VSL SCORES FOR LINE GRAPH
const vslScoreData = extractLines(vslScore);

// EXPORT DATA
export const disorderPanel = [
    {
        type: 'rect',
        id: 'Native_Disorder',
        label: 'Native Disorder',
        data: nativeDisorderSegments,
        color: "black",
        className : 'Native_Disorder',
        sidebar: [
            {
                id: 'Native_Disorder_Button',
                label: 'Native Disorder Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #2ca02c; margin-right: 5px;"></span>
                    Native Disordered Regions
                </button>`
            }
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Disorder',
        label: 'Putative Disorder',
        data: putativeDisorderSegments,
        color: 'black',
        sidebar: [
                {
                id: 'Putative_Disorder_Button',
                label: 'Putative Disorder Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #75fd63; margin-right: 5px;"></span>
                    Putative Disordered Regions
                </button>`
            }
        ]
    },
    {
        type: 'curve',
        id: 'PREDICTIVE_DISORDER_SCORES',
        label: ' ',
        color: '#76fd63',
        flag: 6,
        data: vslScoreData,
        sidebar: [
            {
                id: 'PREDICTIVE_DISORDER_SCORES 0',
                label: 'Predictive Disorder Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #75fd63; margin-right: 5px; vertical-align: middle;"></span>
                    Predictive Disordered Regions
                </button>`
            }
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, disorderPanel);
    
    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'DisoRDPbindDNA_Button',
            'drnaPredDNA_Button',
            'DNA_SCORES 0',
            'DNA_SCORES 1',
        ];

        if (resetButtons.includes(buttonId)) {
            viewer.featureToggle(buttonId);
        }
    });
};



