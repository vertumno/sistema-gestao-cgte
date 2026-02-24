import fs from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { TaxonomyConfig } from "@/types/kanboard";

const taxonomyCategorySchema = z.object({
  categoryId: z.number().int().positive(),
  categoryName: z.string().min(1),
  area: z.enum(["Design", "Libras", "Audiovisual", "Gestao", "Transversal", "Uso controlado"]),
  entregasPGD: z.array(z.string().min(1))
});

const taxonomyConfigSchema = z.object({
  categorias: z.array(taxonomyCategorySchema).length(18)
});

export async function getTaxonomyFromPath(filePath: string): Promise<TaxonomyConfig> {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const parsedJson = JSON.parse(fileContent);
  return taxonomyConfigSchema.parse(parsedJson);
}

export async function getTaxonomy(): Promise<TaxonomyConfig> {
  const filePath = path.join(process.cwd(), "config", "taxonomy.json");
  return getTaxonomyFromPath(filePath);
}

export async function getEntregasPGD(categoryId: number): Promise<string[]> {
  const taxonomy = await getTaxonomy();
  const category = taxonomy.categorias.find((item) => item.categoryId === categoryId);
  return category?.entregasPGD ?? [];
}

export async function getCategoriasByEntrega(entregaId: string): Promise<number[]> {
  const taxonomy = await getTaxonomy();
  return taxonomy.categorias
    .filter((item) => item.entregasPGD.includes(entregaId))
    .map((item) => item.categoryId);
}
