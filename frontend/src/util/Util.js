/**
 * Laziliy evaluates a given function and returns the result, or null if undefined or error
 * @param {*} lambda lazy function
 * @returns result or null
 */
export const tryOrNull = (lambda) => {
    try {
        return lambda() ?? null;
    } catch {
        return null;
    }
}