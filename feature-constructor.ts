import { initializeViewer } from "./utils/utils";
import { PanelDataService } from './utils/PanelDataService'; 

import { disorderPanel } from "./panels/Disorder_Panel";
import { asaPanel } from "./panels/ASA_Panel";
import { SSPanel } from "./panels/SS_Panel";
import { ProteinPanel } from "./panels/Protein_Panel";
import { DNAPanel } from "./panels/DNA_Panel";
import { RNAPanel } from "./panels/RNA_Panel";
import { SignalPPanel } from "./panels/SignalP_Panel";
import { ConservationPanel } from "./panels/Conservation_Panel";
import { LinkerPanel } from "./panels/Linker_Panel";
import { PTMPanel } from "./panels/PTM_Panel_allrow";

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Main_Panel");
const sequence = panelData.sequence

// IMPORT DATA FROM ALL OTHER PANELS
const TestingSpacePanel = [
            ...disorderPanel,
            ...asaPanel,
            ...SSPanel,
            ...ProteinPanel,           
            ...DNAPanel,
            ...RNAPanel,
            ...SignalPPanel,
            ...ConservationPanel,
            ...LinkerPanel,
            ...PTMPanel
]

// LOAD WINDOW
window.onload = () => {
    initializeViewer(sequence, TestingSpacePanel);
};

