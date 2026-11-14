import { TRABALHOS, slugDoTrabalho, ordemDosTrabalhos } from "./trabalhos.js";

export const trabalhos = ordemDosTrabalhos(TRABALHOS).map((t) => ({ ...t, slug: slugDoTrabalho(t), href: `/trabalhos/${slugDoTrabalho(t)}` }));

export const categorias = [...new Set(trabalhos.map((t) => t.categoria))];

/** Tipo e ano, quando houver ano. */
export const legenda = (t) => [t.tipo, t.ano].filter(Boolean).join(", ");
