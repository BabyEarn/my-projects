// Fetch
fetch('http://localhost:3030/api/products')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('product_result');
        tableBody.innerHTML = ''; // Clear old data

        // Loop Json
        data.forEach(product => {
            const row = document.createElement('tr');
            const fullPath = product.image_path;

            row.innerHTML = `
                <td><img src="${fullPath}" alt="Product Image" width="50" height="50"></td>
                <td class="itemid">${product.itemid}</td>
                <td class="product_name">${product.product_name}</td>
                <td class="brand">${product.brand}</td>
                <td class="price">${product.price}</td>
                <td>
                    <button onclick="window.location.href='/edit?edit_id=${product.itemid}'" class="edit-button">Edit</button>
                </td>
                <td><button onclick="deleteProduct('${product.itemid}', this)" class="delete-button">Delete</button></td>
                `;
            tableBody.appendChild(row); //add child row

        });
    })
    .catch(error => console.error('Error fetching data:', error));








 

    function deleteProduct(itemid, buttonElement) {
        console.log(`Attempting to delete product with ID: ${itemid}`);
        fetch(`http://localhost:3030/api/products/${itemid}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const row = buttonElement.closest('tr');
                row.remove();
                console.log(`product with ID ${itemid} deleted successfully.`);


                // แสดงข้อความแจ้งเตือนสำเร็จ
            Swal.fire({
                icon: "success",
                title: "Deleted successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            
            } else {
                return response.json().then(data => {
                    console.error('Failed to delete product:', data.error);
                });
            }
        })
        .catch(error => console.error('Error occurred while deleting:', error));
    
    }
