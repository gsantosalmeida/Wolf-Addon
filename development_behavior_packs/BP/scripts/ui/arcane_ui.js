import { ActionFormData } from "@minecraft/server-ui";
import { arcaneRecipes } from "../recipes/arcane_recipes.js";
import {
  hasIngredients,
  consumeItems,
  giveResult,
  getIngredientsStatusText
} from "../utils/inventory.js";

/**
 * Abre a Mesa Arcana (ActionForm nativo — estável e funcional).
 */
export function openArcaneTable(player) {
  showRecipeList(player);
}

function showRecipeList(player) {
  const form = new ActionFormData()
    .title("§5Mesa Arcana")
    .body("§7Selecione um item para fabricar:\n§8(verde = pode craftar)");

  for (const recipe of arcaneRecipes) {
    const canCraft = hasIngredients(player, recipe.ingredients);
    const prefix = canCraft ? "§a✓ " : "§c✗ ";
    // Ícone opcional — se a textura não existir, o botão ainda funciona
    try {
      form.button(`${prefix}${recipe.name}`, recipe.icon);
    } catch {
      form.button(`${prefix}${recipe.name}`);
    }
  }

  form.button("§8Fechar");

  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection === undefined) return;

      if (response.selection === arcaneRecipes.length) return; // Fechar

      const recipe = arcaneRecipes[response.selection];
      if (recipe) showRecipeDetails(player, recipe);
    })
    .catch((err) => {
      console.error("[Mesa Arcana] Form error: " + err);
      player.sendMessage("§c[Mesa Arcana] Não foi possível abrir o menu.");
    });
}

function showRecipeDetails(player, recipe) {
  const statusText = getIngredientsStatusText(player, recipe.ingredients);
  const canCraft = hasIngredients(player, recipe.ingredients);

  const form = new ActionFormData()
    .title("§5Mesa Arcana")
    .body(
      `§f§l${recipe.name}\n\n` +
        `§7Requisitos:\n${statusText}\n\n` +
        (canCraft
          ? "§aVocê tem todos os materiais!"
          : "§cMateriais insuficientes.")
    );

  if (canCraft) {
    form.button("§a§lFabricar");
  } else {
    form.button("§7Fabricar (faltam materiais)");
  }
  form.button("§e← Voltar à lista");
  form.button("§8Fechar");

  form
    .show(player)
    .then((response) => {
      if (response.canceled || response.selection === undefined) return;

      if (response.selection === 0) {
        if (canCraft && consumeItems(player, recipe.ingredients)) {
          giveResult(player, recipe.result);
          player.sendMessage(`§a[Mesa Arcana] Você fabricou: §f${recipe.name}`);
          try {
            player.playSound("random.anvil_use");
          } catch (_) {}
          showRecipeDetails(player, recipe);
        } else {
          player.sendMessage("§c[Mesa Arcana] Materiais insuficientes!");
          showRecipeDetails(player, recipe);
        }
      } else if (response.selection === 1) {
        showRecipeList(player);
      }
    })
    .catch((err) => {
      console.error("[Mesa Arcana] Form error: " + err);
    });
}
