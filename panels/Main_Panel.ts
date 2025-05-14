import { initializeViewer } from "../utils/utils";
import { PanelDataService } from '../utils/PanelDataService'; 

import { disorderPanel } from "./Disorder_Panel";
import { asaPanel } from "./ASA_Panel";
import { SSPanel } from "./SS_Panel";
import { ProteinPanel } from "./Protein_Panel";
import { DNAPanel } from "./DNA_Panel";
import { RNAPanel } from "./RNA_Panel";
import { SignalPPanel } from "./SignalP_Panel";
import { ConservationPanel } from "./Conservation_Panel";
import { LinkerPanel } from "./Linker_Panel";
import { PTMPanel } from "./PTM_Panel_allrow";

// RETRIEVE DATA 
declare var inputValues: string;

// GET CLEANED PANEL SPECIFIC DATA 
const panelParser = new PanelDataService();
panelParser.initialize(inputValues);

const panelData = panelParser.getPanelData("Main_Panel");
const sequence = panelData.sequence

// IMPORT DATA FROM ALL OTHER PANELS
const MainPanel = [
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
    initializeViewer(sequence, MainPanel);
};

