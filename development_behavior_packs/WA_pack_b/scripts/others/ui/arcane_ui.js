import { system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason } from "@minecraft/server-ui";
import { arcaneRecipes, arcaneCategories } from "../recipes/arcane_recipes.js";
import {
  getInventoryCounts,
  hasIngredients,
  consumeItems,
  giveResult
} from "../utils/inventory.js";

const PAGE_SIZE = 18; // grade de 9 x 2 slots

// ---------- Etiquetas que o JSON UI (server_form.json) reconhece ----------
// Tudo aqui é INVISÍVEL na tela (só códigos de formatação) e tem que ser
// IGUAL ao que está no server_form.json.
const UI_TAG = "§r§r§r§r"; // no título: "este form é a Mesa Arcana"
const M = {
  SLOT: "§1§r", // botão = slot de receita na grade
  TAB: "§3§r",  // botão = aba de categoria
  NAV: "§5§r",  // botão = seta de página
  RES: "§9§r",  // botão = slot do resultado (só exibição)
  ACT: "§b§r",  // botão = Fabricar
  INFO: "§d§r", // botão = linha de ingrediente (só exibição)
  RED: "§4§r",  // flag: falta material (fundo vermelho)
  SEL: "§e§r"   // flag: selecionado (moldura amarela)
};

// Ícone de cada ingrediente (typeId -> textura). Sem entrada = linha sem ícone.
// Ao criar uma receita nova, acrescente aqui os ingredientes novos.
const INGREDIENT_ICONS = {
  "minecraft:oak_planks": "textures/blocks/planks_oak",
  "minecraft:stick": "textures/items/stick",
  "minecraft:cobblestone": "textures/blocks/cobblestone",
  "minecraft:iron_ingot": "textures/items/iron_ingot",
  "minecraft:gold_ingot": "textures/items/gold_ingot",
  "minecraft:apple": "textures/items/apple",
  "minecraft:coal": "textures/items/coal",
  "minecraft:wheat": "textures/items/wheat",
  "minecraft:lapis_lazuli": "textures/items/dye_powder_blue",
  "wolfaddon:cabo_aco": "textures/items/cabo_aco",
  "wolfaddon:barra_ferro_carvao": "textures/items/barra_ferro_carvao"
};

// Jogadores que já têm a Mesa Arcana aberta (uma sessão por jogador)
const sessions = new Set();

export function isUiLocked(player) {
  return sessions.has(player.id);
}

export function openArcaneTable(player) {
  if (!player || sessions.has(player.id)) return;

  sessions.add(player.id); // trava NA HORA, antes de qualquer await

  runTable(player)
    .catch((e) => {
      console.error("[Mesa Arcana] " + e);
      try {
        player.sendMessage("§c[Mesa Arcana] Erro: " + String(e));
      } catch (_) { }
    })
    .finally(() => sessions.delete(player.id));
}

function waitTicks(ticks) {
  return new Promise((resolve) => system.runTimeout(resolve, ticks));
}

// Mostra o form e tenta de novo se o jogador estiver "ocupado" (UserBusy)
async function showForm(form, player, maxTries = 20) {
  for (let i = 0; i < maxTries; i++) {
    const response = await form.show(player);
    if (response.cancelationReason !== FormCancelationReason.UserBusy) {
      return response;
    }
    await waitTicks(5);
  }
  return null;
}

// Cada botão adicionado ao form ganha uma "ação" na MESMA posição do array.
function nextScreen(response, actions) {
  if (!response || response.canceled || response.selection === undefined) {
    return null;
  }
  return actions[response.selection] ?? null;
}

// Som + mensagem curta acima da hotbar
function feedback(player, sound, message) {
  try {
    player.playSound(sound);
  } catch (_) { }
  try {
    player.onScreenDisplay.setActionBar(message);
  } catch (_) { }
}

function recipesOf(categoryId) {
  return arcaneRecipes.filter((r) => (r.category ?? "outros") === categoryId);
}

// Só existe UMA tela agora: a bancada. As categorias viraram abas.
async function runTable(player) {
  let screen = { name: "bench", categoryId: null, page: 0, selectedId: null };

  while (screen) {
    if (screen.name === "bench") {
      screen = await showBench(
        player,
        screen.categoryId,
        screen.page,
        screen.selectedId
      );
    } else {
      screen = null;
    }
  }
}

