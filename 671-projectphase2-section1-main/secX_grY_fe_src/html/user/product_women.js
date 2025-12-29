$(document).ready(() => {
    let allProducts = []; // เก็บข้อมูลสินค้าทั้งหมดที่ดึงมาจาก API

    // ดึงข้อมูลสินค้าเมื่อโหลดหน้า
    fetch('http://localhost:3030/api/women')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text(); // แปลงข้อมูลเป็นข้อความ
        })
        .then(data => {
            console.log("Raw Response:", data); // ตรวจสอบข้อมูลที่ส่งกลับ
            try {
                const jsonData = JSON.parse(data); // แปลงข้อความเป็น JSON
                console.log("Fetched Products:", jsonData); // ตรวจสอบข้อมูลสินค้า
                allProducts = jsonData; // เก็บข้อมูลสินค้า
                applyFilters(); // เรียกใช้การกรองข้อมูลหลังโหลด
            } catch (error) {
                console.error("Error parsing JSON:", error);
                $("#productlist_women .products").html('<p>Error loading products. Please try again later.</p>');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            $("#productlist_women .products").html('<p>Error loading products. Please try again later.</p>');
        });

    // Function: ดึง query string จาก URL
    function getQueryParams() {
        const params = {};
        const queryString = window.location.search; // ดึง query string จาก URL
        const urlParams = new URLSearchParams(queryString);
        for (const [key, value] of urlParams.entries()) {
            if (params[key]) {
                // กรณีมีค่าเดิมอยู่แล้ว (เช่น array)
                params[key] = [].concat(params[key], value);
            } else {
                params[key] = value;
            }
        }
        return params;
    }

    // Function: กรองข้อมูลตาม query string
    function applyFilters() {
        const filters = getQueryParams(); // ดึงค่าจาก query string
        console.log("Filters:", filters); // ตรวจสอบ Filters
    
        // แปลง Filters.brand[], Filters.color[], Filters.category[] ให้เป็นอาร์เรย์เสมอ
        const selectedBrands = filters['brand[]'] || [];
        const selectedColors = filters['color[]'] || [];
        const selectedCategories = filters['category[]'] || [];
    
        console.log("Raw Filters.brand[]:", filters['brand[]']);
        console.log("Raw Filters.color[]:", filters['color[]']);
        console.log("Raw Filters.category[]:", filters['category[]']);
        console.log("Selected Brands:", selectedBrands);
        console.log("Selected Colors:", selectedColors);
        console.log("Selected Categories:", selectedCategories);
    
        const searchText = (filters.searchinput || '').toLowerCase();
        const minPrice = parseFloat(filters.min_price) || 0;
        const maxPrice = parseFloat(filters.max_price) || Infinity;
    
        // กรองข้อมูล
        const filteredProducts = allProducts.filter(product => {
            const matchesSearchText = searchText === '' || product.product_name.toLowerCase().includes(searchText);
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
            const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.color);
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const price = parseFloat(product.price);
            const matchesPrice = price >= minPrice && price <= maxPrice;
    
            console.log(`Checking product: ${product.product_name}`);
            console.log(`- Matches search text: ${matchesSearchText}`);
            console.log(`- Matches brand: ${matchesBrand}`);
            console.log(`- Matches color: ${matchesColor}`);
            console.log(`- Matches category: ${matchesCategory}`);
            console.log(`- Matches price: ${matchesPrice}`);
    
            return matchesSearchText && matchesBrand && matchesColor && matchesCategory && matchesPrice;
        });
    
        console.log("Filtered Products:", filteredProducts); // ตรวจสอบผลลัพธ์ที่กรองได้
        renderProducts(filteredProducts.length > 0 ? filteredProducts : []); // แสดงสินค้าที่กรองได้
    }
    
    

    // Function: แสดงสินค้า
    function renderProducts(products) {
        let html = '';
        if (products.length > 0) {
            products.forEach(data => {
                html += `<div onclick="open_product('${data.itemid}')" class="product-item ${data.category}">
                            <img class="product-img" src="${data.image_path || '/path/to/default-image.jpg'}" alt="">
                            <p>${data.brand}</p>
                            <h3>${data.product_name}</h3>
                            <p class="price">${numberWithCommas(data.price)} THB</p> 
                        </div>`;
            });
        } else {
            html = "<p>No products found.</p>";
        }
        console.log("Generated HTML:", html); // ตรวจสอบ HTML
        $("#productlist_women .products").html(html);
    }

    // Function: เพิ่ม comma ให้ตัวเลข
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});















