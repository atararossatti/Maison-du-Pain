import { SLOGAN } from "@/config/brand";

/** Dados de contato mostrados em "Venha nos visitar". Um campo `null` aparece como "A definir". */
export const VISIT_INFO: { address: string | null; phone: string | null; hours: string | null } = {
  address: "Itapevi - SP",
  phone: "(11) 99446-2895",
  hours: "24 horas",
};

export const SHARE = { title: "Maison du Pain", text: `${SLOGAN} — uma jornada pela arte da padaria francesa.` } as const;