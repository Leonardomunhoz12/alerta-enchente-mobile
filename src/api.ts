import regioesMock from "./mock/regioes.json";
import { Regiao } from "./types";

/**
 * Camada de dados do app.
 * - Se EXPO_PUBLIC_API_URL estiver definida, busca GET {url}/regioes.
 * - Se não estiver (ou se a rede falhar), usa o mock local, assim o app funciona offline.
 */
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Resultado = { regioes: Regiao[]; origem: "api" | "mock" };

export async function buscarRegioes(): Promise<Resultado> {
  if (API_URL) {
    try {
      const resp = await fetch(`${API_URL}/regioes`);
      if (resp.ok) {
        return { regioes: (await resp.json()) as Regiao[], origem: "api" };
      }
    } catch {
      // sem rede: cai no mock
    }
  }
  await new Promise((ok) => setTimeout(ok, 400)); // simula o tempo de uma chamada de rede
  return { regioes: regioesMock as Regiao[], origem: "mock" };
}

export async function buscarRegiao(id: string): Promise<Regiao | undefined> {
  const { regioes } = await buscarRegioes();
  return regioes.find((r) => r.id === id);
}
