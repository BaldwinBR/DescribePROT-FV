import { initializeViewer, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("RNA_Panel");

const sequence = panelData.sequence;
const disoRDPbindRNA = panelData.disoRDPbindRNA
const drnaPredRNA = panelData.drnaPredRNA
const disoRDPbindRNAScore = panelData.disoRDPbindRNAScore
const drnaPredRNAScore = panelData.drnaPredRNAScore

// SET COLORS FOR DATA
const COLORS = {
    disoRDPbind: "#fcc006", 
    drnaPred: "#fdff38"   
};

// SEGMENTS
const disoRDPbindRNAColour: Segment[] = extractSegments(disoRDPbindRNA, 1, COLORS.disoRDPbind);
const drnaPredRNAColour: Segment[] = extractSegments(drnaPredRNA, 1, COLORS.drnaPred);

// LINES & COLORED SCORE DATA
const disoRDPbindRNAScoreData = lineColorSegments(
    extractLines(disoRDPbindRNAScore),
    extractScoreSegments(disoRDPbindRNAScore, 0, COLORS.disoRDPbind)
);

const drnaPredRNAScoreData = lineColorSegments(
    extractLines(drnaPredRNAScore),
    extractScoreSegments(drnaPredRNAScore, 0, COLORS.drnaPred)
);

// EXPORT DATA
export const RNAPanel = [
    { 
        type: 'rect', 
        id: 'DisoRDPbindRNA', 
        label: 'DisoRDPbind-RNA', 
        data: disoRDPbindRNAColour, 
        color: "#fcc006",
        sidebar: [
            {
                id: 'DisoRDPbindRNA_Button',
                label: 'DisoRDPbind RNA binding Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #fcc006; margin-right: 5px;"></span>
                    DisoRDPbind RNA Binding
                </button>`
            }
        ]
    },
    { 
        type: 'rect', 
        id: 'drnaPredRNA', 
        label: 'DRNApred-RNA', 
        data: drnaPredRNAColour, 
        color: "#fdff38",
        sidebar: [
            {
                id: 'drnaPredRNA_Button',
                label: 'DRNApred RNA binding Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #fdff38; margin-right: 5px;"></span>
                    DRNApred RNA Binding
                </button>`
            }
        ]
    },
    { 
        type: 'curve', 
        id: 'RNA_SCORES', 
        label: ' ', 
        color: ['#fcc006', '#fdff38'], 
        flag: 5,
        data: [disoRDPbindRNAScoreData, drnaPredRNAScoreData],
        sidebar: [
                {
                id: 'RNA_SCORES 0',
                label: 'DisoRDPbind RNA Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #fcc006; margin-right: 5px; vertical-align: middle;"></span>
                    DisoRDPbind RNA Score
                </button>`
            },
            {
                id: 'RNA_SCORES 1',
                label: 'DRNApred RNA Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #fdff38; margin-right: 5px; vertical-align: middle;"></span>
                    DRNApred RNA Score 
                </button>`
            }
        ]
    },
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, RNAPanel);
    viewer.onButtonSelected((event) => {   
        const buttonId = event.detail.id;
        const resetButtons = [
            'DisoRDPbindRNA_Button',
            'drnaPredRNA_Button',
            'RNA_SCORES 0',
            'RNA_SCORES 1'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

