               

$(document).ready(() => {
    let Products = []; // เก็บข้อมูลสินค้าทั้งหมดที่ดึงมาจาก API

    // ดึงข้อมูลสินค้าเมื่อโหลดหน้า
    fetch('http://localhost:3030/api/allproducts')
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
                $("#productlist").html('<p>Error loading products. Please try again later.</p>');
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
            $("#productlist").html('<p>Error loading products. Please try again later.</p>');
        });
        

    });

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

        function applyFilters() {
            const filters = getQueryParams(); // ดึงค่าจาก query string
            console.log("Filters:", filters); // ตรวจสอบ Filters

        
            const searchText = (filters.searchinput || '').toLowerCase();

        
            // กรองข้อมูล
            const filteredProducts = allProducts.filter(product => {
                const matchesSearchText = searchText === '' || product.product_name.toLowerCase().includes(searchText);

                console.log(`Checking product: ${product.product_name}`);
                console.log(`- Matches search text: ${matchesSearchText}`);

        
                return matchesSearchText;
            });
        
            console.log("Filtered Products:", filteredProducts); // ตรวจสอบผลลัพธ์ที่กรองได้
            renderProducts(filteredProducts.length > 0 ? filteredProducts : []); // แสดงสินค้าที่กรองได้
        }


        function renderProducts(products) {
            let html = '';
            if (products.length > 0) {
                products.forEach(data => {
                    html += `<div onclick="open_product('${data.itemid}')" class="Product_itme ${data.category}">
                                <img class="product-img" src="${data.image_path || '/path/to/default-image.jpg'}" alt="">
                                <p>${data.brand}</p>
                                <h3>${data.product_name}</h3>
                                <p class = "price">${numberWithCommas(data.price)} THB</p> 
                            </div>`;
                });
            } else {
                html = "<p>No products found.</p>";
            }
            console.log("Generated HTML:", html); // ตรวจสอบ HTML
            $("#productlist").html(html);
        }





/* แปลงให้มีคอมม่า */
function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}



function open_product(id) {
    console.log(id);
    // เปลี่ยนไปยังหน้าสินค้าโดยใส่พารามิเตอร์ id
    window.location.href = `product?product_id=${id}`;
}







let allProducts = [];

// Fetch data from the API and store it in `allProducts`
$(document).ready(() => {
    fetch('http://localhost:3030/api/products')
        .then(response => response.json())
        .then(data => {
            allProducts = data;  // Store the fetched data
            console.log("Fetched Products:", allProducts);  // Check if products are correctly fetched
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });

    // Load cart from localStorage if available
    updateCartCount();
});







// Retrieve cart from localStorage
var cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add product to cart
function addtocart(product_id) {
    var pass = true;

    //ตรวจสอบว่ามี id สินค้านี้หรือไม่
    const productItem = allProducts.find(p => p.itemid == product_id);

    if (!productItem) {
        console.error("Product not found with ID:", product_id);
        return; //ถ้าไม่เจอสินค้าแสดง error
    }

    //เช็คสินค้าที่อยู่ในตระกร้าว่าซ้ำหรือไม่
    for (let i = 0; i < cart.length; i++) {
        if (product_id == cart[i].id) {
            cart[i].count++;
            console.log("Product already in cart, increased quantity");
            pass = false; 
            break;
        }
    }

    //ถ้าในตระกร้ายังไม่มี id ที่ต้องการ สร้างรายการสินค้าในตระกร้าใหม่
    if (pass) {
        var obj = {
            id: productItem.itemid,
            name: productItem.product_name,
            detail: productItem.detail,
            price: productItem.price,
            img: productItem.image_path,
            count: 1
        };
        cart.push(obj);
    }

    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show a success message
    Swal.fire({
        icon: "success",
        title: "Added to cart!",
        showConfirmButton: false,
        timer: 1500
    });

    // Update the cart item count
    updateCartCount();
    
    // Render cart
    rendercart();

    //แสดงผลdetail ใน terminal
    console.log(cart);
}

// Update cart count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.count, 0);
    $("#cartcount").css('display', 'flex').text(totalItems);
}


