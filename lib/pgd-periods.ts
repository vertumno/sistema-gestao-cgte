const TRIMESTERS = [
  { key: "Dez-Fev", months: [11, 0, 1] },
  { key: "Mar-Mai", months: [2, 3, 4] },
  { key: "Jun-Ago", months: [5, 6, 7] },
  { key: "Set-Nov", months: [8, 9, 10] }
] as const;

export function getCurrentTrimesterLabel(now: Date): string {
  const month = now.getMonth();
  const year = now.getFullYear();

  if (month <= 1) {
    return `Dez-Fev/${year}`;
  }
  if (month <= 4) {
    return `Mar-Mai/${year}`;
  }
  if (month <= 7) {
    return `Jun-Ago/${year}`;
  }
  if (month <= 10) {
    return `Set-Nov/${year}`;
  }
  return `Dez-Fev/${year + 1}`;
}

export function getTrimesterDates(trimestre: string): { startDate: Date; endDate: Date } {
  const match = trimestre.match(/^(Dez-Fev|Mar-Mai|Jun-Ago|Set-Nov)\/(\d{4})$/);
  if (!match) {
    throw new Error("Trimestre invalido");
  }

  const label = match[1];
  const year = Number(match[2]);

  if (label === "Dez-Fev") {
    return {
      startDate: new Date(year - 1, 11, 1, 0, 0, 0, 0),
      endDate: new Date(year, 1 + 1, 0, 23, 59, 59, 999)
    };
  }

  if (label === "Mar-Mai") {
    return {
      startDate: new Date(year, 2, 1, 0, 0, 0, 0),
      endDate: new Date(year, 4 + 1, 0, 23, 59, 59, 999)
    };
  }

  if (label === "Jun-Ago") {
    return {
      startDate: new Date(year, 5, 1, 0, 0, 0, 0),
      endDate: new Date(year, 7 + 1, 0, 23, 59, 59, 999)
    };
  }

  return {
    startDate: new Date(year, 8, 1, 0, 0, 0, 0),
    endDate: new Date(year, 10 + 1, 0, 23, 59, 59, 999)
  };
}

export function getAvailableTrimesterLabels(now: Date, yearsBack = 2, yearsAhead = 1): string[] {
  const labels: string[] = [];
  const startYear = now.getFullYear() - yearsBack;
  const endYear = now.getFullYear() + yearsAhead;

  for (let year = endYear; year >= startYear; year -= 1) {
    TRIMESTERS.forEach((trimester) => {
      labels.push(`${trimester.key}/${year}`);
    });
  }

  return labels;
}

export function getTrimesterSlug(trimestre: string): string {
  return trimestre
    .toLowerCase()
    .replace("/", "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace("dez-fev", "dez-fev")
    .replace("mar-mai", "mar-mai")
    .replace("jun-ago", "jun-ago")
    .replace("set-nov", "set-nov");
}