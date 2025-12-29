document.addEventListener("DOMContentLoaded", function() {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const subtotal = parseFloat(localStorage.getItem("subtotal")) || 0;
    let shipping = 0;
    


    const itemCountElement = document.getElementById("item-count");
    const itemList = document.getElementById("item-list");
    const subtotalElement = document.getElementById("subtotal");
    const shippingElement = document.getElementById("shipping");
    const totalElement = document.getElementById("total");

    // แสดงจำนวนสินค้าและข้อมูลในตะกร้า
    itemCountElement.innerText = `You have ${cartItems.length} item(s) in your cart.`;
    cartItems.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");
        itemElement.innerHTML = `
            <img src="${item.img}" alt="${item.name}" style="width:80px; height:auto; margin-right:10px;">
            <div class="item-details">
                <p>${item.name}</p>
                <div class="item-price-quantity">
                <p class="item-price">${item.price.toLocaleString()} THB</p>
                <p class="item-quantity">QTY: ${item.quantity}</p>
                </div>
            </div>
        `;
        itemList.appendChild(itemElement);
        document.getElementById("totalAmount").value = item.price;
    });

    // แสดงราคาสุทธิและราคารวม
    subtotalElement.innerText = `Subtotal: ${subtotal.toLocaleString()} THB`;
    shippingElement.innerText = `Shipping: ${shipping.toLocaleString()} THB`;
    totalElement.innerText = `Total: ${(subtotal + shipping).toLocaleString()} THB`;


    // ฟังก์ชันสำหรับอัปเดตค่าส่งและราคาทั้งหมด
    function updateTotal(shippingCost) {
        shipping = parseFloat(shippingCost);
        const total = subtotal + shipping;

        shippingElement.innerText = `Shipping: ${shipping.toLocaleString()} THB`;
        totalElement.innerText = `Total: ${(subtotal + shipping).toLocaleString()} THB`;
        document.getElementById("totalAmount").value = total;

        console.log("Subtotal:", subtotal);
        console.log("Shipping:", shipping);
        console.log("Total:", total);
        
        
        
    }

    // ดักจับการเปลี่ยนแปลงของวิธีการจัดส่ง
    document.getElementById("dhl").addEventListener("change", function() {
        if (this.checked) {
            updateTotal(0); // ไม่คิดค่าส่งสำหรับ DHL
            
            

        }
    });

    document.getElementById("messenger").addEventListener("change", function() {
        if (this.checked) {
            updateTotal(200); // เพิ่มค่าส่ง 200 บาทสำหรับ Messenger
            
        }
    });
});






// ฟังก์ชันสำหรับแสดง popup
function pay_open() {
    document.getElementById("qrPopup").style.display = "flex";
}

// ฟังก์ชันสำหรับปิด popup
function closePopup() {
    document.getElementById("qrPopup").style.display = "none";
    document.querySelector(".pay-button").style.display = 'block';
}



function saveQRCode() {
    // เลือก <img> ที่มี ID เป็น imgqr
    var qrCodeImage = document.getElementById("imgqr");

    if (!qrCodeImage.src) {
        alert("QR Code not available.");
        return;
    }

    // สร้างลิงก์สำหรับดาวน์โหลด
    var link = document.createElement("a");
    link.href = qrCodeImage.src;  // กำหนด URL ของภาพที่ต้องการดาวน์โหลด
    link.download = "qr-code.png";  // ตั้งชื่อไฟล์ที่ต้องการบันทึก

    // คลิกที่ลิงก์เพื่อเริ่มการดาวน์โหลด
    link.click();
}