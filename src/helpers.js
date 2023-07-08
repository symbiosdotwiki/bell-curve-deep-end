export function findValuesByKey(obj, key, ignore) {
  let values = [];

  function search(obj) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && !ignore.includes(prop)) {
        if (prop === key) {
          values.push(obj[prop]);
        } else if (typeof obj[prop] === 'object') {
          search(obj[prop]);
        }
      }
    }
  }

  search(obj);

  return values;
}