import { world, system, BlockPermutation } from "@minecraft/server";

const CHISEL_MAP = {
    "minecraft:stone": "minecraft:stone_bricks",
    "minecraft:cobblestone": "minecraft:mossy_cobblestone",
    "minecraft:deepslate": "minecraft:polished_deepslate"
};

world.afterEvents.itemUse.subscribe((event) => {
    const player = event.source;
    const item = event.itemStack;

    if (!item || item.typeId !== "wolfaddon:chisel") return;

    const hit = player.getBlockFromViewDirection({ maxDistance: 8 });
    if (!hit || !hit.block) {
        return;
    }

    const block = hit.block;
    const originalId = block.typeId;
    const newBlockId = CHISEL_MAP[originalId];

    if (!newBlockId) {
        return;
    }

    system.run(() => {
        try {
            block.setPermutation(BlockPermutation.resolve(newBlockId));
            player.playSound("dig.stone", { location: block.location });
        } catch (e) {
            console.log(e);
        }
    });
});