import { world, system } from "@minecraft/server";
import { openArcaneTable } from "../others/ui/arcane_ui.js";

const MESA_ID = "wolfaddon:mesa_arcana";

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  if (event.block?.typeId !== MESA_ID) return;
  event.cancel = true;

  // Segurar o botão de usar dispara o evento várias vezes seguidas.
  // Só o primeiro da sequência deve abrir a mesa.
  if (!event.isFirstEvent) return;

  const player = event.player;
  system.run(() => openArcaneTable(player));
});