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

export function angleDist(angle1, angle2) {
  const distance = Math.abs(angle1 - angle2) % (2 * Math.PI);
  return distance > Math.PI ? (2 * Math.PI) - distance : distance;
};

export function lerp(v1, v2, amt) {
  return amt * v1 + (1-amt) * v2
}