async function showBench(player, categoryId, page, selectedId) {
  // Abas: só categorias que têm receita
  const cats = arcaneCategories.filter((c) => recipesOf(c.id).length > 0);
  if (cats.length === 0) {
    player.sendMessage("§c[Mesa Arcana] Nenhuma receita cadastrada.");
    return null;
  }

  const cat = cats.find((c) => c.id === categoryId) ?? cats[0];
  const recipes = recipesOf(cat.id);

  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  page = Math.min(Math.max(page, 0), totalPages - 1);

  const pageRecipes = recipes.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const selected = recipes.find((r) => r.id === selectedId) ?? null;
  const counts = getInventoryCounts(player); // 1 varredura para a tela toda
  const canOf = (r) => hasIngredients(player, r.ingredients, counts);

  // Título do painel inferior esquerdo (o "body" do form)
  const body = selected
    ? `§f§l${selected.name}`
    : `§f§l${cat.name}\n§7Selecione uma receita.` +
      (totalPages > 1 ? `\n§8Página ${page + 1}/${totalPages}` : "");

  const form = new ActionFormData()
    .title(`${UI_TAG}§5Mesa Arcana`)
    .body(body);

  const actions = [];
  const here = { name: "bench", categoryId: cat.id, page, selectedId };

  // IMPORTANTE: os slots vêm PRIMEIRO. A grade do JSON UI ocupa as células
  // na ordem dos botões, então os slots precisam estar no começo da lista.
  for (const r of pageRecipes) {
    const flags =
      M.SLOT + (canOf(r) ? "" : M.RED) + (r.id === selectedId ? M.SEL : "");
    const text = flags + (r.icon ? "" : r.name.slice(0, 3));
    if (r.icon) form.button(text, r.icon);
    else form.button(text);

    actions.push({ ...here, selectedId: r.id });
  }

  // Abas de categoria
  for (const c of cats) {
    const text = M.TAB + (c.id === cat.id ? M.SEL : "") + (c.icon ? "" : c.name);
    if (c.icon) form.button(text, c.icon);
    else form.button(text);

    actions.push({ name: "bench", categoryId: c.id, page: 0, selectedId: null });
  }

  // Setas de página (só se houver mais de uma)
  if (page > 0) {
    form.button(M.NAV + "«");
    actions.push({ ...here, page: page - 1, selectedId: null });
  }
  if (page < totalPages - 1) {
    form.button(M.NAV + "»");
    actions.push({ ...here, page: page + 1, selectedId: null });
  }

  // Painel da receita selecionada: ingredientes, resultado e Fabricar
  if (selected) {
    const can = canOf(selected);

    // Uma linha por ingrediente, com ícone. Faltando: "!" amarelo + número vermelho.
    for (const ing of selected.ingredients) {
      const has = counts.get(ing.typeId) ?? 0;
      const name = ing.display || ing.typeId.replace("minecraft:", "");
      const text =
        M.INFO +
        (has >= ing.amount ? "§a" : "§e! §c") +
        `${has}/${ing.amount} ${name}`;

      const ingIcon = INGREDIENT_ICONS[ing.typeId];
      if (ingIcon) form.button(text, ingIcon);
      else form.button(text);
      actions.push(here); // só exibição: não muda nada
    }

    // Slot do resultado (mostra "xN" quando rende mais de 1)
    const amount = selected.result.amount ?? 1;
    const resText = M.RES + (can ? "" : M.RED) + (amount > 1 ? `x${amount}` : "");
    if (selected.icon) form.button(resText, selected.icon);
    else form.button(resText);
    actions.push(here);

    form.button(M.ACT + (can ? "" : M.RED) + (can ? "§fFabricar" : "§7Fabricar"));
    actions.push({ ...here, craft: true });
  }

  const chosen = nextScreen(await showForm(form, player), actions);

  // Fabricar é a única ação com efeito colateral
  if (chosen?.craft) {
    if (consumeItems(player, selected.ingredients)) {
      if (giveResult(player, selected.result)) {
        feedback(player, "random.anvil_use", `§aFabricado: ${selected.name}`);
      }
    } else {
      feedback(player, "note.bass", "§cMateriais insuficientes!");
    }
    return here; // reabre a bancada já atualizada
  }

  return chosen;
}