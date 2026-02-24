export type KanboardTask = {
  id: number | string;
  title: string;
  category_id?: number | string;
  column_id?: number | string;
  column_name?: string;
  owner_id?: number | string;
  project_id?: number | string;
};

export type KanboardCategory = {
  id: number | string;
  name: string;
  project_id?: number | string;
};

export type KanboardProject = {
  id: number | string;
  name: string;
};

export type KanboardSubtask = {
  id: number | string;
  title: string;
  task_id: number | string;
};

export type TaxonomyCategory = {
  categoryId: number;
  categoryName: string;
  area: "Design" | "Libras" | "Audiovisual" | "Gestao" | "Transversal" | "Uso controlado";
  entregasPGD: string[];
};

export type TaxonomyConfig = {
  categorias: TaxonomyCategory[];
};
