import { system } from '@minecraft/server';
import { ActionFormData, FormCancelationReason } from '@minecraft/server-ui';
import { arcaneRecipes } from '../recipes/arcane_recipes.js';
import { getInventoryCounts, hasIngredients, consumeItems, giveResult } from '../utils/inventory.js';

const TITLE_TAG = '§r§r§r§r';
const SLOT_TAG = '§1§r';
const MISSING_TAG = '§4§r';
// Keep this in step with tools/build_mesa_layout.mjs.
const recipeTag = (index) => `§8§${index.toString(16).padStart(2, '0').split('').join('§')}§r`;
const sessions = new Set();

export function isUiLocked(player) {
  return sessions.has(player.id);
}

export function openArcaneTable(player) {
  if (!player || sessions.has(player.id)) return;
  sessions.add(player.id);
  runTable(player)
    .catch((error) => {
      console.error('[Mesa de Trabalho] ' + error);
      try { player.sendMessage('§c[Mesa de Trabalho] Erro: ' + String(error)); } catch (_) { }
    })
    .finally(() => sessions.delete(player.id));
}

const waitTicks = (ticks) => new Promise((resolve) => system.runTimeout(resolve, ticks));

async function showForm(form, player) {
  for (let attempt = 0; attempt < 20; attempt++) {
    const response = await form.show(player);
    if (response.cancelationReason !== FormCancelationReason.UserBusy) return response;
    await waitTicks(5);
  }
  return null;
}

function sound(player, name) {
  try { player.playSound(name); } catch (_) { }
}

async function runTable(player) {
  while (true) {
    const counts = getInventoryCounts(player);
    const form = new ActionFormData().title({
      rawtext: [
        { text: `${TITLE_TAG}§5` },
        { translate: 'ui.wolfaddon.worktable.title' },
      ],
    });

    for (let index = 0; index < arcaneRecipes.length; index++) {
      const recipe = arcaneRecipes[index];
      const missing = !hasIngredients(player, recipe.ingredients, counts);
      const label = `${SLOT_TAG}${recipeTag(index)}${missing ? MISSING_TAG : ''}§f${recipe.name}`;
      if (recipe.icon) form.button(label, recipe.icon);
      else form.button(label);
    }

    const response = await showForm(form, player);
    if (!response || response.canceled || response.selection === undefined) return;
    const recipe = arcaneRecipes[response.selection];
    if (!recipe) return;

    // Verify against the live inventory; the displayed border is only a hint.
    if (!hasIngredients(player, recipe.ingredients)) {
      sound(player, 'note.bass');
      continue;
    }
    if (!consumeItems(player, recipe.ingredients)) {
      sound(player, 'note.bass');
      continue;
    }
    if (giveResult(player, recipe.result)) {
      sound(player, 'random.anvil_use');
      try { player.onScreenDisplay.setActionBar(`§aFabricado: ${recipe.name}`); } catch (_) { }
    }
  }
}
