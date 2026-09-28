import { system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { arcaneRecipes } from "../recipes/arcane_recipes.js";
import {
  hasIngredients,
  consumeItems,
  giveResult,
  getIngredientsStatusText
} from "../utils/inventory.js";

// Impede abrir 2 forms ao mesmo tempo para o mesmo jogador
const locked = new Set();

function lock(player) {
  locked.add(player.id);
}

function unlock(player) {
  locked.delete(player.id);
}

export function isUiLocked(player) {
  return locked.has(player.id);
}

export function openArcaneTable(player) {
  if (!player) return;
  if (locked.has(player.id)) return; // já tem menu aberto
  showRecipeList(player);
}

function waitTicks(ticks) {
  return new Promise((resolve) => {
    system.runTimeout(resolve, ticks);
  });
}

async function showRecipeList(player) {
  if (locked.has(player.id)) return;
  lock(player);

  try {
    // Espera a UI anterior sumir de verdade
    await waitTicks(8);

    const form = new ActionFormData()
      .title("§5Mesa Arcana")
      .body("§7Selecione um item para fabricar:");

    for (const recipe of arcaneRecipes) {
      const canCraft = hasIngredients(player, recipe.ingredients);
      const prefix = canCraft ? "§a " : "§c ";
      if (recipe.icon) {
        form.button(`${prefix}${recipe.name}`, recipe.icon);
      } else {
        form.button(`${prefix}${recipe.name}`);
      }
    }
    form.button("§8Fechar");

    const response = await form.show(player);

    if (response.canceled || response.selection === undefined) {
      return;
    }
    if (response.selection === arcaneRecipes.length) {
      return; // Fechar
    }

    const recipe = arcaneRecipes[response.selection];
    if (!recipe) return;

    // Libera o lock ANTES de abrir a próxima tela
    unlock(player);
    await waitTicks(8);
    await showRecipeDetails(player, recipe);
  } catch (e) {
    console.error("[Mesa Arcana] " + e);
    player.sendMessage("§c[Mesa Arcana] Erro: " + String(e));
  } finally {
    unlock(player);
  }
}

async function showRecipeDetails(player, recipe) {
  if (locked.has(player.id)) return;
  lock(player);

  try {
    await waitTicks(8);

    const statusText = getIngredientsStatusText(player, recipe.ingredients);
    const canCraft = hasIngredients(player, recipe.ingredients);

    const form = new ActionFormData()
      .title("§5Mesa Arcana")
      .body(
        `§f§l${recipe.name}\n\n` +
        `§7Requisitos:\n${statusText}\n\n` +
        (canCraft
          ? "§aMateriais Suficientes."
          : "§cMateriais insuficientes.")
      );

    if (recipe.icon) {
      form.button(
        canCraft ? "§aFabricar" : "§8Fabricar (faltam materiais)",
        recipe.icon
      );
    } else {
      form.button(canCraft ? "§aFabricar" : "§8Fabricar (faltam materiais)");
    }
    form.button("§eVoltar à lista");
    form.button("§8Fechar");

    const response = await form.show(player);

    if (response.canceled || response.selection === undefined) {
      return;
    }

    if (response.selection === 0) {
      if (canCraft && consumeItems(player, recipe.ingredients)) {
        const ok = giveResult(player, recipe.result);
        if (ok) {
          try {
            player.playSound("random.anvil_use");
          } catch (_) { }
        }
        unlock(player);
        await waitTicks(8);
        await showRecipeDetails(player, recipe);
      }
    } else if (response.selection === 1) {
      // Voltar
      unlock(player);
      await waitTicks(8);
      await showRecipeList(player);
    }
    // selection 2 = Fechar
  } catch (e) {
    console.error("[Mesa Arcana] " + e);
  } finally {
    unlock(player);
  }
}