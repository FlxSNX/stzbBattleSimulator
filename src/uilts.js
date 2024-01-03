export function keepTwoDecimal(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        return num;
    }
    result = Math.round(num * 100) / 100;
    return result;
 };