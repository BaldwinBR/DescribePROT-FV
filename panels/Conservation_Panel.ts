import { initializeViewer, extractSegments, extractLines, Segment, mmseqRescaleScores} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Conservation_Panel");

const sequence = panelData.sequence;
const mmseqBinary = panelData.mmseqBinary
const mmseqScore = panelData.mmseqScore

// SET COLORS FOR CONSERVATION LEVELS
const COLORS = {
    conv_0: "#f0f3f5",
    conv_1: "#f0f3f5",
    conv_2: "#d1dae0",
    conv_3: "#b3c2cb",
    conv_4: "#95aab7",
    conv_5: "#7691a2",
    conv_6: "#5d7889",
    conv_7: "#485d6a",
    conv_8: "#34434c",
    conv_9: "#1f282e"
};

// PROCESS CONSERVATION SEGMENTS
const conservationSegments: Segment[] = [
    ...extractSegments(mmseqBinary, 0, COLORS.conv_0),
    ...extractSegments(mmseqBinary, 1, COLORS.conv_1),
    ...extractSegments(mmseqBinary, 2, COLORS.conv_2),
    ...extractSegments(mmseqBinary, 3, COLORS.conv_3),
    ...extractSegments(mmseqBinary, 4, COLORS.conv_4),
    ...extractSegments(mmseqBinary, 5, COLORS.conv_5),
    ...extractSegments(mmseqBinary, 6, COLORS.conv_6),
    ...extractSegments(mmseqBinary, 7, COLORS.conv_7),
    ...extractSegments(mmseqBinary, 8, COLORS.conv_8),
    ...extractSegments(mmseqBinary, 9, COLORS.conv_9)
];

// RESCALE THEN EXTRACT MMSEQ SCORE LINE DATA
const mmseqScoreRescaled = mmseqRescaleScores(mmseqScore);
const mmseqScoreData = extractLines(mmseqScoreRescaled);

// EXPORT DATA
export const ConservationPanel = [
    {
        type: 'rect',
        id: 'Conservation_Levels',
        label: 'Conservation',
        color: 'black',
        flag: 4,
        data: conservationSegments,
        sidebar: [
            {
                id: 'Conservation_Level_1_Button',
                label: 'Conservation Level 1 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #f0f3f5; margin-right: 5px;"></span>
                    Conservation Level 1
                </button>`
            },
            {
                id: 'Conservation_Level_2_Button',
                label: 'Conservation Level 2 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #f0f3f5; margin-right: 5px;"></span>
                    Conservation Level 2
                </button>`
            },
            {
                id: 'Conservation_Level_3_Button',
                label: 'Conservation Level 3 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #d1dae0; margin-right: 5px;"></span>
                    Conservation Level 3
                </button>`
            },
            {
                id: 'Conservation_Level_4_Button',
                label: 'Conservation Level 4 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #b3c2cb; margin-right: 5px;"></span>
                    Conservation Level 4
                </button>`
            },
            {
                id: 'Conservation_Level_5_Button',
                label: 'Conservation Level 5 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #95aab7; margin-right: 5px;"></span>
                    Conservation Level 5
                </button>`
            },
            {
                id: 'Conservation_Level_6_Button',
                label: 'Conservation Level 6 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #7691a2; margin-right: 5px;"></span>
                    Conservation Level 6
                </button>`
            },
            {
                id: 'Conservation_Level_7_Button',
                label: 'Conservation Level 7 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #5d7889; margin-right: 5px;"></span>
                    Conservation Level 7
                </button>`
            },
            {
                id: 'Conservation_Level_8_Button',
                label: 'Conservation Level 8 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #485d6a; margin-right: 5px;"></span>
                    Conservation Level 8
                </button>`
            },
            {
                id: 'Conservation_Level_9_Button',
                label: 'Conservation Level 9 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #34434c; margin-right: 5px;"></span>
                    Conservation Level 9
                </button>`
            },
            {
                id: 'Conservation_Level_10_Button',
                label: 'Conservation Level 10 Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #1f282e; margin-right: 5px;"></span>
                    Conservation Level 10
                </button>`
            }
        ]
    },
    {
        type: 'curve',
        id: 'CONSERVATION_SCORES',
        label: ' ',
        color: '#607c8e',
        flag: 8,
        data: mmseqScoreData,
        sidebar: [
                {
                id: 'CONSERVATION_SCORES 0',
                label: 'Conservation Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #607c8e; margin-right: 5px; vertical-align: middle;"></span>
                    Conservation Score
                </button>`
            }
        ]
    }
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence,ConservationPanel);
    
    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'Signal_Peptide_Score_Button',
            'Conservation_Level_1_Button',
            'Conservation_Level_2_Button',
            'Conservation_Level_3_Button',
            'Conservation_Level_4_Button',
            'Conservation_Level_5_Button',
            'Conservation_Level_6_Button',
            'Conservation_Level_7_Button',
            'Conservation_Level_8_Button',
            'Conservation_Level_9_Button',
            'Conservation_Level_10_Button',
            'CONSERVATION_SCORES 0',
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

