/**
 * ============================================
 * SEARCHING UTILITY
 * Implementasi algoritma Linear Search dan Binary Search
 * ============================================
 */

/**
 * Linear Search Algorithm
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {Array} arr - Array tempat pencarian
 * @param {*} target - Nilai yang dicari
 * @returns {Object} - {found: boolean, index: number, value: *}
 */
function linearSearch(arr, target) {
    // Loop melalui setiap elemen
    for (let i = 0; i < arr.length; i++) {
        // Jika ditemukan, return informasi lengkap
        if (arr[i] === target) {
            return {
                found: true,
                index: i,
                value: arr[i],
                message: `Angka ${target} ditemukan pada posisi ke-${i + 1}`
            };
        }
    }

    // Jika tidak ditemukan
    return {
        found: false,
        index: -1,
        value: null,
        message: `Angka ${target} tidak ditemukan`
    };
}

/**
 * Binary Search Algorithm (hanya untuk array yang sudah terurut)
 * Time Complexity: O(log n)
 * Space Complexity: O(1)
 * 
 * @param {Array} arr - Array yang sudah terurut
 * @param {*} target - Nilai yang dicari
 * @returns {Object} - {found: boolean, index: number, value: *, iterations: number}
 */
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let iterations = 0;

    while (left <= right) {
        iterations++;

        // Cari middle index
        const mid = Math.floor((left + right) / 2);

        // Jika ditemukan di tengah
        if (arr[mid] === target) {
            return {
                found: true,
                index: mid,
                value: arr[mid],
                iterations,
                message: `Angka ${target} ditemukan pada posisi ke-${mid + 1} (${iterations} iterasi)`
            };
        }

        // Jika target lebih kecil, cari di kiri
        if (arr[mid] > target) {
            right = mid - 1;
        }
        // Jika target lebih besar, cari di kanan
        else {
            left = mid + 1;
        }
    }

    // Tidak ditemukan
    return {
        found: false,
        index: -1,
        value: null,
        iterations,
        message: `Angka ${target} tidak ditemukan (${iterations} iterasi)`
    };
}

/**
 * Search dalam array of objects berdasarkan property
 * 
 * @param {Array} arr - Array of objects
 * @param {String} key - Property name
 * @param {*} value - Nilai yang dicari
 * @returns {Object} - {found: boolean, index: number, data: object}
 */
function searchByKey(arr, key, value) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
            return {
                found: true,
                index: i,
                data: arr[i],
                message: `Data dengan ${key} = ${value} ditemukan`
            };
        }
    }

    return {
        found: false,
        index: -1,
        data: null,
        message: `Data dengan ${key} = ${value} tidak ditemukan`
    };
}

/**
 * Search multiple (find all)
 * 
 * @param {Array} arr - Array tempat pencarian
 * @param {*} target - Nilai yang dicari
 * @returns {Object} - {found: boolean, indices: Array, count: number}
 */
function searchAll(arr, target) {
    const indices = [];

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            indices.push(i);
        }
    }

    return {
        found: indices.length > 0,
        indices,
        count: indices.length,
        message: indices.length > 0
            ? `Angka ${target} ditemukan ${indices.length} kali`
            : `Angka ${target} tidak ditemukan`
    };
}

module.exports = {
    linearSearch,
    binarySearch,
    searchByKey,
    searchAll
};
