export function generateParentCategoryTree(data) {
  let array = [];
  let current = data;
  while (current.parent_categories_recursive) {
    const { parent_categories_recursive, ...category } = current;
    array.push({ id: category.id, name: category.name });
    current = parent_categories_recursive;
  }
  array.push({ id: current.id, name: current.name });
  return array.reverse();
}
