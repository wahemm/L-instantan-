export interface CoverTemplate {
  id: string;
  name: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  style: "bold" | "elegant" | "minimal";
}

export const COVER_TEMPLATES: CoverTemplate[] = [
  { id: "blanc",   name: "Blanc",   bgColor: "#ffffff", textColor: "#1e1e1e", accentColor: "#e5e7eb", style: "minimal"  },
  { id: "noir",    name: "Noir",    bgColor: "#0f172a", textColor: "#ffffff", accentColor: "#334155", style: "elegant"  },
  { id: "creme",   name: "Crème",   bgColor: "#f5e6d3", textColor: "#3d2b1f", accentColor: "#c4956a", style: "elegant"  },
  { id: "rose",    name: "Rose",    bgColor: "#fce7f3", textColor: "#831843", accentColor: "#f9a8d4", style: "bold"     },
  { id: "teal",    name: "Teal",    bgColor: "#0d9488", textColor: "#ffffff", accentColor: "#5eead4", style: "bold"     },
  { id: "golden",  name: "Doré",    bgColor: "#fef3c7", textColor: "#78350f", accentColor: "#f59e0b", style: "bold"     },
  { id: "lavande", name: "Lavande", bgColor: "#ede9fe", textColor: "#4c1d95", accentColor: "#a78bfa", style: "elegant"  },
  { id: "forest",  name: "Forêt",   bgColor: "#14532d", textColor: "#ffffff", accentColor: "#4ade80", style: "bold"     },
];
