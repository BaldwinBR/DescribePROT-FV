type PanelData = Record<string, any>

type DataType = 'string' | 'binary' | 'score';
interface FieldType {
  index: number;
  type: DataType;
}

export class PanelDataService {
  private formattedData: Record<string, any> = {};

  // Configuration for data fields
  private fieldMap: Record<string, FieldType> = {
    sequence: { index: 1, type: "string" },
    vslBinary: { index: 2, type: "binary" },
    vslScore: { index: 3, type: "score" },
    psiPredBinary: { index: 4, type: "binary" },
    helixScore: { index: 5, type: "score" },
    strandScore: { index: 6, type: "score" },
    coilScore: { index: 7, type: "score" },
    mmseqBinary: { index: 8, type: "binary" },
    mmseqScore: { index: 9, type: "score" },
    signalPeptideBinary: { index: 10, type: "binary" },
    signalPeptideScore: { index: 11, type: "score" },
    linkerBinary: { index: 12, type: "binary" },
    linkerScore: { index: 13, type: "score" },
    asaBinary: { index: 14, type: "binary" },
    asaScore: { index: 15, type: "score" },
    disoRDPbindRNA: { index: 16, type: "binary" },
    disoRDPbindRNAScore: { index: 17, type: "score" },
    drnaPredRNA: { index: 18, type: "binary" },
    drnaPredRNAScore: { index: 19, type: "score" },
    disoRDPbindDNA: { index: 20, type: "binary" },
    disoRDPbindDNAScore: { index: 21, type: "score" },
    drnaPredDNA: { index: 22, type: "binary" },
    drnaPredDNAScore: { index: 23, type: "score" },
    disoRDPbindBinary: { index: 24, type: "binary" },
    disoRDPbindScore: { index: 25, type: "score" },
    scriberBinary: { index: 26, type: "binary" },
    scriberScore: { index: 27, type: "score" },
    morfChibiBinary: { index: 28, type: "binary" },
    morfChibiScore: { index: 29, type: "score" },
    disorderBinary: { index: 30, type: "binary" },
    secssBinary: { index: 31, type: "binary" },
    rsaBinary: { index: 32, type: "binary" },
    rsaScore: { index: 33, type: "score" },
    ptm_entry1: {index: 34, type: "string"},
    ptm_entry2: {index: 35, type: "string"},
    ptm_entry3: {index: 36, type: "string"},
    ptm_entry4: {index: 37, type: "string"},
    ptm_entry5: {index: 38, type: "string"},
    ptm_entry6: {index: 39, type: "string"},
    ptm_entry7: {index: 40, type: "string"},
    ptm_entry8: {index: 41, type: "string"},
    ptm_entry9: {index: 42, type: "string"},
  };

  // Describes which fields belong to which panel type
  private panelFields: Record<string, string[]> = {
    ASA_Panel: ['rsaBinary', 'rsaScore', 'asaBinary', 'asaScore'],
    Conservation_Panel: ['mmseqBinary', 'mmseqScore'],
    Disorder_Panel: ['disorderBinary', 'vslBinary', 'vslScore'],
    DNA_Panel: ['disoRDPbindDNA', 'drnaPredDNA', 'disoRDPbindDNAScore', 'drnaPredDNAScore'],
    Linker_Panel: ['linkerBinary', 'linkerScore'],
    Main_Panel: [],
    RNA_Panel: ['disoRDPbindRNA', 'drnaPredRNA', 'disoRDPbindRNAScore', 'drnaPredRNAScore'],
    SignalP_Panel: ['signalPeptideBinary', 'signalPeptideScore'],
    SS_Panel: ['secssBinary', 'psiPredBinary', 'strandScore', 'helixScore', 'coilScore'],
    Protein_Panel: ['disoRDPbindBinary', 'scriberBinary', 'morfChibiBinary', 'disoRDPbindScore', 'scriberScore', 'morfChibiScore'],
    PTM_Panel_allrow: ['ptm_entry1', 'ptm_entry2', 'ptm_entry3', 'ptm_entry4', 'ptm_entry5', 'ptm_entry6',  'ptm_entry7', 'ptm_entry8', 'ptm_entry9'],
  };

  // Formats Binary Arrays
  private getBinaryArray(line: string | undefined): number[] {
    return line?.split('').map(Number) || [];
  }

  // Formats Score Arrays
  private getScoreArray(line: string | undefined): number[] {
    return line?.split(',').map(parseFloat) || [];
  }

  // Pre-processes all data when called
  public initialize(input: string): void {
    const lines = input.split('\n').map((line) => line.trim());

    const data: Record<string, any> = {};

    for (const [key, { index, type }] of Object.entries(this.fieldMap)) {
      const line = lines[index];

      if (type === 'binary') {
        data[key] = this.getBinaryArray(line);
      } else if (type === 'score') {
        data[key] = this.getScoreArray(line);
      } else {
        data[key] = line || ""; //Sequence Data
      }
    }
    
    this.formattedData = data;
  }

  // Returns fields associated with provided panel name
  public getPanelData(panelName: string): PanelData | undefined {
    const fields = this.panelFields[panelName];
    const result: Record<string, any> = {};
    
    if (fields) {

      // Always return sequence to panel
      result['sequence'] = this.formattedData['sequence'];

      for (const key of fields) {
        result[key] = this.formattedData[key];
      }

      return result;
    }
  }
}
