import { ItemStack } from "@minecraft/server";

function getInventory(player) {
  return (
    player.getComponent("minecraft:inventory")?.container ||
    player.getComponent("inventory")?.container ||
    null
  );
}

export function countItem(player, typeId) {
  let count = 0;
  const inv = getInventory(player);
  if (!inv) return 0;

  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (item && item.typeId === typeId) {
      count += item.amount;
    }
  }
  return count;
}

export function hasIngredients(player, ingredients) {
  for (const ing of ingredients) {
    if (countItem(player, ing.typeId) < ing.amount) {
      return false;
    }
  }
  return true;
}

export function consumeItems(player, ingredients) {
  if (!hasIngredients(player, ingredients)) return false;

  const inv = getInventory(player);
  if (!inv) return false;

  for (const ing of ingredients) {
    let remaining = ing.amount;

    for (let i = 0; i < inv.size && remaining > 0; i++) {
      const item = inv.getItem(i);
      if (item && item.typeId === ing.typeId) {
        const take = Math.min(item.amount, remaining);
        remaining -= take;

        if (item.amount <= take) {
          inv.setItem(i, undefined);
        } else {
          // ItemStack pode ser imutável em versões novas
          const updated = item.clone();
          updated.amount = item.amount - take;
          inv.setItem(i, updated);
        }
      }
    }
  }
  return true;
}

/**
 * Entrega o item fabricado.
 * Tenta inventário → chão → comando /give (fallback).
 */
export function giveResult(player, result) {
  const typeId = result.typeId;
  const amount = result.amount ?? 1;

  // 1) Tenta colocar no inventário
  try {
    const inv = getInventory(player);
    const stack = new ItemStack(typeId, amount);

    if (inv) {
      const leftover = inv.addItem(stack);
      if (!leftover) {
        return true; // entrou tudo
      }
      // sobrou → joga no chão
      player.dimension.spawnItem(leftover, player.location);
      return true;
    }

    player.dimension.spawnItem(stack, player.location);
    return true;
  } catch (e) {
    console.warn("[Mesa Arcana] addItem falhou: " + e);
  }

  // 2) Fallback: spawn no chão
  try {
    const stack = new ItemStack(typeId, amount);
    player.dimension.spawnItem(stack, player.location);
    return true;
  } catch (e) {
    console.warn("[Mesa Arcana] spawnItem falhou: " + e);
  }

  // 3) Último recurso: comando give
  try {
    player.runCommand(`give @s ${typeId} ${amount}`);
    return true;
  } catch (e) {
    console.error("[Mesa Arcana] give falhou: " + e);
    return false;
  }
}

export function getIngredientsStatusText(player, ingredients) {
  let text = "";
  for (const ing of ingredients) {
    const has = countItem(player, ing.typeId);
    const color = has >= ing.amount ? "§a" : "§c";
    const display = ing.display || ing.typeId.replace("minecraft:", "");
    text += `${color}${has}/${ing.amount} ${display}\n`;
  }
  return text.trim();
}