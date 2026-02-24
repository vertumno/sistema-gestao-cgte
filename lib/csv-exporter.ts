export function generateCsv(sections: { title: string; rows: Array<Record<string, string | number>> }[]): string {
  const chunks: string[] = ["\uFEFF"];

  sections.forEach((section, sectionIndex) => {
    chunks.push(`${section.title}\n`);

    const columns = section.rows.length > 0 ? Object.keys(section.rows[0]) : ["Item", "Quantidade"];
    chunks.push(`${columns.join(",")}\n`);

    section.rows.forEach((row) => {
      const line = columns
        .map((column) => {
          const value = String(row[column] ?? "").replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(",");
      chunks.push(`${line}\n`);
    });

    if (sectionIndex < sections.length - 1) {
      chunks.push("\n");
    }
  });

  return chunks.join("");
}