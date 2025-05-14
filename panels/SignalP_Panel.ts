import { initializeViewer, extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("SignalP_Panel");

const sequence = panelData.sequence;
const signalPeptideBinary = panelData.signalPeptideBinary
const signalPeptideScore = panelData.signalPeptideScore

// SET COLORS FOR DATA
const COLORS = {
    signalPeptide: "brown",
};

// SEGMENTS
const signalPeptideSegments: Segment[] = extractSegments(signalPeptideBinary, 1, COLORS.signalPeptide);

// LINE DATA
const signalPeptideScoreData = extractLines(signalPeptideScore);

export const SignalPPanel = [
    { 
        type: 'rect', 
        id: 'Signal_Peptide', 
        label: 'Signal Peptides', 
        data: signalPeptideSegments, 
        color: "#964e02",
        sidebar: [
            {
                id: 'Signal_Peptide_Button',
                label: 'Signal Peptide Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #964e02; margin-right: 5px;"></span>
                    Signal Peptides
                </button>`
            }
        ]
    },
    { 
        type: 'curve', 
        id: 'SIGNAL_PEPTIDE_SCORES', 
        label: ' ', 
        color: '#964e02',
        flag: 7,
        data: signalPeptideScoreData,
        sidebar: [
            {
                id: 'SIGNAL_PEPTIDE_SCORES 0',
                label: 'Signal Peptides Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #964e02; margin-right: 5px; vertical-align: middle;"></span>
                    Signal Peptides Score
                </button>`
            }
        ]
    },
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, SignalPPanel);

    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'Signal_Peptide_Button',
            'SIGNAL_PEPTIDE_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

