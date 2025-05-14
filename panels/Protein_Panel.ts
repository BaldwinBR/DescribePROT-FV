import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { initializeViewer, extractSegments, extractLines, Segment, extractScoreSegments, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 
import '../feature-constructor.scss';

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Protein_Panel");

const sequence = panelData.sequence;
const disoRDPbindBinary = panelData.disoRDPbindBinary
const scriberBinary = panelData.scriberBinary
const morfChibiBinary = panelData.morfChibiBinary
const disoRDPbindScore = panelData.disoRDPbindScore
const scriberScore = panelData.scriberScore
const morfChibiScore = panelData.morfChibiScore

// SET COLORS FOR DATA
const COLORS = {
    disoRDPbind: "#3d7afd",
    morfChibi: "#01889f",
    scriber: "#3b5b92"
};

// PROCESS BINARY SEGMENTS
const disoRDPbindSegments: Segment[] = extractSegments(disoRDPbindBinary, 1, COLORS.disoRDPbind);
const morfChibiSegments: Segment[] = extractSegments(morfChibiBinary, 1, COLORS.morfChibi);
const scriberSegments: Segment[] = extractSegments(scriberBinary, 1, COLORS.scriber);

// PROCESS SCORED SEGMENTS
const disoRDPbindLines = extractLines(disoRDPbindScore);
const disoRDPbindScoreData = lineColorSegments(
    disoRDPbindLines,
    extractScoreSegments(disoRDPbindScore, 0, COLORS.disoRDPbind)
);

const scriberLines = extractLines(scriberScore);
const scriberScoreData = lineColorSegments(
    scriberLines,
    extractScoreSegments(scriberScore, 0, COLORS.scriber)
);

const morfChibiLines = extractLines(morfChibiScore);
const morfChibiScoreData = lineColorSegments(
    morfChibiLines,
    extractScoreSegments(morfChibiScore, 0, COLORS.morfChibi)
);

export const ProteinPanel = [
            {
                type: 'rect',
                id: 'DisoRDPbind_Binding',
                label: 'DisoRDPbind-Protein',
                data: disoRDPbindSegments,
                color: '#3d7afd',
                sidebar: [
                    {
                        id: 'DisoRDPbind_Binding_Button',
                        label: 'DisoRDPbind Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3d7afd; margin-right: 5px;"></span>
                            DisoRDPbind Protein Binding
                        </button>`
                    }
                ]
            },
            
            {
                type: 'rect',
                id: 'Scriber_Binding',
                label: 'SCRIBER',
                data: scriberSegments,
                color: '#3b5b92',
                sidebar: [
                    {
                        id: 'Scriber_Binding_Button',
                        label: 'Scriber Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3b5b92; margin-right: 5px;"></span>
                            SCRIBER Protein Binding
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'MoRFchibi_Binding',
                label: 'MoRFchibi',
                data: morfChibiSegments,
                color: '#01889f',
                sidebar: [
                    {
                        id: 'MoRFchibi_Binding_Button',
                        label: 'MoRFchibi Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #01889f; margin-right: 5px;"></span>
                            MoRFchibi Protein Binding
                        </button>`
                    }
                ]
                
            },
            {
                type: 'curve',
                id: 'PROTEIN_SCORES',
                label: ' ',
                color: ['#3d7afd', '#3b5b92', '#01889f'],
                flag: 3,
                data:[disoRDPbindScoreData, scriberScoreData, morfChibiScoreData],
                sidebar: [
                    {
                        id: 'PROTEIN_SCORES 0',
                        label: 'DisoRDPbind Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3d7afd; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind Score
                        </button>`
                    },
                    {
                        id: 'PROTEIN_SCORES 1',
                        label: 'Scriber Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3b5b92; margin-right: 5px; vertical-align: middle;"></span>
                            Scriber Score
                        </button>`
                    },
                    {
                        id: 'PROTEIN_SCORES 2',
                        label: 'MoRFchibi Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #01889f; margin-right: 5px; vertical-align: middle;"></span>
                            MoRFchibi Score
                        </button>`
                    }
                ]
            },  
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, ProteinPanel);

    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'DisoRDPbind_Binding_Button',
            'Scriber_Binding_Button',
            'MoRFchibi_Binding_Button',
            'PROTEIN_SCORES 0',
            'PROTEIN_SCORES 1',
            'PROTEIN_SCORES 2'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }
    });
};

