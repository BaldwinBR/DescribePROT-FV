import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";

// **ASA Panel Data**
const rawRSABinary: string = lines[32]?.trim() || "";
const rawRSAScore: string = lines[33]?.trim() || "";
const rawASABinary: string = lines[14]?.trim() || "";
const rawASAScore: string = lines[15]?.trim() || "";

const rsaBinary: number[] = rawRSABinary ? Array.from(rawRSABinary, Number) : [];
const rsaScore: number[] = rawRSAScore.trim().split(',').map(val => parseFloat(val));
const asaBinary: number[] = rawASABinary ? Array.from(rawASABinary, Number) : [];
const asaScore: number[] = rawASAScore.trim().split(',').map(val => parseFloat(val));


// **RSA panel**
const nativeRSABinaryColor: Segment[] = extractSegments(rsaBinary, 1, "#fc0080"); // assigned color for available RSA data
const nativeRSABinaryGrey: Segment[] = extractSegments(rsaBinary, 2, "grey"); // Grey for not available RSA data

// This is to plot the available and unavailable data at the same line
const mergedRSABinary: Segment[] = [
    ...nativeRSABinaryColor.map(s => ({ ...s, color: "#fc0080" })),
    ...nativeRSABinaryGrey.map(s => ({ ...s, color: "grey" }))
];

// line data for RSA Score
const rsaLines =  extractLines(rsaScore);
const rsaSegment: Segment[] = extractScoreSegments(rsaScore, 0, "#fc0080");
const mergedRSA: Segment[] = [
    ...rsaSegment.map(s => ({ ...s, color: "#fc0080"})),
];
const rsaScoreData = lineColorSegments(rsaLines, mergedRSA);

// line data for ASA Score
const asaLines =  extractLines(asaScore);
const asaSegment: Segment[] = extractScoreSegments(asaScore, 0, "#ffd2df");
const mergedASA: Segment[] = [
    ...asaSegment.map(s => ({ ...s, color: "#ffd2df"})),
];
const asaScoreData = lineColorSegments(asaLines, mergedASA);

// Extract ASA and RSA Binary Data
const buriedResiduesResults: Segment[] = extractSegments(asaBinary, 1, "#ffd2df");



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
            // ** ASA PANEL **
            {
                type: 'rect',
                id: 'Native_RSA_Binary',
                label: 'Native Buried Residues',
                data: mergedRSABinary,
                color: "black",
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
                        id: 'Native_RSA_Binary_Button',
                        label: 'Native RSA Binary Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #fc0080; margin-right: 5px;"></span>
                            Native Buried Residue
                        </button>`
                    },
                    {
                        id: 'Putative_Buried_Residue_Button',
                        label: 'Putative Buried Residue Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 10px; background-color: #ffd2df; margin-right: 5px;"></span>
                            Native Buried Residue
                        </button>`
                     },
                     {
                        id: 'ASA_SCORES_Native_Button',
                        label: 'ASA SCORES Native Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #fc0080; margin-right: 5px; vertical-align: middle;"></span>
                            Native Solvent Accesibility
                        </button>`
                    },
                    {
                        id: 'ASA_SCORES_Predicted_Button',
                        label: 'ASA SCORES Predicted Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none;">
                            <span style="display: inline-block; width: 10px; height: 2px; background-color: #ffd2df; margin-right: 5px; vertical-align: middle;"></span>
                            Predicted Solvent Accesibility
                        </button>`
                    }
                ]
            },
            {
                type: 'rect',
                id: 'Putative_Buried_Residue',
                label: 'Putative Buried Residue',
                data: buriedResiduesResults,
                color: 'black'
            },
            {
                type: 'curve',
                id: 'ASA_SCORES',
                label: ' ',
                color: ['#ffd2df', '#fc0080'],
                stroke: "black",
                flag: 2,
                data: [asaScoreData,  rsaScoreData]
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

