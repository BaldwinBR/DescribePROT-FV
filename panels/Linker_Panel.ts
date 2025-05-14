import { initializeViewer, extractSegments, extractLines, Segment} from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Linker_Panel");

const sequence = panelData.sequence;
const linkerBinary = panelData.linkerBinary
const linkerScore = panelData.linkerScore

// SET COLORS FOR DATA
const COLORS = {
    linker: "#ff9408"
};

// **Linker Panel**
const linkerSegments: Segment[] = extractSegments(linkerBinary, 1, COLORS.linker);
const linkerScoreData = extractLines(linkerScore);


// EXPORT DATA
export const LinkerPanel = [
    {
        type: 'rect',
        id: 'Linker_Residues',
        label: 'Linker',
        data: linkerSegments,
        color: COLORS.linker,
        sidebar: [
            {
                id: 'Linker_Residues_Button',
                label: 'Linker Residues Button',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 10px; background-color: #ff9408; margin-right: 5px;"></span>
                    Linker Residues
                </button>`
            }
        ]
    },
    {
        type: 'curve',
        id: 'LINKER_SCORES',
        label: ' ',
        color: COLORS.linker,
        flag: 9,
        data: linkerScoreData,
        sidebar: [
            {
                id: 'LINKER_SCORES 0',
                label: 'Linker Score Button',
                tooltip: 'Click to Turn Off Line',
                content: `
                <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                    <span style="display: inline-block; width: 10px; height: 2px; background-color: #ff9408; margin-right: 5px; vertical-align: middle;"></span>
                    Linker Score
                </button>`
            }
        ]
    },
];

// LOAD WINDOW IF SINGULAR PANEL VIEW
window.onload = () => {
    const viewer = initializeViewer(sequence, LinkerPanel);
    
    viewer.onButtonSelected((event) => {
        const buttonId = event.detail.id;
        const resetButtons = [
            'Linker_Residues_Button',
            'LINKER_SCORES 0'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

