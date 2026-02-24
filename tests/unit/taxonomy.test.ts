import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getCategoriasByEntrega,
  getEntregasPGD,
  getTaxonomy,
  getTaxonomyFromPath
} from "@/lib/taxonomy";

describe("taxonomy", () => {
  it("loads taxonomy with 18 categories", async () => {
    const taxonomy = await getTaxonomy();
    expect(taxonomy.categorias).toHaveLength(18);
  });

  it("gets entregas by category id", async () => {
    const entregas = await getEntregasPGD(1);
    expect(entregas.length).toBeGreaterThan(0);
  });

  it("gets categories by entrega id", async () => {
    const categorias = await getCategoriasByEntrega("pgd-trimestral-elaborado");
    expect(categorias).toContain(16);
  });

  it("returns empty array for non-existent category", async () => {
    const entregas = await getEntregasPGD(9999);
    expect(entregas).toEqual([]);
  });

  it("fails on invalid schema", async () => {
    const invalidPath = path.join(os.tmpdir(), "taxonomy.invalid.json");
    await fs.writeFile(invalidPath, JSON.stringify({ categorias: [{ categoryId: 1 }] }), "utf-8");

    await expect(getTaxonomyFromPath(invalidPath)).rejects.toBeTruthy();
  });
});
