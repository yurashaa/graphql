export const getQueryRelations = (selection: any, prefix = '', lvl = -1): string[] => {
  const relations = []

  if (selection.selectionSet?.selections?.length) {
    const relation = `${prefix && lvl ? prefix + '.' : ''}${selection.name.value}`

    if (prefix) { relations.push(relation) }

    relations.push(...selection.selectionSet.selections.map(s => getQueryRelations(s, relation, lvl + 1)).flat())
  }

  return relations
}