function rendercart() {
    if (!cart || cart.length === 0) {
        $("#mycart").html(`<p>Not Have a Product Now!</p>`);
        $(".total").html(`<p>Subtotal:</p><p>0 THB</p>`);
        document.querySelector(".cart-footer button").disabled = true;
        return;
    }
    

    var html = '';
    let subtotal = 0; 
    const cartItems = []; 
    
    for (let i = 0; i < cart.length; i++) {
        // ค้นหาสินค้าใน cart ตาม id
        const selectedProduct = cart[i];
        // ค้นหาสินค้าโดยใช้ id
        console.log('cart item:', cart[i]);
        console.log('selectedProduct:', selectedProduct);

        const itemPrice = selectedProduct.price * cart[i].count;
        subtotal += itemPrice;

        html += `
            <div class="cartlist_itme">
                <div class="cartlist_left">
                    <img src="${cart[i].img}" alt="">
                    <div class="cartlist_datail">
                        <p style="font-size: 1.2vw; margin: 0;">
                            <span class="product-name">${cart[i].name}</span><br>
                            <span class="product-detail">${cart[i].detail}</span>
                        </p>
                        <p style="font-size: 1 vw;">${numberWithCommas(itemPrice)} THB</p>
                    </div>
                </div>
                <div class="cartlist_right">
                    <div class="quantity-container">
                        <label for="quantity">QTY :</label>
                        <input type="number" class="quantity" value="${cart[i].count}" min="0" data-index="${i}">
                    </div>
                    <a class="remove-button" X data-index="${i}">X</a>
                </div>
            </div>`;

        // เก็บข้อมูลสินค้าเพื่อใช้ในหน้า checkout
        cartItems.push({
            name: cart[i].name,
            price: itemPrice,
            quantity: cart[i].count,
            img: cart[i].img
        });
    }

    $("#mycart").html(html);

    // แสดงราคาสุทธิ
    $(".total").html(`
        <p>Subtotal:</p>
        <p>${numberWithCommas(subtotal)} THB</p>
    `);

    // เปิดใช้งานปุ่ม Check Out
    document.querySelector(".cart-footer button").disabled = false;

    // เก็บข้อมูลสินค้าและราคาลงใน localStorage เมื่อกด Check Out
    document.querySelector(".cart-footer button").addEventListener("click", function() {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        localStorage.setItem("subtotal", subtotal);
        window.location.href = "check_Out"; // ไปยังหน้า checkout
    });

    // ลบโดยลดจำนวนสินค้า
    document.querySelectorAll('.quantity').forEach((input) => {
        input.addEventListener('change', function() {
            const index = parseInt(this.getAttribute('data-index'));
            const newQuantity = parseInt(this.value);

            if (newQuantity > 0) {
                cart[index].count = newQuantity;
                localStorage.setItem("cart", JSON.stringify(cart));
                rendercart(); 
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'คุณต้องการลบสินค้าจากตระกร้า?',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'ลบสินค้า',
                    cancelButtonText: 'ยกเลิก'
                }).then((res) => {
                    if (res.isConfirmed) {
                        cart.splice(index, 1); // Remove item from cart
                        rendercart(); 
                        $("#cartcount").css('display', 'flex').text(cart.length);
                        if (cart.length <= 0) {
                            $("#cartcount").css('display', 'none').text(cart.length);
                        }
                        localStorage.removeItem("cart");
                    } else {
                        cart[index].count = 1; // Reset to minimum quantity if canceled
                        this.value = 1;
                    }
                });
            }
        });
    });

    // ลบโดยใช้ x
    document.querySelectorAll('.remove-button').forEach((button) => {
        button.addEventListener('click', function(event) {
            event.preventDefault();
            const index = parseInt(this.getAttribute('data-index'));

            Swal.fire({
                icon: 'warning',
                title: 'คุณต้องการลบสินค้าจากตระกร้า?',
                showConfirmButton: true,
                showCancelButton: true,
                confirmButtonText: 'ลบสินค้า',
                cancelButtonText: 'ยกเลิก'
            }).then((res) => {
                if (res.isConfirmed) {
                    cart.splice(index, 1); // Remove item from cart
                    rendercart(); // Update the cart view
                    $("#cartcount").css('display', 'flex').text(cart.length);
                    if (cart.length <= 0) {
                        $("#cartcount").css('display', 'none').text(cart.length);
                    }
                    localStorage.removeItem("cart");
                }
            });
        });
    });
}





