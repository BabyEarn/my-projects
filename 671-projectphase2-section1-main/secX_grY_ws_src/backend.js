const express=require('express');
const path=require('path');
const app=express(); 
app.use(express.json()); 
const router = express.Router();
const dotenv = require("dotenv");
const mysql = require('mysql2');
const multer = require('multer')
const cors = require('cors');
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const secretKey = 'your_secret_key';

app.use(cors());
app.use(cookieParser());
app.use(router);
dotenv.config();


//เชื่อม cors เพื่อให้เข้าถึงได้
router.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

router.use(express.json());
router.use(express.urlencoded({ extended: true })); 


//สำหรับเก็บข้อมูลรูปภาพในเครื่องตัวเอง(Disk)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../frontend/image/item'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // ใช้เวลาในการตั้งชื่อไฟล์เพื่อป้องกันชื่อซ้ำ
    }
  });
  
  const upload = multer({ storage: storage });


  //connect mysql
  var connection = mysql.createConnection({
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USERNAME,
    password : process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE
 });

 connection.connect(function(err) {
    if(err) throw err;
    console.log(`Connected DB: ${process.env.MYSQL_DATABASE} `);
});
 

//config jwt token
function authenticateToken(req, res, next) {
    const token = req.cookies.auth_token;
    if (!token) return res.redirect('/account_post?error=unauthorized');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/account_post?error=unauthorized');
        req.user = user;
        next();
    });
}

// REST API Delete Product by params
// Method: Delete
// URL: http://localhost:3030/api/products
// Params: /0001
// ------------------------------------------
// URL: http://localhost:3030/api/products
// Params: /0002


// Ensure this route exists in your Express server file
app.delete('/api/products/:itemid', (req, res) => {
    const { itemid } = req.params;
    console.log(`Delete request received for itemid: ${itemid}`);

    connection.query('DELETE FROM items WHERE itemid = ?', [itemid], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Failed to delete item' });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Item with id ${itemid} deleted successfully` });
        } else {
            return res.status(404).json({ error: `Item with id ${itemid} not found` });
        }
    });
});


// REST API Delete Product by params
// Method: Delete
// URL: http://localhost:3030/api/admin
// Params: /0001
// ------------------------------------------
// URL: http://localhost:3030/api/admin
// Params: /0002

app.delete('/api/admin/:adminid', (req, res) => {
    const { adminid } = req.params;
    console.log(`Delete request received for adminid: ${adminid}`);
    
    connection.query('DELETE FROM admin WHERE adminid = ?', [adminid], (err, result) => {
        if (err) {
            console.error('Error deleting admin:', err);
            return res.status(500).json({ error: 'Failed to delete admin' });
        }

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: `Admin with ID ${adminid} deleted successfully` });
        } else {
            return res.status(404).json({ error: `Admin with ID ${adminid} not found` });
        }
    });
});

// REST API GET product
// Method: GET
// URL: http://localhost:3030/api/products

router.get("/api/products", (req, res) => {
    const { searchinput, brand, category, color, min_price, max_price } = req.query;

    let sqlQuery = `
        SELECT items.itemid, items.product_name, items.detail, items.price, items.color, items.brand,
               items.category, MIN(item_images.image_path) AS image_path
        FROM items
        INNER JOIN item_images ON items.itemid = item_images.itemid
    `;

    const conditions = [];
    if (searchinput) conditions.push(`items.product_name LIKE '%${searchinput}%'`);
    if (brand) conditions.push(`items.brand IN (${Array.isArray(brand) ? brand.map(b => `'${b}'`).join(",") : `'${brand}'`})`);
    if (min_price) conditions.push(`items.price >= ${parseFloat(min_price)}`);
    if (max_price) conditions.push(`items.price <= ${parseFloat(max_price)}`);

    if (conditions.length > 0) sqlQuery += ` WHERE ${conditions.join(" AND ")}`;
    sqlQuery += `
        GROUP BY items.itemid, items.product_name, items.detail, items.price, items.color, items.brand, items.category
    `;

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error executing query:", err.message);
            res.status(500).send("เกิดข้อผิดพลาด");
            return;
        }
        res.json(results);
    });
});


// REST API GET Product image url
// Method: GET
// URL: http://localhost:3030/api/product_image

router.get("/api/product_image" , (req,res) => {
    console.log("/api/product_image");
    const sqlQuery = 'SELECT * FROM items INNER JOIN item_images ON items.itemid = item_images.itemid';

    connection.query(sqlQuery,(err,results) =>{
        if(err){
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results);
    });
});

// REST API GET Recommend Product
// Method: GET
// URL: http://localhost:3030/api/recommend

