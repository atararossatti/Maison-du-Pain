import { useSyncExternalStore } from "react";

export type DeviceTier = "high" | "low";

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

function detectTier(): DeviceTier {
  const hints = navigator as Navigator & NavigatorHints;
  const fewCores = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 4;
  const lowMemory = hints.deviceMemory !== undefined && hints.deviceMemory <= 4;
  const saveData = hints.connection?.saveData === true;
  return fewCores || lowMemory || saveData ? "low" : "high";
}

// O valor não muda durante a sessão, então não há assinatura.
const noSubscription = () => () => {};

export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(noSubscription, detectTier, () => "high");
}