function toggleSearchBox() {
    var searchBox = document.getElementById("searchBox");
    if (searchBox.style.display === "none" || searchBox.style.display === "") {
        searchBox.style.display = "block"; // แสดงกล่องค้นหา
    } else {
        searchBox.style.display = "none"; // ซ่อนกล่องค้นหา
    }
}

    



function opencart() {
    const cartSidebar = document.querySelector('.cart-container');
    cartSidebar.classList.toggle('open'); //เปิด-ปิด side bar
    rendercart()
}

window.onclick = function(event) {
    const cartSidebar = document.querySelector('.cart-container');
    if (event.target === cartSidebar) {
        cartSidebar.classList.remove('open');
    }
}

function closecart() {
    const cartSidebar = document.querySelector('.cart-container');
    cartSidebar.classList.remove('open'); // Hide the cart sidebar
}






// หน้า product จาก URL
// ฟังก์ชันดึง product_id จาก URL
function getProductIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('itemid');  // ส่งค่า product_id ที่ดึงจาก URL
}

$(document).ready(() => {
    // Get the `product_id` from the URL
    const productId = getProductIndex();

    // Fetch data from API
    fetch('http://localhost:3030/api/product_image')
        .then(response => response.json())
        .then(data => {
            // Group images by `itemid`
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.itemid]) {
                    acc[item.itemid] = { ...item, img2: [] };
                }
                if (item.image_path) {
                    acc[item.itemid].img2.push(item.image_path);
                }
                return acc;
            }, {});

            //ตรวจหา product
            const selectedProduct = groupedData[productId];

            if (selectedProduct) {
                //แสดง product details
                displayProductDetails(selectedProduct);
            } else {
                console.error("Product not found with ID:", productId);
            }
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });
});

//แสดงผลหน้า detail
function displayProductDetails(selectedProduct) {
    $(".product-img").attr("src", selectedProduct.img2[0] || "default.jpg");
    $(".product-name").text(selectedProduct.product_name || "No Name Available");
    $(".product-description").text(selectedProduct.descriptions || "No Description Available");
    $(".price").text(`${numberWithCommas(selectedProduct.price || 0)} THB`);

    
    $(".info-table").html(`
        <tr><th>Year</th><td>${selectedProduct.item_year || "N/A"}</td></tr>
        <tr><th>Color</th><td>${selectedProduct.color || "N/A"}</td></tr>
        <tr><th>Size</th><td>${selectedProduct.width || "N/A"} x ${selectedProduct.length || "N/A"} x ${selectedProduct.height || "N/A"}</td></tr>
        <tr><th>Weight</th><td>${selectedProduct.weight || "N/A"}</td></tr>
        <tr><th>Item Condition</th><td>${selectedProduct.item_condition || "N/A"}</td></tr>
    `);

    //จัดการรูปภาพเล็ก
    const thumbnailContainer = $(".thumbnail-container");
    thumbnailContainer.empty(); 

    const mainImageThumbnail = $(`<img src="${selectedProduct.image_path}" alt="Main Thumbnail" class="thumbnail">`);
    mainImageThumbnail.on("click", () => {
        $(".product-img").addClass("fade");
        setTimeout(() => {
            $(".product-img").attr("src", selectedProduct.image_path);
            $(".product-img").removeClass("fade");
        }, 400);
    });
    thumbnailContainer.append(mainImageThumbnail);

    
    let thumbnails = Array.isArray(selectedProduct.img2) ? selectedProduct.img2 : [];
    if (typeof selectedProduct.img2 === "string" && selectedProduct.img2 !== "") {
        thumbnails = [selectedProduct.img2];
    }

    //แสดงรูปภาพย่อย
    if (thumbnails.length > 0) {
        thumbnails.forEach((imgSrc, index) => {
            const imgElement = $(`<img src="${imgSrc}" alt="Thumbnail ${index + 1}" class="thumbnail">`);
            imgElement.on("click", () => {
                $(".product-img").addClass("fade");
                setTimeout(() => {
                    $(".product-img").attr("src", imgSrc);
                    $(".product-img").removeClass("fade");
                }, 400);
            });
            thumbnailContainer.append(imgElement);
        });
    } else {
        console.log("No additional images found.");
    }
}

