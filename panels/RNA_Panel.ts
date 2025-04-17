import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


const rawDisoRDPbindRNA: string = lines[16]?.trim() || "";
const rawDisoRDPbindRNAScore: string = lines[17]?.trim() || "";
const rawDRNApredRNA: string = lines[18]?.trim() || "";
const rawDRNApredRNAScore: string = lines[19]?.trim() || "";

const disoRDPbindRNA: number[] = rawDisoRDPbindRNA ? rawDisoRDPbindRNA.split('').map(Number) : [];
const disoRDPbindRNAScore: number[] = rawDisoRDPbindRNAScore.split(',').map(val => parseFloat(val));
const dRNApredRNA: number[] = rawDRNApredRNA ? rawDRNApredRNA.split('').map(Number) : [];
const dRNApredRNAScore: number[] = rawDRNApredRNAScore.split(',').map(val => parseFloat(val));


const disoRDPbindRNAColour: Segment[] = extractSegments(disoRDPbindRNA, 1, "orange");
const dRNApredRNAColour: Segment[] = extractSegments(dRNApredRNA, 1, "yellow");

// line data for disoRDPbindRNA Score
const disoRDPbindRNALines =  extractLines(disoRDPbindRNAScore);
const disoRDPbindRNASegment: Segment[] = extractScoreSegments(disoRDPbindRNAScore, 0, "#fcc006");
const mergedDisoRDPbindRNA: Segment[] = [
    ...disoRDPbindRNASegment.map(s => ({ ...s, color: "#fcc006"})),
];
const disoRDPbindRNAScoreData = lineColorSegments(disoRDPbindRNALines, mergedDisoRDPbindRNA);

// line data for dRNApredRNA Score
const dRNApredRNALines =  extractLines(dRNApredRNAScore);
const dRNApredRNASegment: Segment[] = extractScoreSegments(dRNApredRNAScore, 0, "#fdff38");
const mergedDRNApredRNA: Segment[] = [
    ...dRNApredRNASegment.map(s => ({ ...s, color: "#fdff38"})),
];
const dRNApredRNAScoreData = lineColorSegments(dRNApredRNALines, mergedDRNApredRNA);


window.onload = () => {
    let panels = new FeatureViewer(sequence, '#feature-viewer',

        {
            toolbar: true,
            toolbarPosition: 'left',
            brushActive: true,
            zoomMax: 7,
            flagColor: 'white',
            flagTrack: 155,
            flagTrackMobile: 155,
            sideBar: 225
        },
        [
            // ** RNA PANEL ** 
            { 
                type: 'rect', 
                id: 'DisoRDPbindRNA', 
                label: 'DisoRDPbind-RNA', 
                data: disoRDPbindRNAColour, 
                color: "#fcc006",
                sidebar: [
                    {
                        id: 'Header',
                        label: 'Header',
                        content: '<span style="font-size: .8125rem; font-family: sans-serif;">Click on Legend Item to Show/Hide</span>'
                    },
                    {
                        id: 'Sequence_Button',
                        label: 'Sequence Button',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 12px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 5px; height: 5px; background-color: black; border-radius: 50%; margin-right: 12px;"></span>
                            Sequence
                        </button>`
                    },
                    {
                        id: 'DisoRDPbindRNA_Button',
                        label: 'DisoRDPbind RNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fcc006; margin-right: 5px;"></span>
                            DisoRDPbind RNA Binding
                        </button>`
                    },
                    {
                        id: 'DRNApredRNA_Button',
                        label: 'DRNApred RNA binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fdff38; margin-right: 5px;"></span>
                            DRNApred RNA Binding
                        </button>`
                    },
                    {
                        id: 'DisoRDPbindRNA_Score_Button',
                        label: 'DisoRDPbind RNA Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #fcc006; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind RNA Score
                        </button>`
                    },
                    {
                        id: 'DRNApredRNA_Score_Button',
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
            { 
                type: 'rect', 
                id: 'DRNApredRNA', 
                label: 'DRNApred-RNA', 
                data: dRNApredRNAColour, 
                color: "#fdff38"
            },
            { 
                type: 'curve', 
                id: 'RNA_SCORES', 
                label: ' ', 
                color: ['#fcc006', '#fdff38'], 
                flag: 5,
                data: [disoRDPbindRNAScoreData, dRNApredRNAScoreData]
            }
        ]);

    panels.onButtonSelected((event) => {
    const buttonId = event.detail.id;

        const resetButtons = [
            'Native_Disorder_Button',
            'Putative_Disorder_Button',
            'Predictive_Disorder_Scores',
            'Native_RSA_Binary_Button',
            'Putative_Buried_Residue_Button',
            'ASA_SCORES_Native_Button',
            'ASA_SCORES_Predicted_Button',
            'Native_Sec_Struc_Unavailable_Button',
            'Native_Sec_Struc_Coil_Button',
            'Native_Sec_Struc_Helix_Button',
            'Native_Sec_Struc_Strand_Button',
            'Secondary_Struc_Score_Button',
            'DisoRDPbind_Binding_Button',
            'Scriber_Binding_Button',
            'MoRFchibi_Binding_Button',
            'DisoRDPbind_Score_Button',
            'Scriber_Score_Button',
            'MoRFchibi_Score_Button',
            'DisoRDPbindDNA_Button',
            'DRNApredDNA_Button',
            'DisoRDPbindDNA_Score_Button',
            'DRNApredDNA_Score_Button',
            'DisoRDPbindRNA_Button',
            'DRNApredRNA_Button',
            'DisoRDPbindRNA_Score_Button',
            'DRNApredRNA_Score_Button',
            'Signal_Peptide_Button',
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
            'Conservation_Score_Button',
            'Linker_Residues_Button',
            'Linker_Score_Button'
        ];

        if (resetButtons.includes(buttonId)) {
            //panels.resetAll();
            panels.featureToggle(buttonId);
            
        }

    });

};

