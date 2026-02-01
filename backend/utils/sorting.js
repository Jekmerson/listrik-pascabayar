/**
 * ============================================
 * SORTING UTILITY
 * Implementasi algoritma Bubble Sort
 * ============================================
 */

/**
 * Bubble Sort Algorithm
 * Time Complexity: O(n²)
 * Space Complexity: O(1)
 * 
 * @param {Array} arr - Array yang akan diurutkan
 * @param {String} order - 'asc' untuk ascending, 'desc' untuk descending
 * @returns {Array} - Array yang sudah terurut
 */
function bubbleSort(arr, order = 'asc') {
    // Clone array agar tidak mengubah array original
    const result = [...arr];
    const n = result.length;

    // Outer loop: jumlah pass yang diperlukan
    for (let i = 0; i < n - 1; i++) {
        // Flag untuk optimasi: jika tidak ada swap, array sudah terurut
        let swapped = false;

        // Inner loop: perbandingan elemen
        for (let j = 0; j < n - i - 1; j++) {
            // Kondisi swap berdasarkan order
            const shouldSwap = order === 'asc'
                ? result[j] > result[j + 1]
                : result[j] < result[j + 1];

            if (shouldSwap) {
                // Swap menggunakan destructuring
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        // Jika tidak ada swap, array sudah terurut
        if (!swapped) break;
    }

    return result;
}

/**
 * Sort array of objects berdasarkan property tertentu
 * 
 * @param {Array} arr - Array of objects
 * @param {String} key - Property name untuk sorting
 * @param {String} order - 'asc' atau 'desc'
 * @returns {Array} - Sorted array
 */
function bubbleSortByKey(arr, key, order = 'asc') {
    const result = [...arr];
    const n = result.length;

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;

        for (let j = 0; j < n - i - 1; j++) {
            const shouldSwap = order === 'asc'
                ? result[j][key] > result[j + 1][key]
                : result[j][key] < result[j + 1][key];

            if (shouldSwap) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }

        if (!swapped) break;
    }

    return result;
}

module.exports = {
    bubbleSort,
    bubbleSortByKey
};