router.get("/api/admin" , (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const sqlQuery = 'SELECT * FROM admin;'; // แทนที่ด้วยชื่อของตารางของคุณ

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

// REST API GET Recommend Product
// Method: GET
// URL: http://localhost:3030/api/recommend

router.get("/api/recommend", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions,  items.category LIMIT 10;'; 

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

// REST API GET Product for Men
// Method: GET
// URL: http://localhost:3030/api/men

router.get("/api/men", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const men = 'M';
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions,  items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid WHERE items.gender = ? GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.category;'; 

    connection.query(sqlQuery, men ,(err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

// REST API GET All Product
// Method: GET
// URL: http://localhost:3030/api/allproducts


router.get("/api/allproducts", (req, res) => {
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.category, items.gender, MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.category, items.gender;';

    connection.query(sqlQuery, (err, results) => {
        if (err) {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
            res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
            return;
        }
        res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});




// REST API GET Product for Women
// Method: GET
// URL: http://localhost:3030/api/women


router.get("/api/women", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const women = 'W';
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions,  items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid WHERE items.gender = ? GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.category;'; 

    connection.query(sqlQuery, women ,(err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

// REST API POST 
// Testing Insert a new Admin
// Method: POST
// URL: http://localhost:3030/form_post_admin
// body: raw JSON
// {
//     "adminid" : "0001",
//     "username" : "kimmy",
//     "firstname" : "kim",
//     "lastname" : "My",
//     "admin_email" : "kimmy@gmail.com",
//     "admin_password" : "123456",
//     "phone" : "0812345678",
//     "admin_status" : "Active"
// }
// -----------------------------------------------------
// {
//     "adminid" : "0002",
//     "username" : "Filmmy",
//     "firstname" : "Film",
//     "lastname" : "Narak",
//     "admin_email" : "test@test.com",
//     "admin_password" : "111111",
//     "phone" : "0907865654",
//     "admin_status" : "Active"
// }


router.post('/form_post_admin', authenticateToken, (req, res) => {
    console.log('/form_post_admin');

    const adminid = req.body.adminid;
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const admin_email = req.body.admin_email;
    const admin_password = req.body.admin_password;
    const phone = req.body.phone;
    const admin_status = req.body.admin_status

    try {
        connection.query(
            'INSERT INTO admin (adminid, username, firstname, lastname, admin_email, admin_password, phone ,admin_status) VALUES (?, ?, ?, ?, ?, ? ,? , ?)',
            [adminid, username, firstname, lastname, admin_email, admin_password, phone, admin_status],
            (err, results) => {
                if (err) {
                    console.log("Error while inserting an item into the database:", err);
                    return res.status(400).send('Error inserting item');
                }
                console.log("save successful")
                res.redirect('http://localhost:3000/administrators');
            }
        );
    } catch (err) {
        console.log("Unexpected error:", err);
        return res.status(500).send('Server error');
    }
});

// REST API POST 
// Testing Insert a new Product
// Method: POST
// URL: http://localhost:3030/form-post
// body: form-data

// item_id:0001
// product_name:Test Product 1
// detail:Detailed description for testing the API.
// price:12345
// weight:15
// color:white
// material:Leather
// W:15
// L:20
// H:10
// condition:Excellent
// year:2023
// brand:Dior
// amount:1
// descriptions:Testing product
// category:Handbags
// gender:M
//images:(file)

// --------------------------------------------------------------
// item_id:0002
// product_name:Test Product 2
// detail:Detailed description for testing the API.
// price:12345
// weight:15
// color:white
// material:Leather
// W:15
// L:20
// H:10
// condition:Good
// year:2023
// brand:Dior
// amount:1
// descriptions:Testing product
// category:Handbags
// gender:M
//images:(file)


router.post('/form-post', upload.array('images', 10), (req, res) => {
    console.log(req.path);
    console.log(req.body);
       
    const itemid = req.body.item_id;
    const product_name = req.body.product_name;
    const detail = req.body.detail;
    const price = req.body.price;
    const weight = req.body.weight;
    const color = req.body.color;
    const material = req.body.material;
    const width = req.body.W;
    const length = req.body.L;
    const height = req.body.H;
    const item_condition = req.body.condition;
    const item_year = req.body.year;
    const brand = req.body.brand;
    const amount = req.body.amount;
    const descriptions = req.body.descriptions;
    const category = req.body.category; 
    const gender = req.body.gender

    try {
        connection.query(
            'INSERT INTO items (itemid, product_name, detail, price, weight, color, material, width, length, height, item_condition, item_year, brand, amount, descriptions, category ,gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [itemid, product_name, detail, price, weight, color, material, width, length, height, item_condition, item_year, brand, amount, descriptions, category , gender],
            (err, results) => {
                if (err) {
                    console.log("Error while inserting an item into the database:", err);
                    return res.status(400).send('Error inserting item');
                }

                const insertedItemId = results.insertId || itemid;

                if (req.files && req.files.length > 0) {
                    const imagePromises = req.files.map(file => {
                        const imagePath = '/image/item/' + file.filename;
                        return new Promise((resolve, reject) => {
                            connection.query(
                                'INSERT INTO item_images (itemid, image_path) VALUES (?, ?)',
                                [insertedItemId, imagePath],
                                (err, results) => {
                                    if (err) {
                                        console.log("Error while inserting image path:", err);
                                        reject(err);
                                    } else {
                                        console.log("Inserted image path:", imagePath);
                                        resolve(results);
                                    }
                                }
                            );
                        });
                    });

                    Promise.all(imagePromises)
                        .then(() => {
                            console.log("All images uploaded successfully");
                            res.redirect('http://localhost:3000/admin_product');
                        })
                        .catch(err => {
                            console.error("Error uploading images:", err);
                            res.status(500).send('Error uploading images');
                        });
                } else {
                    console.log("No files uploaded. Redirecting to /admin_product.");
                    res.redirect('http://localhost:3000/admin_product');
                }
            }
        );
    } catch (err) {
        console.log("Unexpected error:", err);
        return res.status(500).send('Server error');
    }
    
});


// REST API POST 
// Testing Check Email and Password
// Method: POST
// URL: http://localhost:3030/account_post
// body: raw JSON
// {
//     "email" : "test@test.com",
//     "password" : "111111"
// }
//-------------------------------------
// {
//     "email" : "admin@admin.com",
//     "password" : "admin"
// }






const recaptchaSecretKey = '6LdCzowqAAAAAC4G9WmJ2ANmcfs2VkONt_Um16mO'; // Replace with your reCAPTCHA secret key


router.post('/account_post', async (req, res) => {
    console.log('/account_post');
    const token = req.body['g-recaptcha-response']; // reCAPTCHA token from the frontend
    const email = req.body.email; // User email
    const password = req.body.password; // User password

    if (!token) {
        return res.status(400).send('CAPTCHA token is missing');
    }

    // Verify CAPTCHA
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const verifyBody = `secret=${recaptchaSecretKey}&response=${token}`;

    try {
        const captchaResponse = await fetch(verifyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: verifyBody,
        });
        const captchaData = await captchaResponse.json();

        if (!captchaData.success) {
            console.log('CAPTCHA validation failed:', captchaData['error-codes']);
            return res.status(400).send('CAPTCHA validation failed');
        }

        console.log('CAPTCHA validation succeeded');

        // Continue with user authentication
        let sql = `SELECT * FROM admin WHERE admin_email= ?`;

        connection.query(sql, [email], function (error, results) {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Database error');
            }

            console.log(`${results.length} rows returned`);

            if (results.length > 0) {
                const admin = results[0];

                // Validate password (replace with bcrypt.compare in production)
                if (password === admin.admin_password) {
                    console.log(`Authenticated ${email}`);

                    // Generate JWT token
                    const token = jwt.sign({ email: email }, secretKey, { expiresIn: '1h' });

                    res.cookie('auth_token', token, {
                        httpOnly: true,
                        secure: false, // Use true if using HTTPS
                        maxAge: 3600000,
                    });

                    // Log the login action
                    const loginInfoPk = Date.now(); // Unique ID for login_info
                    const formatDate = (date) => {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        const seconds = String(date.getSeconds()).padStart(2, '0');
                        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
                    };

                    const formattedTimestamp = formatDate(new Date());
                    const insertSql = `INSERT INTO login_info (login_info_pk, adminid, login_time, action) VALUES (?, ?, ?, ?)`;

                    connection.query(
                        insertSql,
                        [loginInfoPk, admin.adminid, formattedTimestamp, 'signin'],
                        (err) => {
                            if (err) {
                                console.error('Error inserting login info:', err);
                                return res.status(500).send('Database error');
                            }
                            console.log('Login info inserted successfully');
                            console.log(formattedTimestamp , email , admin.adminid , "sign-in")
                            return res.redirect('http://localhost:3000/dashboard');
                        }
                    );
                } else {
                    console.log('Invalid password');
                    return res.redirect('http://localhost:3000/index');
                }
            } else {
                console.log('User not found');
                return res.redirect('http://localhost:3000/index');
            }
        });
    } catch (error) {
        console.error('Error verifying CAPTCHA:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;




// REST API POST 
// Update Product information with itemID
// Method: POST
// URL: http://localhost:3030/form-update
// body: raw JSON
// {
//     "item_id": "0001", 
//     "product_name": "Update Product 1",
//     "detail": "Detailed description for testing the Update API.",
//     "price": "12345",
//     "weight": "15",
//     "color": "white",
//     "material": "Leather",
//     "W": "15",
//     "L": "20",
//     "H": "10",
//     "condition": "Excellent",
//     "year": "2023",
//     "brand": "Dior",
//     "amount": 1,
//     "descriptions": "product for update",
//     "category": "Bag",
//     "gender": "M"
//   }
// --------------------------------------------------------
// {
//     "item_id": "0002", 
//     "product_name": "Update Product 2",
//     "detail": "Detailed description for testing the Update API.",
//     "price": "12345",
//     "weight": "15",
//     "color": "white",
//     "material": "Leather",
//     "W": "15",
//     "L": "20",
//     "H": "10",
//     "condition": "Excellent",
//     "year": "2023",
//     "brand": "Dior",
//     "amount": 1,
//     "descriptions": "product for update",
//     "category": "Bag",
//     "gender": "M"
//   }

router.post('/form-update', (req, res) => {
    console.log(req.path);
    console.log(req.body);

    // Extract form data
    const itemid = req.body.item_id;
    const product_name = req.body.product_name;
    const detail = req.body.detail;
    const price = req.body.price;
    const weight = req.body.weight;
    const color = req.body.color;
    const material = req.body.material;
    const width = req.body.W;
    const length = req.body.L;
    const height = req.body.H;
    const item_condition = req.body.condition;
    const item_year = req.body.year;
    const brand = req.body.brand;
    const amount = req.body.amount;
    const descriptions = req.body.descriptions;
    const category = req.body.category;
    const gender = req.body.gender;

    console.log(req.body.item_id,product_name)

    try {
        //UPDATE query
        connection.query(
            `UPDATE items 
             SET product_name = ?, 
                 detail = ?, 
                 price = ?, 
                 weight = ?, 
                 color = ?, 
                 material = ?, 
                 width = ?, 
                 length = ?, 
                 height = ?, 
                 item_condition = ?, 
                 item_year = ?, 
                 brand = ?, 
                 amount = ?, 
                 descriptions = ?, 
                 category = ?, 
                 gender = ?
             WHERE itemid = ?`,
            [
                product_name,
                detail,
                price,
                weight,
                color,
                material,
                width,
                length,
                height,
                item_condition,
                item_year,
                brand,
                amount,
                descriptions,
                category,
                gender,
                itemid
            ],
            (err, results) => {
                if (err) {
                    console.error('Error while updating the item in the database:', err);
                    return res.status(400).send('Error updating item');
                }

                console.log('Item updated successfully:', results);
                res.redirect('http://localhost:3000/admin_product'); // Redirect to admin product page
            }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send('Server error');
    }
});

  
// REST API POST 
// Update Admin information with Admin ID
// Method: POST
// URL: http://localhost:3030/admin-update
// body: raw JSON
// {
//     "adminid" : "0001",
//     "username" : "updatetestadmin 1",
//     "firstname" : "kim",
//     "lastname" : "my",
//     "admin_email" : "update2@gmail.com",
//     "admin_password" : "123456",
//     "phone" : "0812345678",
//     "admin_status" : "Active"
// }
// -----------------------------------
// {
//     "adminid" : "0002",
//     "username" : "updatetestadmin 2",
//     "firstname" : "Film",
//     "lastname" : "My",
//     "admin_email" : "update1@gmail.com",
//     "admin_password" : "111111",
//     "phone" : "0908765434",
//     "admin_status" : "Active"
// }
router.post('/admin-update', (req, res) => {
    console.log(req.path);
    console.log(req.body);


    const adminid = req.body.adminid;
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const admin_email = req.body.admin_email;
    const admin_password = req.body.admin_password;
    const phone = req.body.phone;
    const admin_status = req.body.admin_status;



    try {
        //UPDATE query
        connection.query(
            `UPDATE admin 
             SET username = ?,
                 firstname = ?,
                 lastname = ?,
                 admin_email = ?,
                 admin_password = ?,
                 phone = ?,
                 admin_status = ?
             WHERE adminid = ?`,
            [
                username,
                firstname,
                lastname,
                admin_email,
                admin_password,
                phone,
                admin_status,
                adminid
            ],
            (err, results) => {
                if (err) {
                    console.error('Error while updating the item in the database:', err);
                    return res.status(400).send('Error updating item');
                }
                console.log('Item updated successfully:', results);
                res.redirect('http://localhost:3000/Administrators'); // Redirect to admin product page
            }
        );
    } catch (err) {
        console.error('Unexpected error:', err);
        res.status(500).send('Server error');
    }
});

  
//TEST
//http://localhost:3030/logout

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token'); // Deletes the JWT cookie
    res.redirect('http://localhost:3000/index'); // Redirect to login or homepage
    console.log('logout successful')
});









//listen Port
app.listen(process.env.PORT ,  function(){
    console.log(`Server listening on port: ${process.env.PORT}`)
});


