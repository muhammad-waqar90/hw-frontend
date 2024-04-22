export function generateEntityParentTree(data) {
  let array = [];
  let current = data.parent;
  while (current.parent) {
    const { parent, ...item } = current;
    array.push({ id: item.type + item.id, name: item.hierarchy_name });
    current = parent;
  }
  array.push({ id: current.id, name: current.name });
  return array.reverse();
}

export function generateEntityTreeString(data) {
  const array = (data.parent && generateEntityParentTree(data)) || [];
  let string = "";

  for (const item of array) {
    string += `${item.name} - `;
  }

  string += `${data.hierarchy_name}`;

  return string;
}

export function calculateSalaryScaleDiscount(price, discount) {
  return price - (price * discount) / 100;
}
