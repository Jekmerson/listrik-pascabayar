/**
 * ALGORITMA ROUTES - Demo Sorting & Searching
 */
const express = require('express');
const router = express.Router();
const { bubbleSort, bubbleSortByKey } = require('../utils/sorting');
const { linearSearch, binarySearch } = require('../utils/searching');

// POST /api/algoritma/sort - Sorting demo
router.post('/sort', (req, res) => {
    try {
        const { data, order = 'asc' } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, message: 'Data harus berupa array' });
        }

        const startTime = Date.now();
        const sorted = bubbleSort(data, order);
        const endTime = Date.now();

        res.json({
            success: true,
            data: {
                original: data,
                sorted: sorted,
                order: order,
                executionTime: `${endTime - startTime}ms`,
                algorithm: 'Bubble Sort',
                complexity: 'O(n²)'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal melakukan sorting' });
    }
});

// POST /api/algoritma/search - Searching demo
router.post('/search', (req, res) => {
    try {
        const { data, target, method = 'linear' } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({ success: false, message: 'Data harus berupa array' });
        }

        const startTime = Date.now();
        let result;

        if (method === 'binary') {
            // Binary search butuh data sorted
            const sorted = bubbleSort(data, 'asc');
            result = binarySearch(sorted, target);
        } else {
            result = linearSearch(data, target);
        }

        const endTime = Date.now();

        res.json({
            success: true,
            data: {
                ...result,
                executionTime: `${endTime - startTime}ms`,
                algorithm: method === 'binary' ? 'Binary Search' : 'Linear Search',
                complexity: method === 'binary' ? 'O(log n)' : 'O(n)'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal melakukan searching' });
    }
});

module.exports = router;
