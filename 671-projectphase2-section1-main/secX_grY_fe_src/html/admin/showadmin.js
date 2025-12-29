// Fetch
fetch('http://localhost:3030/api/admin')
    .then(response => response.json())
    .then(data => {
        const tableBody = document.getElementById('showadmin');
        tableBody.innerHTML = ''; // Clear old data

        

        // Loop Json
        data.forEach(admin => {
            const row = document.createElement('tr');

            row.innerHTML = `
                    <td class="adminid">${admin.adminid}</td>
                    <td class="admin_email">${admin.admin_email}</td>
                    <td class="username">${admin.username}</td>
                    <td class="role">Admin</td>
                    <td class="admin_status">${admin.admin_status}</td>
                    <td>
                        <button onclick="window.location.href='edit_admin/?edit_id=${admin.adminid}'" class="edit-button">Edit</button>
                    </td>
                    <td><button onclick="deleteAdmin('${admin.adminid}', this)" class="delete-button">Delete</button></td>
                `;
            tableBody.appendChild(row); // Add Child row
        });
    })
    .catch(error => console.error('Error fetching data:', error));




    function deleteAdmin(adminid, buttonElement) {
        console.log(`Attempting to delete admin with ID: ${adminid}`);
        fetch(`http://localhost:3030/api/admin/${adminid}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                const row = buttonElement.closest('tr');
                row.remove();
                console.log(`Admin with ID ${adminid} deleted successfully.`);


                // แสดงข้อความแจ้งเตือนสำเร็จ
            Swal.fire({
                icon: "success",
                title: "Deleted successfully!",
                showConfirmButton: false,
                timer: 1500
            });
            
            } else {
                return response.json().then(data => {
                    console.error('Failed to delete admin:', data.error);
                });
            }
        })
        .catch(error => console.error('Error occurred while deleting:', error));
    }