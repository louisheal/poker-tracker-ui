const categoryColors: Record<string, string> = {
  Red: "#b3261e",
  Blue: "#1565c0",
  Green: "#2e7d32",
  Purple: "#7b1fa2",
};

export const getHandLabelColor = (category: string): string => categoryColors[category] ?? "#616161";
