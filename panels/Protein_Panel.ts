import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";

// **Protein Binding Data**
const rawDisoRDPbindBinary: string = lines[24]?.trim() || "";    
const rawScriberBinary: string = lines[26]?.trim() || "";  
const rawMorfChibiBinary: string = lines[28]?.trim() || "";  

const scriberBinary: number[] = rawScriberBinary ? Array.from(rawScriberBinary, Number) : [];
const disoRDPbindBinary: number[] = rawDisoRDPbindBinary ? Array.from(rawDisoRDPbindBinary, Number) : [];
const morfChibiBinary: number[] = rawMorfChibiBinary ? Array.from(rawMorfChibiBinary, Number) : [];

const disoRDPbindScore: number[] = lines[25].trim().split(',').map(val => parseFloat(val));
const scriberScore: number[] = lines[27].trim().split(',').map(val => parseFloat(val));
const morfChibiScore: number[] = lines[29].trim().split(',').map(val => parseFloat(val));

// **Protein Panel**
const disoRDPbindSegments: Segment[] = extractSegments(disoRDPbindBinary, 1, "#3d7afd");
const morfChibiSegments: Segment[] = extractSegments(morfChibiBinary, 1, "#01889f");
const scriberSegments: Segment[] = extractSegments(scriberBinary, 1, "#3b5b92");

// line data for disoRDPbind Score
const disoRDPbindLines =  extractLines(disoRDPbindScore);
const disoRDPbindSegment: Segment[] = extractScoreSegments(disoRDPbindScore, 0, "#3d7afd");
const mergeddisoRDPbind: Segment[] = [
    ...disoRDPbindSegment.map(s => ({ ...s, color: "#3d7afd"})),
];
const disoRDPbindScoreData = lineColorSegments(disoRDPbindLines, mergeddisoRDPbind);

// line data for scriber Score
const scriberLines =  extractLines(scriberScore);
const scriberSegment: Segment[] = extractScoreSegments(scriberScore, 0, "#3b5b92");
const mergedScriber: Segment[] = [
    ...scriberSegment.map(s => ({ ...s, color: "#3b5b92"})),
];
const scriberScoreData = lineColorSegments(scriberLines, mergedScriber);

// line data for morfChibi Score
const morfChibiLines =  extractLines(morfChibiScore);
const morfChibiSegment: Segment[] = extractScoreSegments(morfChibiScore, 0, "#01889f");
const mergedMorfChibi: Segment[] = [
    ...morfChibiSegment.map(s => ({ ...s, color: "#01889f"})),
];
const morfChibiScoreData = lineColorSegments(morfChibiLines, mergedMorfChibi);

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
            // ** PROTEIN PANEL **
            {
                type: 'rect',
                id: 'DisoRDPbind_Binding',
                label: 'DisoRDPbind-Protein',
                data: disoRDPbindSegments,
                color: '#3d7afd',
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
                        id: 'DisoRDPbind_Binding_Button',
                        label: 'DisoRDPbind Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3d7afd; margin-right: 5px;"></span>
                            DisoRDPbind Protein Binding
                        </button>`
                    }, 
                    {
                        id: 'Scriber_Binding_Button',
                        label: 'Scriber Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #3b5b92; margin-right: 5px;"></span>
                            SCRIBER Protein Binding
                        </button>`
                    },
                    {
                        id: 'MoRFchibi_Binding_Button',
                        label: 'MoRFchibi Binding Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #01889f; margin-right: 5px;"></span>
                            MoRFchibi Protein Binding
                        </button>`
                    },
                    {
                        id: 'DisoRDPbind_Score_Button',
                        label: 'DisoRDPbind Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3d7afd; margin-right: 5px; vertical-align: middle;"></span>
                            DisoRDPbind Score
                        </button>`
                    },
                    {
                        id: 'Scriber_Score_Button',
                        label: 'Scriber Score Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #3b5b92; margin-right: 5px; vertical-align: middle;"></span>
                            Scriber Score
                        </button>`
                    },
                    {
                        id: 'MoRFchibi_Score_Button',
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
            {
                type: 'rect',
                id: 'Scriber_Binding',
                label: 'SCRIBER',
                data: scriberSegments,
                color: '#3b5b92'
            },
            {
                type: 'rect',
                id: 'MoRFchibi_Binding',
                label: 'MoRFchibi',
                data: morfChibiSegments,
                color: '#01889f'
                
            },
            {
                type: 'curve',
                id: 'PROTEIN_SCORES',
                label: ' ',
                color: ['#3d7afd', '#3b5b92', '#01889f'],
                flag: 3,
                data:[disoRDPbindScoreData, scriberScoreData, morfChibiScoreData]
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

