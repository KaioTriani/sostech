import {
  BatteryCharging,
  CircuitBoard,
  HelpCircle,
  Laptop,
  PlugZap,
  Power,
  ScanSearch,
  Smartphone,
  SmartphoneNfc,
  Tablet,
  Volume2,
  Wrench,
  Cog,
  type LucideProps,
} from "lucide-react";

const map = {
  screen: SmartphoneNfc,
  battery: BatteryCharging,
  chip: CircuitBoard,
  plug: PlugZap,
  phone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  scan: ScanSearch,
  wrench: Wrench,
  power: Power,
  audio: Volume2,
  software: Cog,
  help: HelpCircle,
} as const;

export type IconName = keyof typeof map;

export function ServiceIcon({ name, ...p }: { name: IconName } & LucideProps) {
  const I = map[name] ?? Wrench;
  return <I strokeWidth={1.6} {...p} />;
}
