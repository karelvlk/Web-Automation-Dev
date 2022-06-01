
const https = require('https');

function getProductsInPriceRange(min, max) {
    return new Promise((resolve, reject) => {
        https.get(`https://api.ecommerce.com/products?minPrice=${min}&maxPrice=${max}`, (res) => {
            res.on('data', (d) => {
                resolve(d);
            });
        }).on('error', (e) => {
            resolve(null);
        });
    });
}

async function solveForPriceRange(minPrice, maxPrice) {
    let products = [];
    let data = await getProductsInPriceRange(minPrice, maxPrice);
    if (data) {
        if (data.total === data.count) {
            products = data.products;
        } else {
            let half = Math.floor((maxPrice + minPrice) / 2);
            //it recursively solves first half of the price interval
            let products1 = await solveForPriceRange(minPrice, half);
            //it recursively solves second half of the price interval
            let products2 = await solveForPriceRange(half + 1, maxPrice);

            products = [
                ...products1,
                ...products2
            ];
        }
    }
    return products;
}

async function getProducts() {
    let minPrice = 0;
    let maxPrice = 100000;
    return await solveForPriceRange(minPrice, maxPrice);
}

getProducts();
