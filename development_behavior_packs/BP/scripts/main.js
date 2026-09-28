import { world, system } from "@minecraft/server";
import { openArcaneTable } from "./ui/arcane_ui.js";

function registerBlockInteract() {
  if (world.beforeEvents?.playerInteractWithBlock) {
    world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
      const { player, block } = event;
      if (event.isFirstEvent === false) return;

      if (block?.typeId === "arcane:mesa_arcana") {
        event.cancel = true;
        // Pequeno delay garante que o cancel processou antes de abrir a UI
        system.runTimeout(() => {
          try {
            openArcaneTable(player);
          } catch (e) {
            console.error("[Mesa Arcana] Erro ao abrir UI: " + e);
            player.sendMessage("§c[Mesa Arcana] Erro ao abrir a interface. Veja o log.");
          }
        }, 1);
      }
    });
    return;
  }

  if (world.afterEvents?.playerInteractWithBlock) {
    world.afterEvents.playerInteractWithBlock.subscribe((event) => {
      const { player, block } = event;
      if (block?.typeId === "arcane:mesa_arcana") {
        system.run(() => {
          try {
            openArcaneTable(player);
          } catch (e) {
            console.error("[Mesa Arcana] Erro ao abrir UI: " + e);
            player.sendMessage("§c[Mesa Arcana] Erro ao abrir a interface.");
          }
        });
      }
    });
  }
}

function registerChatCommand() {
  if (world.beforeEvents?.chatSend) {
    world.beforeEvents.chatSend.subscribe((event) => {
      const message = event.message?.trim?.().toLowerCase?.() ?? "";
      if (message === "!mesa") {
        event.cancel = true;
        system.run(() => openArcaneTable(event.sender));
      }
    });
    return;
  }

  if (world.afterEvents?.chatSend) {
    world.afterEvents.chatSend.subscribe((event) => {
      const message = event.message?.trim?.().toLowerCase?.() ?? "";
      if (message === "!mesa") {
        system.run(() => openArcaneTable(event.sender));
      }
    });
  }
}

function onReady() {
  registerBlockInteract();
  registerChatCommand();
  console.warn("[Mesa Arcana] Addon carregado com sucesso!");
}

if (world.afterEvents?.worldLoad) {
  world.afterEvents.worldLoad.subscribe(onReady);
} else if (world.afterEvents?.worldInitialize) {
  world.afterEvents.worldInitialize.subscribe(onReady);
} else {
  system.run(onReady);
}
