export const arcaneCategories = [
  { id: "ferramentas", name: "Ferramentas", icon: "textures/items/iron_pickaxe" },
  { id: "comida",      name: "Comida",      icon: "textures/items/bread" },
  { id: "blocos",      name: "Blocos",      icon: "textures/blocks/cobblestone" },
  { id: "minerio",      name: "Minérios",      icon: "textures/items/iron_ingot" }
];
export const arcaneRecipes = [
  {
    id: "arcane_wooden_sword",
    category:"ferramentas",
    name: "Espada de Madeira",
    icon: "textures/items/wood_sword",
    result: { typeId: "minecraft:wooden_sword", amount: 1 },
    ingredients: [
      { typeId: "minecraft:oak_planks", amount: 2, display: "Tábuas de Carvalho" },
      { typeId: "minecraft:stick", amount: 1, display: "Graveto" }
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
    category:"minerio",
    name: "Barra de Aço",
    icon: "textures/items/barra_aco",
    result: { typeId: "wolfaddon:barra_aco", amount: 1 },
    ingredients: [
      { typeId: "wolfaddon:barra_ferro_carvao", amount: 1, display: "Barra de Ferro com Carvão" }
    ]
  },
  {
    id: "painting_frame",
    category:"blocos",
    name: "Quadro Mágico",
    icon: "textures/items/quadro_magico",
    result: { typeId: "wolfaddon:painting_frame", amount: 1 },
    ingredients: [
      { typeId: "minecraft:lapis_lazuli", amount: 1, display: "Lápis Lazuli" },
      { typeId: "minecraft:coal", amount: 2, display: "Carvão" },
      { typeId: "wolfaddon:cabo_aco", amount: 6, display: "Cabo de Aço" },
    ]
  }
];
