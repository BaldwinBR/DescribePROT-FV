
type PanelData = Record<string, any>;
let lines: string[] = [];

let rawData = {
    sequence: lines[1] || "",
    rawVSLBinary: lines[2] || "",
    rawVSLScore: lines[3] || "",
    rawPsiPredBinarylines: lines[4] || "",
    rawHelixScore: lines[5] || "",
    rawStrandScore: lines[6] || "",
    rawCoilScore: lines[7] || "",
    rawmmseqBinary:  lines[8] || "",
    rawmmseqScore:  lines[9] || "",
    rawSignalPeptideBinary:  lines[10] || "",
    rawSignalPeptideScore:  lines[11] || "",
    rawLinkerBinary:  lines[12] || "",
    rawLinkerScore:  lines[13] || "",
    rawASABinary:  lines[14] || "",
    rawASAScore:  lines[15] || "",
    rawDisoRDPbindRNA:  lines[16] || "",
    rawDisoRDPbindRNAScore:  lines[17] || "",
    rawDRNApredRNA:  lines[18] || "",
    rawDRNApredRNAScore:  lines[19] || "",
    rawDisoRDPbindDNA:  lines[20] || "",
    rawDisoRDPbindDNAScore:  lines[21] || "",
    rawDRNApredDNA:  lines[22] || "",
    rawDRNApredDNAScore:  lines[23] || "",
    rawDisoRDPbindBinary:  lines[24] || "", 
    disoRDPbindScore: lines[25] || "",
    rawScriberBinary:  lines[26] || "", 
    scriberScore: lines[27]|| "",
    rawMorfChibiBinary:  lines[28] || "", 
    morfChibiScore: lines[29]|| "",
    rawDisorderBinary:  lines[30] || "",
    rawSECSSBinary:  lines[31] || "",
    rawRSABinary:  lines[32] || "",
    rawRSAScore: lines[33] || "",
  };

const panelExtractors: Record<string, () => PanelData> = {
  Disorder_Panel: () => ({
    disorderBinary: getBinaryArray(lines[30]),
    vslBinary: getBinaryArray(lines[2]),
    vslScore: getScoreArray(lines[3]),
  })
  };

const getBinaryArray = (line: string | undefined): number[] =>
  line?.trim().split('').map(Number) || [];

const getScoreArray = (line: string | undefined): number[] =>
  line?.trim().split(',').map(parseFloat) || [];



export function initialize(inputValues: string) {
  lines = inputValues.split('\n').map((line) => line.trim());
  // Return Sequence as that is panel agnostic
  return lines[1] || "";
}
export function getPanelData(panelName: string): PanelData | undefined {
    return panelExtractors[panelName]?.();
}