import { initializeViewer, extractSegments, extractLines, Segment, psipredRescaleScores, lineColorSegments} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("SS_Panel");

const sequence = panelData.sequence;
const secssBinary = panelData.secssBinary;
const psiPredBinary = panelData.psiPredBinary
const coilScore = panelData.coilScore
let strandScore = panelData.strandScore
let helixScore =  panelData.helixScore

// Checking data format for pddt case
if (Number.isNaN(helixScore[0])){
    helixScore = null;
    strandScore = null;
}

// SET COLORS FOR DATA
const COLORS = {
    helix: "#cf6275",
    strand: "#fffd01",
    coil: "#25a36f",
    unavailable: "#c0c0c0"
};

// NOTE: Changing the order of this breaks the concact
const  secStructScores  = [coilScore, strandScore, helixScore];
let psiPredScore: number[] = [];

// PDDT EXCEPTION
if (helixScore !=  null){
    psiPredScore = secStructScores .reduce(function(final, current) {
        for (var i = 0; i < final.length; ++i) {
            if (current[i] > final[i]) {
            final[i] = current[i];
            }
        }
        return final;
        });
}else{
    psiPredScore = [...coilScore];
}

// PROCESS SECSS BINARY SEGMENTS
const secssSegments: Segment[] = [
    ...extractSegments(secssBinary, 1, COLORS.helix),
    ...extractSegments(secssBinary, 2, COLORS.strand),
    ...extractSegments(secssBinary, 3, COLORS.coil),
    ...extractSegments(secssBinary, 0, COLORS.unavailable)
];

// PROCESS PSIPRED BINARY SEGMENTS
const psiPredSegments: Segment[] = [
    ...extractSegments(psiPredBinary, 0, COLORS.helix),
    ...extractSegments(psiPredBinary, 1, COLORS.strand),
    ...extractSegments(psiPredBinary, 2, COLORS.coil),
    //For unknown assignment from DSSP on AF-derived structures
    ...extractSegments(psiPredBinary, 3, COLORS.unavailable)
];

//TODO: Is SS_Code value X needed from original?

// RESCALE SECSTRUCT SCORES
const psiPredScoreRescaled = psipredRescaleScores(psiPredScore);
const psiPredScoreData =  extractLines(psiPredScoreRescaled);

const psiPredScoreDataColored = lineColorSegments(psiPredScoreData, psiPredSegments);

// EXPORT DATA
export const SSPanel = [
    {
        type: 'rect',
        id: 'Native_Sec_Struc',
        label: 'Native Sec.Struc',
        color: 'black',
        flag: 2,
        data: secssSegments, 
        sidebar: [
        
            {
                id: 'Native_Sec_Struc_Unavailable_Button',
                label: 'Native Sec Struc Unavailable Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #c0c0c0; margin-right: 5px;"></span>
                    Unavaliable_native
                </button>`
            },
            {
                id: 'Native_Sec_Struc_Coil_Button',
                label: 'Native Sec Struc Coil Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #25a36f; margin-right: 5px;"></span>
                    Coil
                </button>`
            },
            {
                id: 'Native_Sec_Struc_Helix_Button',
                label: 'Native Sec Struc Helix Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #cf6275; margin-right: 5px;"></span>
                    Helix
                </button>`
            },
            {
                id: 'Native_Sec_Struc_Strand_Button',
                label: 'Native Sec Struc Stand Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #fffd01; margin-right: 5px;"></span>
                    Strand
                </button>`
            }
        ]
    },
    {
        type: 'rect',
        id: 'Putative_Sec_Struc',
        label: 'Putative Sec.Struc',
        color: 'black',
        flag: 2,
        data: psiPredSegments, 
    },
    {
        type: 'curve',
        id: 'SECONDARY_STRUC_SCORES',
        label: ' ',
        flag: 1,
        data: psiPredScoreDataColored,
        sidebar: [
            {
                id: 'SECONDARY_STRUC_SCORES 0',
                label: 'Secondary Struc Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #25a36f; margin-right: 5px; vertical-align: middle;"></span>
                    Secondary struc.score
                </button>`
            }
        ] 
    }                 
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, SSPanel);

    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'Native_Sec_Struc_Unavailable_Button',
            'Native_Sec_Struc_Coil_Button',
            'Native_Sec_Struc_Helix_Button',
            'Native_Sec_Struc_Strand_Button',
            'SECONDARY_STRUC_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

