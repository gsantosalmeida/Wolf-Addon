import { ItemStack } from "@minecraft/server";

function getInventory(player) {
  return (
    player.getComponent("minecraft:inventory")?.container ||
    player.getComponent("inventory")?.container ||
    null
  );
}

/**
 * Conta quantos itens de um typeId o jogador possui no inventário.
 */
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

/**
 * Verifica se o jogador tem todos os ingredientes necessários.
 */
export function hasIngredients(player, ingredients) {
  for (const ing of ingredients) {
    if (countItem(player, ing.typeId) < ing.amount) {
      return false;
    }
  }
  return true;
}

/**
 * Consome os ingredientes do inventário.
 * Retorna true se conseguiu consumir tudo, false caso contrário.
 */
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

        if (item.amount === take) {
          inv.setItem(i, undefined);
        } else {
          item.amount -= take;
          inv.setItem(i, item);
        }
      }
    }
  }
  return true;
}

/**
 * Adiciona o item resultado ao inventário do jogador.
 * Se não couber, joga no chão.
 */
export function giveResult(player, result) {
  const inv = getInventory(player);
  if (!inv) return;

  const stack = new ItemStack(result.typeId, result.amount);
  const leftover = inv.addItem(stack);

  if (leftover) {
    player.dimension.spawnItem(leftover, player.location);
  }
}

/**
 * Gera o texto de status dos ingredientes (com cores).
 */
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
