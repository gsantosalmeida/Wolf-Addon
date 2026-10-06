export const arcaneCategories = [
  { id: "ferramentas", name: "Ferramentas", icon: "textures/items/iron_pickaxe" },
  { id: "blocos", name: "Blocos", icon: "textures/blocks/cobblestone" },
  { id: "comida", name: "Comida", icon: "textures/items/bread" },
  { id: "armas", name: "Armas", icon: "textures/items/iron_sword" },
  { id: "materiais", name: "Materiais", icon: "textures/items/iron_ingot" },
  { id: "outros", name: "Outros", icon: "textures/items/quadro_magico" }
];
export const arcaneRecipes = [
  {
    id: "arcane_wooden_sword",
    category:"armas",
    name: "Espada de Madeira",
    icon: "textures/items/wood_sword",
    result: { typeId: "minecraft:wooden_sword", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 2, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 1, display: "Graveto" }
    ]
  },
  {
    id: "wooden_axe",
    category:"ferramentas",
    name: "Machado de Madeira",
    icon: "textures/items/wood_axe",
    result: { typeId: "minecraft:wooden_axe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 3, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "wooden_pickaxe",
    category:"ferramentas",
    name: "Picareta de Madeira",
    icon: "textures/items/wood_pickaxe",
    result: { typeId: "minecraft:wooden_pickaxe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 3, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "wooden_shovel",
    category:"ferramentas",
    name: "Pá de Madeira",
    icon: "textures/items/wood_shovel",
    result: { typeId: "minecraft:wooden_shovel", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 1, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "wooden_hoe",
    category:"ferramentas",
    name: "Enxada de Madeira",
    icon: "textures/items/wood_hoe",
    result: { typeId: "minecraft:wooden_hoe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 2, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_stone_pickaxe",
    category:"ferramentas",
    name: "Picareta de Pedra",
    icon: "textures/items/stone_pickaxe",
    result: { typeId: "minecraft:stone_pickaxe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 3, display: "Pedregulho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_stone_axe",
    category:"ferramentas",
    name: "Machado de Pedra",
    icon: "textures/items/stone_axe",
    result: { typeId: "minecraft:stone_axe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 3, display: "Pedregulho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_stone_sword",
    category:"armas",
    name: "Espada de Pedra",
    icon: "textures/items/stone_sword",
    result: { typeId: "minecraft:stone_sword", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 2, display: "Pedregulho" },
      { typeId: "minecraft:stick", amount: 1, display: "Graveto" }
    ]
  },
  {
    id: "arcane_stone_shovel",
    category:"ferramentas",
    name: "Pá de Pedra",
    icon: "textures/items/stone_shovel",
    result: { typeId: "minecraft:stone_shovel", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 1, display: "Pedregulho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_stone_hoe",
    category:"ferramentas",
    name: "Enxada de Pedra",
    icon: "textures/items/stone_hoe",
    result: { typeId: "minecraft:stone_hoe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 2, display: "Pedregulho" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_iron_axe",
    category:"ferramentas",
    name: "Machado de Ferro",
    icon: "textures/items/iron_axe",
    result: { typeId: "minecraft:iron_axe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:iron_ingot", amount: 3, display: "Barra de Ferro" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_iron_sword",
    category:"armas",
    name: "Espada de Ferro",
    icon: "textures/items/iron_sword",
    result: { typeId: "minecraft:iron_sword", amount: 1 },
    ingredients: [
      { typeId: "minecraft:iron_ingot", amount: 2, display: "Barra de Ferro" },
      { typeId: "minecraft:stick", amount: 1, display: "Graveto" }
    ]
  },
  {
    id: "arcane_iron_pickaxe",
    category:"ferramentas",
    name: "Picareta de Ferro",
    icon: "textures/items/iron_pickaxe",
    result: { typeId: "minecraft:iron_pickaxe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:iron_ingot", amount: 3, display: "Barra de Ferro" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_iron_shovel",
    category:"ferramentas",
    name: "Pá de Ferro",
    icon: "textures/items/iron_shovel",
    result: { typeId: "minecraft:iron_shovel", amount: 1 },
    ingredients: [
      { typeId: "minecraft:iron_ingot", amount: 1, display: "Barra de Ferro" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_iron_hoe",
    category:"ferramentas",
    name: "Enxada de Ferro",
    icon: "textures/items/iron_hoe",
    result: { typeId: "minecraft:iron_hoe", amount: 1 },
    ingredients: [
      { typeId: "minecraft:iron_ingot", amount: 2, display: "Barra de Ferro" },
      { typeId: "minecraft:stick", amount: 2, display: "Graveto" }
    ]
  },
  {
    id: "arcane_golden_apple",
    category:"comida",
    name: "Maçã Dourada",
    icon: "textures/items/apple_golden",
    result: { typeId: "minecraft:golden_apple", amount: 1 },
    ingredients: [
      { typeId: "minecraft:apple", amount: 1, display: "Maçã" },
      { typeId: "minecraft:gold_ingot", amount: 8, display: "Barra de Ouro" }
    ]
  },
  {
    id: "arcane_torch",
    category:"ferramentas",
    name: "Tocha",
    icon: "textures/blocks/torch_on",
    result: { typeId: "minecraft:torch", amount: 4 },
    ingredients: [
      { typeId: "minecraft:coal", amount: 1, display: "Carvão" },
      { typeId: "minecraft:stick", amount: 1, display: "Graveto" }
    ]
  },
  {
    id: "arcane_chest",
    category:"blocos",
    name: "Baú",
    icon: "textures/blocks/chest_front",
    result: { typeId: "minecraft:chest", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 8, display: "Tábuas de Carvalho" }
    ]
  },
  {
    id: "arcane_furnace",
    category:"blocos",
    name: "Fornalha",
    icon: "textures/blocks/furnace_front_off",
    result: { typeId: "minecraft:furnace", amount: 1 },
    ingredients: [
      { typeId: "minecraft:cobblestone", amount: 8, display: "Pedregulho" }
    ]
  },
  {
    id: "arcane_bread",
    category:"comida",
    name: "Pão",
    icon: "textures/items/bread",
    result: { typeId: "minecraft:bread", amount: 1 },
    ingredients: [
      { typeId: "minecraft:wheat", amount: 3, display: "Trigo" }
    ]
  },
  {
    id: "barra_Aco",
    category:"materiais",
    name: "Barra de Aço",
    icon: "textures/items/barra_aco",
    result: { typeId: "wolfaddon:barra_aco", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:barra_ferro_carvao", amount: 1, display: "Barra de Ferro com Carvão" }
    ]
  },
  {
    id: "painting_frame",
    category:"outros",
    name: "Quadro Mágico",
    icon: "textures/items/quadro_magico",
    result: { typeId: "wolfaddon:painting_frame", amount: 1 },
    ingredients: [
      { typeId: "minecraft:lapis_lazuli", amount: 1, display: "Lápis Lazuli" },
      { typeId: "minecraft:coal", amount: 2, display: "Carvão" },
      { typeId: "wolfaddon:cabo_aco", amount: 6, display: "Cabo de Aço" },
    ]
  },
  {
    id: "bloco_turmalina_schorl",
    category:"blocos",
    name: "Bloco de Turmalina Schorl",
    icon: "textures/blocks/bloco_turmalina_schorl",
    result: { typeId: "wolfaddon:bloco_turmalina_schorl", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:turmalina_schorl", amount: 9, display: "Turmalina Schorl" }
    ]
  },
  {
    id: "bloco_turmalina_indicolita",
    category:"blocos",
    name: "Bloco de Turmalina Indicolita",
    icon: "textures/blocks/bloco_turmalina_indicolita",
    result: { typeId: "wolfaddon:bloco_turmalina_indicolita", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:turmalina_indicolita", amount: 9, display: "Turmalina Indicolita" }
    ]
  },
  {
    id: "bloco_turmalina_rubelita",
    category:"blocos",
    name: "Bloco de Turmalina Rubelita",
    icon: "textures/blocks/bloco_turmalina_rubelita",
    result: { typeId: "wolfaddon:bloco_turmalina_rubelita", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:turmalina_rubelita", amount: 9, display: "Turmalina Rubelita" }
    ]
  },
  {
    id: "bloco_turmalina_paraiba",
    category:"blocos",
    name: "Bloco de Turmalina Paraíba",
    icon: "textures/blocks/bloco_turmalina_paraiba",
    result: { typeId: "wolfaddon:bloco_turmalina_paraiba", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:turmalina_paraiba", amount: 9, display: "Turmalina Paraíba" }
    ]
  }
];
