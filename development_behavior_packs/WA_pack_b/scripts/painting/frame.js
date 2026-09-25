import { world, system } from "@minecraft/server";
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
];


function openPaintingUI(player, entity) {
    const form = new ActionFormData()
        .title("§0Quadro de Pintura")
        .body("§8Escolha a pintura que deseja colocar no quadro:");

    for (const p of PAINTINGS) {
        form.button(p.name);
    }

    form.show(player).then((response) => {
        if (response.canceled || response.selection === undefined) {
            return;
        }

        const selected = PAINTINGS[response.selection];
        if (!selected) return;

        try {
            entity.setProperty("wolfaddon:painting_id", selected.id);
            player.playSound("random.orb");
        } catch (e) {
            console.warn("Erro ao setar painting_id:", e);
            player.sendMessage("§cErro ao aplicar a pintura.");
        }
    }).catch((err) => {
        console.warn("Erro ao abrir UI:", err);
        player.sendMessage("§cErro ao abrir a UI.");
    });
}

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    const player = event.player;
    const target = event.target;

    if (target.typeId !== "wolfaddon:painting_frame") return;

    event.cancel = true;

    system.run(() => {
        openPaintingUI(player, target);
    });
});
