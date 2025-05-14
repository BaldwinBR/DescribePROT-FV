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
    const viewer = initializeViewer(sequence, MainPanel);

    viewer.onButtonSelected((event) => { 
        const buttonId = event.detail.id;
        const resetButtons = [
            'Native_Disorder_Button',
            'Putative_Disorder_Button',
            'PREDICTIVE_DISORDER_SCORES 0',
            'Native_RSA_Binary_Button',
            'Putative_Buried_Residue_Button',
            'ASA_SCORES 0',
            'ASA_SCORES 1',
            'Native_Sec_Struc_Unavailable_Button',
            'Native_Sec_Struc_Coil_Button',
            'Native_Sec_Struc_Helix_Button',
            'Native_Sec_Struc_Strand_Button',
            'SECONDARY_STRUC_SCORES 0',
            'DisoRDPbind_Binding_Button',
            'Scriber_Binding_Button',
            'MoRFchibi_Binding_Button',
            'PROTEIN_SCORES 0',
            'PROTEIN_SCORES 1',
            'PROTEIN_SCORES 2',
            'DisoRDPbindDNA_Button',
            'drnaPredDNA_Button',
            'DNA_SCORES 0',
            'DNA_SCORES 1',
            'DisoRDPbindRNA_Button',
            'drnaPredRNA_Button',
            'RNA_SCORES 0',
            'RNA_SCORES 1',
            'Signal_Peptide_Button',
            'SIGNAL_PEPTIDE_SCORES 0',
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
            'Linker_Residues_Button',
            'LINKER_SCORES 0',
            'PTM_Sites 0',
            'PTM_Sites 1',
            'PTM_Sites 2',
            'PTM_Sites 3',
            'PTM_Sites 4',
            'PTM_Sites 5',
            'PTM_Sites 6',
            'PTM_Sites 7',
            'PTM_Sites 8'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            viewer.featureToggle(buttonId);
            
        }

    });

};

