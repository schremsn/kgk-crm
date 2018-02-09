export default class Util {
  /**
  * helper method to filter out json false values for empty (null) field - should only be called for non-boolean fields
  * @param {any} data
  * @return {any} value
   */
  static getValue(data) {
    let value = '';
    if (data == null) {
      value = '';
    } else if (data === false) {
      value = '';
    } else {
      value = data;
    }
    return value;
  }

  /**
   * helper method to capitalize the first letter
   * @param {string} data
   */
  static convertCase(data) {
    let result = data;
    if (typeof (data) === 'string' && data.length > 0) {
      const first = data.substring(0, 1);
      result = first.toUpperCase();
      result = result.concat(data.substring(1));
    }
    return result;
  }

  /**
   * convert array to map using first element as key
   * @param {array} arr
   */
  static convertToMap(arr) {
    if (Array.isArray(arr)) {
      const map = new Map();
      arr.forEach((entry) => {
        map.set(entry[0], entry[1]);
      });
      return map;
    }

    // id no array return undefined
    return undefined;
  }
}
