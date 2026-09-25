import { world, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

const PAINTINGS = [
    { id: 0, name: "§1Smurf Azul", animated: false },
    { id: 1, name: "§1Pintinho", animated: false },
    { id: 2, name: "§1Pinguin", animated: false },
    { id: 3, name: "§1Cachorrin romantico", animated: false },
    { id: 4, name: "§1Gato mewing", animated: false },
    { id: 5, name: "§1Gato sorriso", animated: false },
    { id: 6, name: "§1Minion", animated: false },
    { id: 7, name: "§1Gato", animated: false },
    { id: 8, name: "§1Tenor GIF", animated: true },
    { id: 9, name: "§1Higuruma GIF", animated: true }
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
            entity.setProperty("wolfaddon:is_animated", selected.animated === true);
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
