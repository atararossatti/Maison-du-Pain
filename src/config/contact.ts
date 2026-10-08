/**
 * Maison du Pain é uma marca fictícia: nenhum endereço, telefone ou horário real foi inventado.
 * Quando houver dados reais, basta preenchê-los aqui; a interface já trata os dois casos.
 */
export const VISIT_INFO: { address: string | null; phone: string | null; hours: string | null } = {
  address: null,
  phone: null,
  hours: null,
};

export const SHARE = { title: "Maison du Pain", text: "Le bonheur se savoure — uma jornada pela arte da padaria francesa." } as const;