import * as XLSX from 'xlsx';
import type { ParsedTemplate, TemplateColumn, TemplateSection, MasterData } from './types';

const SECTION_KEYWORDS = ['Business', 'Discoverability', 'Sizing', 'Imagery'];

export function parseTemplate(buffer: ArrayBuffer, fileName: string): ParsedTemplate {
  const workbook = XLSX.read(buffer, { type: 'array' });
  const dataSheetName = workbook.SheetNames.find((n) => !n.startsWith('__') && n !== 'masterdata');
  if (!dataSheetName) throw new Error('No data sheet found in template');

  const dataSheet = workbook.Sheets[dataSheetName];
  const masterSheet = workbook.Sheets['masterdata'];
  const version = extractVersion(dataSheet);
  const sections = extractSections(dataSheet);
  const columns = extractColumns(dataSheet, sections);
  const masterData = masterSheet ? extractMasterData(masterSheet) : emptyMaster();

  return { fileName, version, category: dataSheetName, sections, columns, masterData, maxRows: 1600 };
}

function extractVersion(s: XLSX.WorkSheet): string {
  const c = s['A1'];
  return c && typeof c.v === 'string' && c.v.startsWith('Version') ? c.v.replace('Version : ', 'v') : 'unknown';
}

function extractSections(s: XLSX.WorkSheet): TemplateSection[] {
  const range = XLSX.utils.decode_range(s['!ref'] || 'A1');
  const sections: TemplateSection[] = [];
  let cur: Partial<TemplateSection> | null = null;
  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = s[XLSX.utils.encode_cell({ r: 1, c })];
    if (cell?.v) {
      if (cur) { cur.endCol = c - 1; sections.push(cur as TemplateSection); }
      cur = { name: matchSec(String(cell.v)), startCol: c, endCol: range.e.c, columns: [] };
    }
  }
  if (cur) { cur.endCol = range.e.c; sections.push(cur as TemplateSection); }
  return sections;
}

function matchSec(v: string): string {
  for (const k of SECTION_KEYWORDS) if (v.toLowerCase().includes(k.toLowerCase())) return k;
  return v.substring(0, 50);
}

function extractColumns(s: XLSX.WorkSheet, sections: TemplateSection[]): TemplateColumn[] {
  const range = XLSX.utils.decode_range(s['!ref'] || 'A1');
  const cols: TemplateColumn[] = [];
  const mandatory = ['styleid','vendorskucode','vendorarticlenumber','vendorarticlename','brand','country of origin','articletype','brand size','standard size','mrp','agegroup','prominent colour','fashiontype','usage','year','season','productdisplayname','front image'];
  const dropdown = ['brand','country of origin','articletype','standard size','agegroup','prominent colour','fashiontype','usage','year','season'];

  for (let c = range.s.c; c <= range.e.c; c++) {
    const cell = s[XLSX.utils.encode_cell({ r: 2, c })];
    if (cell?.v) {
      const name = String(cell.v);
      const sec = sections.find((sc) => c >= sc.startCol && c <= sc.endCol);
      cols.push({ index: c, name, section: sec?.name || 'Unknown', isMandatory: mandatory.includes(name.toLowerCase()), hasDropdown: dropdown.includes(name.toLowerCase()) });
    }
  }
  sections.forEach((sc) => { sc.columns = cols.filter((c) => c.index >= sc.startCol && c.index <= sc.endCol); });
  return cols;
}

function extractMasterData(s: XLSX.WorkSheet): MasterData {
  const range = XLSX.utils.decode_range(s['!ref'] || 'A1');
  const data = emptyMaster();
  const hdr: Record<number, string> = {};
  for (let c = range.s.c; c <= range.e.c; c++) { const cell = s[XLSX.utils.encode_cell({ r: 0, c })]; if (cell?.v) hdr[c] = String(cell.v); }
  const map: Record<string, keyof MasterData> = { Brand:'brands', CountryOfOrigin:'countries', ArticleType:'articleTypes', sizemyntra_sizefrgf:'sizes', AgeGroup:'ageGroups', Colour:'colors', FashionType:'fashionTypes', Usage:'usageTypes', Year:'years', Season:'seasons' };
  for (let c = range.s.c; c <= range.e.c; c++) {
    const f = hdr[c] ? map[hdr[c]] : undefined;
    if (!f) continue;
    const vals = new Set<string>();
    for (let r = 1; r <= range.e.r; r++) { const cell = s[XLSX.utils.encode_cell({ r, c })]; if (cell?.v != null && String(cell.v).trim()) vals.add(String(cell.v).trim()); }
    data[f] = Array.from(vals).sort();
  }
  return data;
}

function emptyMaster(): MasterData {
  return { brands:[], colors:[], seasons:[], years:[], ageGroups:[], fashionTypes:[], usageTypes:[], sizes:[], countries:[], articleTypes:[] };
}
