router.post('/account_post' , (req , res) => {
    console.log('/account_post');
    //admin
    const email = req.body.email;
    const password = req.body.password;
    
    let sql = `SELECT * FROM admin WHERE admin_email= ? AND admin_password= ?`;
    
    connection.query(sql, [email,password],function(error ,  results) {
        if (error) throw error;
            console.log(`${results.length} rows returned`);

        if (results.length >0){
            console.log(`Found ${email}`)
            
            const token = jwt.sign({email:email}, secretKey, {expiresIn: '1h'});

            res.cookie('auth_token' ,token,{
                httpOnly: true, // Prevents client-side access to the cookie
                secure: true, // Ensures the cookie is only sent over HTTPS
                maxAge: 3600000 // Expires in 1 hour
            });

            res.redirect('/dashboard');
        }
        else{
            console.log("Not found")

            res.redirect("index")
        }
        
        
        });

});

router.post('/logout', (req, res) => {
    res.clearCookie('auth_token'); // Deletes the JWT cookie
    res.redirect('/index'); // Redirect to login or homepage
});


router.get("/api/recommend", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category LIMIT 5;'; // แทนที่ด้วยชื่อของตารางของคุณ

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

router.get("/api/men", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const men = 'M';
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid WHERE items.gender = ? GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category LIMIT 5;'; // แทนที่ด้วยชื่อของตารางของคุณ

    connection.query(sqlQuery, men ,(err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});



router.get("/api/women", (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const women = 'W';
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid WHERE items.gender = ? GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category;'; // แทนที่ด้วยชื่อของตารางของคุณ

    connection.query(sqlQuery, women ,(err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});

// console log data in database

app.use((req, res, next) => {
    res.status(404).send('File not found');
  });

const sqlQuery = 'SELECT * FROM items';

connection.query(sqlQuery, (err, results) => {
if (err) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
    return;
    }
    console.log('ข้อมูลที่ได้:', results);
    console.log(typeof results);
  });


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
    const admin_role = req.body.admin_role

    try {
        connection.query(
            'INSERT INTO admin (adminid, username, firstname, lastname, admin_email, admin_password, phone ,admin_status) VALUES (?, ?, ?, ?, ?, ? ,? , ?)',
            [adminid, username, firstname, lastname, admin_email, admin_password, phone, admin_status],
            (err, results) => {
                if (err) {
                    console.log("Error while inserting an item into the database:", err);
                    return res.status(400).send('Error inserting item');
                }

                res.redirect('/administrators');
            }
        );
    } catch (err) {
        console.log("Unexpected error:", err);
        return res.status(500).send('Server error');
    }
});

router.get("/api/admin" , authenticateToken , (req, res) => {
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




router.post('/form-post', authenticateToken, upload.array('images', 10), (req, res) => {
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
                            res.redirect('/admin_product');
                        })
                        .catch(err => {
                            console.error("Error uploading images:", err);
                            res.status(500).send('Error uploading images');
                        });
                } else {
                    console.log("No files uploaded. Redirecting to /admin_product.");
                    res.redirect('/admin_product');
                }
            }
        );
    } catch (err) {
        console.log("Unexpected error:", err);
        return res.status(500).send('Server error');
    }
    
});


router.get("/api/products" , (req, res) => {
    // ดึงข้อมูลจากฐานข้อมูลแล้วส่งเป็น JSON
    const sqlQuery = 'SELECT items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category, items.gender ,MIN(item_images.image_path) AS image_path FROM items INNER JOIN item_images ON items.itemid = item_images.itemid GROUP BY items.itemid, items.product_name, items.detail, items.price, items.weight, items.color, items.material, items.width, items.length, items.height, items.item_condition, items.item_year, items.brand, items.amount, items.descriptions, items.item_customer, items.category;'; // แทนที่ด้วยชื่อของตารางของคุณ

    connection.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err.message);
        res.status(500).send('เกิดข้อผิดพลาดในการดึงข้อมูล');
        return;
      }
      res.json(results); // ส่งข้อมูลในรูปแบบ JSON
    });
});


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


// Ensure this route exists in your Express server file
app.delete('/api/products/:itemid',authenticateToken, (req, res) => {
    const { itemid } = req.params; // Capture the itemid from the URL
    console.log(`Delete request received for itemid: ${itemid}`);
    
    // Proceed with database deletion
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


app.delete('/api/admin/:adminid', authenticateToken, (req, res) => {
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


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'image/item'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // ใช้เวลาในการตั้งชื่อไฟล์เพื่อป้องกันชื่อซ้ำ
    }
  });
  
  const upload = multer({ storage: storage });



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


    function authenticateToken(req, res, next) {
        const token = req.cookies.auth_token;
        if (!token) return res.redirect('/account_post?error=unauthorized');

        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.redirect('/account_post?error=unauthorized');
            req.user = user;
            next();
        });
    }