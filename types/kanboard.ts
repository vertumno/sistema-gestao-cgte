export type KanboardTask = {
  id: number | string;
  title: string;
  category_id?: number | string;
  column_id?: number | string;
  column_name?: string;
  owner_id?: number | string;
  assignee_id?: number | string;
  project_id?: number | string;
  date_creation?: number | string;
  date_modification?: number | string;
  date_completed?: number | string;
  /** Marcado internamente: 1=aberta, 0=fechada (vem do status_id do fetch) */
  _is_active?: 0 | 1;
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
  status?: number | string;
  state?: number | string;
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