//get product id from params
function getProductIndex() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('product_id');
}

//ฟังก์ชั่นช่วยเติมคอมมว่าในราคาสินค้า
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}




function toggleSearchBox() {
    var searchBox = document.getElementById("searchBox");
    if (searchBox.style.display === "none" || searchBox.style.display === "") {
        searchBox.style.display = "block"; // แสดงกล่องค้นหา
    } else {
        searchBox.style.display = "none"; // ซ่อนกล่องค้นหา
    }
} 





var wishlist = JSON.parse(localStorage.getItem("wishlist")) || []; // Load wishlist from localStorage

function saveWishlistToLocalStorage() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist)); // Save wishlist to localStorage
}

function addToWishlist(product_id) {
    console.log("Adding product with ID: ", product_id);

    // Fetch all products from the API
    fetch(`http://localhost:3030/api/products`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(products => {
            // Find product_id
            const productItem = products.find(item => item.itemid === product_id);

            console.log("Product fetched from API:", productItem);

            //เช็คว่ามีสินค้าหรือไม่
            if (!productItem) {
                console.error("Product not found with id:", product_id);
                return;
            }

            //เช็คว่ามีสินค้าอยู่ใน wishlist แล้วหรือยัง
            if (!wishlist.some(item => item.itemid === productItem.itemid)) {
                wishlist.push(productItem); //Add the product 
                saveWishlistToLocalStorage(); //Save updated wishlist to localStorage
                displayWishlist(); //update

                //แสดงผลสำเร็จ
                Swal.fire({
                    icon: "success",
                    title: "Added to Wishlist!",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                //แสดงผล popup หากมีสินค้าอยู่ใน wishlist
                Swal.fire({
                    icon: "info",
                    title: "The product is already in the Wishlist.",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
        .catch(error => {
            console.error("Error fetching product:", error);
            Swal.fire({
                icon: "error",
                title: "Failed to Add to Wishlist",
                text: "Could not fetch product details.",
                showConfirmButton: true
            });
        });
}

function displayWishlist() {
    var wishlistContainer = document.getElementById("productWishlist");
    wishlistContainer.innerHTML = ""; //ลบข้อมูลเก่าเพื่อโหลดใหม่ทุกครั้ง

    //เช็คว่าสินค้าอยู่ใน wishlist
    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = `<p>No products in the Wishlist!</p>`;
        return;
    }

    //แสดงผลแถบสินค้าใน wishlist
    wishlist.forEach(item => {
        var wishlistItem = `
            <div class="wishlist-item">
                <img src="${item.image_path}" alt="${item.product_name}" class="wishlist-img">
                <div class="wishlist-info">
                    <h3>${item.product_name}</h3>
                    <p>${item.detail}</p>
                    <button class="wishlist-remove-btn" onclick="removeFromWishlist('${item.itemid}')">X</button>
                </div>
            </div>
        `;
        wishlistContainer.innerHTML += wishlistItem;
    });
}

function removeFromWishlist(product_id) {
    // Remove the product from the wishlist
    wishlist = wishlist.filter(item => item.itemid !== product_id);
    saveWishlistToLocalStorage();
    displayWishlist(); 

    Swal.fire({
        icon: "success",
        title: "Removed from Wishlist!",
        showConfirmButton: false,
        timer: 1500
    });
}


displayWishlist();




document.addEventListener("DOMContentLoaded", function() {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    console.log("Loaded cart from localStorage:", savedCart); // ตรวจสอบว่าโหลดข้อมูลถูกต้อง
    
    if (savedCart && Array.isArray(savedCart)) { // ตรวจสอบว่า savedCart เป็น array
        cart = savedCart;
        rendercart(); // รีเฟรชตะกร้าตามข้อมูลที่เก็บไว้
    } else {
        console.log("No valid cart data in localStorage");
    }
});






function toggleSearchBox() {
    var popup = document.getElementById("searchPopup");
    if (popup.style.display === "none" || popup.style.display === "") {
        popup.style.display = "block";
    } else {
        popup.style.display = "none";
    }
}




function checkCaptcha() {
        
    if (grecaptcha.getResponse().length === 0) {
        alert('Please complete the CAPTCHA');
        return false; 
    }
    return true; 
}



