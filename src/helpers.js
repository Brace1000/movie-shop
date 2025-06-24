/**
 * @param {Function} func 
 * @param {number} delay 
 * @returns {Function} 
 */
export function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}