import { world, system } from "@minecraft/server";
import { openArcaneTable, isUiLocked } from "../others/ui/arcane_ui.js";

const MESA_ID = "wolfaddon:mesa_arcana";

function tryOpen(player) {
  if (!player) return;
  if (isUiLocked(player)) return; // não abre de novo se já tem menu

  system.run(() => {
    try {
      openArcaneTable(player);
    } catch (e) {
      console.error("[Mesa Arcana] " + e);
      player.sendMessage("§c[Mesa Arcana] Erro: " + String(e));
    }
  });
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
  if (event.block?.typeId !== MESA_ID) return;
  event.cancel = true;
  tryOpen(event.player);
});