import { initializeViewer, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("ASA_Panel");

const sequence = panelData.sequence;
const rsaBinary = panelData.rsaBinary;
const rsaScore = panelData.rsaScore;
const asaBinary = panelData.asaBinary;
const asaScore = panelData.asaScore;

// SET COLORS FOR DATA
const COLORS = {
    rsaAvailable: "#fc0080",
    rsaUnavailable: "grey",
    asaAvailable: "#ffd2df"
};

// PROCESS RSA BINARY SEGMENTS
const rsaSegments: Segment[] = [
    ...extractSegments(rsaBinary, 1, COLORS.rsaAvailable),
    ...extractSegments(rsaBinary, 2, COLORS.rsaUnavailable)
];

// EXTRACT RSA SCORES FOR LINE GRAPH
const rsaLines = extractLines(rsaScore);
const rsaScoreSegments: Segment[] = extractScoreSegments(rsaScore, 0, COLORS.rsaAvailable);
const rsaScoreData = lineColorSegments(rsaLines, rsaScoreSegments);

// EXTRACT ASA SCORES FOR LINE GRAPH
const asaLines = extractLines(asaScore);
const asaScoreSegments: Segment[] = extractScoreSegments(asaScore, 0, COLORS.asaAvailable);
const asaScoreData = lineColorSegments(asaLines, asaScoreSegments);

// PROCESS ASA BINARY SEGMENTS
const asaSegments: Segment[] = extractSegments(asaBinary, 1, COLORS.asaAvailable);

// EXPORT DATA
export const asaPanel = [
    {
        type: 'rect',
        id: 'Native_RSA_Binary',
        label: 'Native Buried Residues',
        data: rsaSegments,
        color: "black",
        sidebar: [
            {
                id: 'Native_RSA_Binary_Button',
                label: 'Native RSA Binary Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #fc0080; margin-right: 5px;"></span>
                    Native Buried Residue
                </button>`
            }
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Buried_Residue',
        label: 'Putative Buried Residue',
        data: asaSegments,
        color: 'black',
        sidebar: [
            {
                id: 'Putative_Buried_Residue_Button',
                label: 'Putative Buried Residue Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #ffd2df; margin-right: 5px;"></span>
                    Native Buried Residue
                </button>`
                }
        ]
    },
    {
        type: 'curve',
        id: 'ASA_SCORES',
        label: ' ',
        color: ['#ffd2df', '#fc0080'],
        stroke: "black",
        flag: 2,
        data: [asaScoreData,  rsaScoreData],
        sidebar: [
                {
                id: 'ASA_SCORES 1',
                label: 'ASA SCORES Native Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #fc0080; margin-right: 5px; vertical-align: middle;"></span>
                    Native Solvent Accesibility
                </button>`
            },
            {
                id: 'ASA_SCORES 0',
                label: 'ASA SCORES Predicted Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #ffd2df; margin-right: 5px; vertical-align: middle;"></span>
                    Predicted Solvent Accesibility
                </button>`
            },
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    
    const viewer = initializeViewer(sequence, asaPanel);

    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'Native_RSA_Binary_Button',
            'Putative_Buried_Residue_Button',
            'ASA_SCORES 0',
            'ASA_SCORES 1'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

