/**
 * @param  {string} property start with - to sort descending, the name of the property on the object to sort by
 */
export function sortObj(property: string): (a: {[key: string]: any} , b: {[key: string]: any }) => number {
  return (a: {[key: string]: any}, b: {[key: string]: any}): number => {
    let returnNum: number;
    const sortOrder: number = property.substr(0, 1) === '-' ? -1 : 1;
    const propertyWithoutMinus = property.substr(0, 1) === '-' ? property.substr(1) : property;
    if (a[propertyWithoutMinus] < b[propertyWithoutMinus]) {
      returnNum = 1 * sortOrder;
    } else if (a[propertyWithoutMinus] > b[propertyWithoutMinus]) {
      returnNum = -1 * sortOrder;
    } else {
      returnNum = 0;
    }
    return returnNum;
  };
}
