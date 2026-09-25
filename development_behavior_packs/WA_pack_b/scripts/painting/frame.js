import { world, system, BlockPermutation } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const PAINTINGS = [
    { id: 0, name: "§1Smurf Azul" },
    { id: 1, name: "§1Pintinho" },
    { id: 2, name: "§1Pinguin" },
    { id: 3, name: "§1Cachorrin romantico" },
    { id: 4, name: "§1Gato mewing" },
    { id: 5, name: "§1Gato sorriso" },
    { id: 6, name: "§1Minion" },
    { id: 7, name: "§1Gato" },
    { id: 8, name: "§dTenor GIF" },
    { id: 9, name: "§dHiguruma GIF" }
];

function openPaintingUI(player, block) {
    const form = new ActionFormData()
        .title("§0Quadro de Pintura")
        .body("§8Escolha a pintura:");

    for (const p of PAINTINGS) {
        form.button(p.name);
    }

    form.show(player).then((response) => {
        if (response.canceled || response.selection === undefined) return;

        const selected = PAINTINGS[response.selection];
        if (!selected) return;

        system.run(() => {
            try {
                const perm = BlockPermutation.resolve("wolfaddon:painting_frame", {
                    "wolfaddon:painting_id": selected.id,
                    "minecraft:cardinal_direction": block.permutation.getState("minecraft:cardinal_direction")
                });
                block.setPermutation(perm);
                player.playSound("random.orb");
            } catch (e) {
                console.warn("Erro ao trocar pintura:", e);
                player.sendMessage("§cErro ao aplicar a pintura.");
            }
        });
    });
}

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { player, block, isFirstEvent } = event;

    if (block.typeId !== "wolfaddon:painting_frame") return;
    if (!isFirstEvent) return;

    // Só abre UI se estiver de mãos vazias (opcional)
    const item = player.getComponent("minecraft:equippable")?.getEquipment("Mainhand");
    if (item) return;

    event.cancel = true;

    system.run(() => {
        openPaintingUI(player, block);
    });
});