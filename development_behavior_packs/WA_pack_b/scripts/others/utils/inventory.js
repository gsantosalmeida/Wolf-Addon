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

/**
 * Varre o inventário UMA vez e devolve um Map: typeId -> quantidade total.
 * Use isso quando precisar checar várias receitas de uma vez (ex.: uma lista).
 */
export function getInventoryCounts(player) {
  const counts = new Map();
  const inv = getInventory(player);
  if (!inv) return counts;

  for (let i = 0; i < inv.size; i++) {
    const item = inv.getItem(i);
    if (item) {
      counts.set(item.typeId, (counts.get(item.typeId) ?? 0) + item.amount);
    }
  }
  return counts;
}

// 'counts' é opcional: sem ele, conta o inventário na hora (comportamento antigo)
function amountOf(player, typeId, counts) {
  return counts ? (counts.get(typeId) ?? 0) : countItem(player, typeId);
}

export function hasIngredients(player, ingredients, counts) {
  for (const ing of ingredients) {
    if (amountOf(player, ing.typeId, counts) < ing.amount) {
      return false;
    }
  }
  return true;
}

/**
 * Quantas vezes dá para fabricar a receita com o que há no inventário.
 * Usa o Map de getInventoryCounts (uma varredura só).
 */
export function getMaxCraftable(ingredients, counts) {
  let max = Infinity;
  for (const ing of ingredients) {
    const has = counts.get(ing.typeId) ?? 0;
    max = Math.min(max, Math.floor(has / ing.amount));
  }
  return max === Infinity ? 0 : max;
}

export function consumeItems(player, baseIngredients, times = 1) {
  // Multiplica as quantidades pelo número de fabricações
  const ingredients = baseIngredients.map((ing) => ({
    ...ing,
    amount: ing.amount * times
  }));

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
 * Entrega UMA pilha (amount deve caber no limite da pilha).
 * Tenta inventário -> chão -> comando /give (fallback).
 */
function giveStack(player, typeId, amount) {
  // 1) Tenta colocar no inventário
  try {
    const inv = getInventory(player);
    const stack = new ItemStack(typeId, amount);

    if (inv) {
      const leftover = inv.addItem(stack);
      if (!leftover) return true; // entrou tudo
      // sobrou -> joga no chão
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

/**
 * Entrega o item fabricado 'times' vezes.
 * Divide em várias pilhas quando passa do limite (ex.: 64).
 */
export function giveResult(player, result, times = 1) {
  const typeId = result.typeId;
  let remaining = (result.amount ?? 1) * times;

  let maxStack = 64;
  try {
    maxStack = new ItemStack(typeId, 1).maxAmount;
  } catch (_) { }

  while (remaining > 0) {
    const n = Math.min(remaining, maxStack);
    if (!giveStack(player, typeId, n)) return false;
    remaining -= n;
  }
  return true;
}

export function getIngredientsStatusText(player, ingredients, counts) {
  let text = "";
  for (const ing of ingredients) {
    const has = amountOf(player, ing.typeId, counts);
    const color = has >= ing.amount ? "§a" : "§c";
    const display = ing.display || ing.typeId.replace("minecraft:", "");
    text += `${color}${has}/${ing.amount} ${display}\n`;
  }
  return text.trim();
}