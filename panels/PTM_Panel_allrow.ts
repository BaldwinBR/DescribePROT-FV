import { FeatureViewer } from "../FeatureViewerTypeScript/src/feature-viewer";
import { extractSegments, extractLines, Segment, extractScoreSegments, psipredRescaleScores, mmseqRescaleScores, lineColorSegments} from "../utils/utils";
import '../feature-constructor.scss';

declare var inputValues: string;

// Split lines into array
const lines: string[] = inputValues.split('\n');
const sequence: string = lines[1]?.trim() || "";


interface PTMEntry {
    // For plotting
    x: number;
    // PTM Type name (ex: Phosphorylation)
    type: string;
    color: string;
    stroke?: string;
    opacity?: number;
     // For stacking in fillSvg
    _stackY?: number;
}

const ptmTypes: Record<string, { type: string; color: string }> = {
    '1': { type: 'Phosphorylation', color: '#DC143C' },
    '2': { type: 'Glycosylation', color: '#1E90FF' },
    '3': { type: 'Ubiquitination', color: '#FF4500' },
    '4': { type: 'SUMOylation', color: '#C71585' },
    '5': { type: 'Acetyllysine', color: '#00CED1' },
    '6': { type: 'Methylation', color: '#DAA520' },
    '7': { type: 'Pyrrolidone carboxylic acid', color: '#228B22' },
    '8': { type: 'Palmitoylation', color: '#9932CC' },
    '9': { type: 'Hydroxylation', color: '#6A5ACD' },
};

// Parse PTM data from lines[] and return an array of PTMEntry
function parsePTMPanel(lines: string[]): PTMEntry[] {
    const ptmEntries: PTMEntry[] = [];

    // PTM data starts from line 34
    for (let i = 34; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const [ptmID, binaryString] = line.split(',', 2);
        const meta = ptmTypes[ptmID];

        if (!meta || !binaryString) continue;

        // For each position where PTM exists (non-zero), create PTMEntry
        for (let j = 0; j < binaryString.length; j++) {
            if (binaryString[j] !== '0') {
                ptmEntries.push({
                    x: j + 1,
                    type: meta.type,
                    color: meta.color
                });
            }
        }
    }

    return ptmEntries;
}

// Assign _stackY value for PTMs at the same position to stack them vertically
function stackPTMEntries(entries: PTMEntry[]): PTMEntry[] {
    const stackMap = new Map<number, number>();
    const spacing = 1;

    for (const entry of entries) {
        const count = stackMap.get(entry.x) ?? 0;
        entry._stackY = spacing * count;
        stackMap.set(entry.x, count + 1);
    }

    return entries;
}

// Compute maximum number of stacked PTMs for dynamic panel height adjustment
function computeMaxStack(entries: PTMEntry[]): number {
    const stackMap = new Map<number, number>();

    for (const entry of entries) {
        const count = stackMap.get(entry.x) || 0;
        stackMap.set(entry.x, count + 1);
    }

    const maxStack = Math.max(...stackMap.values());
    return maxStack;
}

// Raw PTM data
const ptmEntries = parsePTMPanel(lines);
// Add _stackY for drawing
const ptmStacked = stackPTMEntries(ptmEntries);
// For dynamic line height
const ptmMaxStackSize = computeMaxStack(ptmEntries);


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
            // ** PTM PANEL **
            {
                type: 'ptmTriangle',
                id: 'PTM_Sites',
                label: 'PTM Sites',
                data: ptmStacked,
                color: 'black',
                maxStackSize: ptmMaxStackSize,
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
                        id: 'PTM_Phophorylation_Button',
                        label: 'PTM Phophorylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DC143C; margin-right: 5px;"></span>
                            Phophorylation
                        </button>`
                    },
                    {
                        id: 'PTM_Glycosylation_Button',
                        label: 'PTM Glycosylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #1E90FF; margin-right: 5px;"></span>
                            Glycosylation
                        </button>`
                    },
                    {
                        id: 'PTM_Ubiquitination_Button',
                        label: 'PTM Ubiquitination Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #FF4500; margin-right: 5px;"></span>
                            Ubiquitination
                        </button>`
                    },
                    {
                        id: 'PTM_SUMOylation_Button',
                        label: 'PTM SUMOylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #C71585; margin-right: 5px;"></span>
                            SUMOylation
                        </button>`
                    },
                    {
                        id: 'PTM_Acetyllysine_Button',
                        label: 'PTM Acetyllysine Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #00CED1; margin-right: 5px;"></span>
                            Acetyllysine
                        </button>`
                    },
                    {
                        id: 'PTM_Methylation_Button',
                        label: 'PTM Methylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #DAA520; margin-right: 5px;"></span>
                            Methylation
                        </button>`
                    },
                    {
                        id: 'PTM_Pyrrolidone_carboxylic_acid_Button',
                        label: 'PTM Pyrrolidone carboxylic acid Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #228B22; margin-right: 5px;"></span>
                            Pyrrolidone carboxylic acid
                        </button>`
                    },
                    {
                        id: 'PTM_Palmitoylation_Button',
                        label: 'PTM Palmitoylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #9932CC; margin-right: 5px;"></span>
                            Palmitoylation
                        </button>`
                    },
                    {
                        id: 'PTM_Hydroxylation_Button',
                        label: 'PTM Hydroxylation Button',
                        tooltip: 'Click to Turn Off Line',
                        content: `
                        <button class="btn" style="background-color: transparent; border: none; padding: 5px 10px; cursor: pointer; outline: none; display: flex; align-items: center;">
                            <span style="display: inline-block; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 10px solid #6A5ACD; margin-right: 5px;"></span>
                            Hydroxylation
                        </button>`
                    }
                    
                ]
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

