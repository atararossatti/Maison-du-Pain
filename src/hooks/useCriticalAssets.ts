import { useEffect, useState } from "react";
import { CRITICAL_IMAGES, LOAD_TIMEOUT_MS } from "@/config/loading";

interface AssetTask {
  id: string;
  weight: number;
  run: () => Promise<void>;
}

export interface AssetProgress {
  /** Fração real (0–1) do peso das tarefas concluídas, falhas incluídas. */
  progress: number;
  failures: string[];
}

const whenFontsReady = () => document.fonts.ready.then(() => undefined);

const whenWindowLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((resolve) => window.addEventListener("load", () => resolve(), { once: true }));

const decodeImage = (src: string) =>
  new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
    image.src = src;
  });

function buildTasks(): AssetTask[] {
  return [
    { id: "fontes", weight: 2, run: whenFontsReady },
    { id: "documento", weight: 2, run: whenWindowLoaded },
    ...CRITICAL_IMAGES.map((src) => ({ id: src, weight: 1, run: () => decodeImage(src) })),
  ];
}

function withTimeout(task: Promise<void>, id: string) {
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`Tempo esgotado: ${id}`)), LOAD_TIMEOUT_MS);
    task.then(resolve, reject).finally(() => window.clearTimeout(timer));
  });
}

/**
 * Acompanha o carregamento real dos recursos essenciais. Uma falha não bloqueia a experiência:
 * a tarefa conta como concluída e o id é devolvido em `failures` para o loader degradar com elegância.
 */
export function useCriticalAssets(): AssetProgress {
  const [state, setState] = useState<AssetProgress>({ progress: 0, failures: [] });

  useEffect(() => {
    const tasks = buildTasks();
    const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
    let doneWeight = 0;
    const failures: string[] = [];
    let cancelled = false;

    const settle = (task: AssetTask, failed: boolean) => {
      if (cancelled) return;
      doneWeight += task.weight;
      if (failed) failures.push(task.id);
      setState({ progress: doneWeight / totalWeight, failures: [...failures] });
    };

    tasks.forEach((task) => {
      withTimeout(task.run(), task.id).then(
        () => settle(task, false),
        () => settle(task, true),
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}