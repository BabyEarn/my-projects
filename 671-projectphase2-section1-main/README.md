# วิธีการใช้งาน Gadypadie Web Application ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

1. สิ่งที่่ต้อง install ก่อน 
package.json
express
dotenv
mysql2
multer
cors
jsonwebtoken
cookie-parser

2. ก่อนใช้งานระบบจะแก้ไขในไฟล์ package.json เพื่อทำการใช้ nodemon
   ```js
   "scripts": {
    "start": "nodemon backend.js"},
  
3. ในไฟล์ .env ให้ตั้งค่า
   
* สำหรับ Frontend ```PORT: 3000``` 
  ```.env
   PORT = 3000
  
* สำหรับ Backend (Server) ```PORT: 3030``` กรอกข้อมูลให้ตรงกับ Database (Mysql)
  ```.env
   PORT = 3030
   MYSQL_HOST =
   MYSQL_USERNAME = 
   MYSQL_PASSWORD = 
   MYSQL_DATABASE =
  
* และตรวจสอบว่ามี
  ```js
  dotenv.config();
  
4. Database (Mysql)
* **กด execute ทุกบรรทัดเพื่อสร้าง table และ สร้าง default value เพื่อเข้าสู่ระบบ**
  ```sql
  INSERT INTO admin (adminid,username,firstname,lastname,admin_email,admin_password,phone,admin_status) value ("0001","admin" ,"admin","admin","admin@admin.com","111111","000000000","Actve");

5. เมื่อทำการตั้งค่าเสร็จเรียบร้อย ทำการ run โดยการ เขียน
   ```bash
   npm strat
   ```
   ใน Terminal ทั้งไฟล์  ```PORT: 3000``` ```PORT: 3030```

6. หากสำเร็จและสามารถเชื่อมต่อฐานข้อมูลได้จะปรากฏดังนี้
    ```bash
   > nodemon backend.js
    [nodemon] 3.1.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,cjs,json
    [nodemon] starting `node backend.js`
    Server listening on port: 3030
    Connected DB: shopdatabase
   ```
    
   ```bash
    > nodemon frontend.js
    
    [nodemon] 3.1.7
    [nodemon] to restart at any time, enter `rs`
    [nodemon] watching path(s): *.*
    [nodemon] watching extensions: js,mjs,cjs,json
    [nodemon] starting `node frontend.js`
    Server listening on port: 3000
   ```
  

## Admin

เมื่อระบบทั้งสองสามารถใช้งานได้
admin สามารถเข้าสู่ระบบผ่านช่อวทางเดียวกันกับ user ปกติ
โดยรหัสเริ่มต้นคือ
* ```email : admin@admin.com```
*  ```password : 111111```
  
และกดเพื่อยืนยันตัวตนด้วย Captcha เพื่อยีนยันตัวตนเพื่อเข้าสู่ระบบต่อไป ระบบจะให้ Token เพื่อสามารถเข้าถึงหน้าที่ต้องการ authenticateToken โดยมีเวลา 1 ชั่วโมงก่อนที่ token จะหมดอายุ

Admin สามารถเข้าถึงได้ 2 หน้า คือ Product และ Administrator
เมื่อเข้าหน้า Administrator ได้แล้ว admin สามารถจัดการ admin account และ product ได้

### วิธีการเพิ่มสินค้า
1. กดเข้าที่หน้า product
2. Add Product
3. กรอกข้อมูลสินค้าที่ต้องการระบุ โดย **ยี่ห้อสินค้าต้องกรอกตัวแรกเป็นพิมพ์ใหญ่เท่านั้น** และ **สีต้องกรอกเป็นพิมพ์เล็กทั้งหมด** เพื่อประสิทธิภาพในการค้นหา 
4. เพิ่มรูปภาพสินค้าได้สูงสุด 4 ภาพ โดนจะจัดเก็บใน disk ของเครื่องนั้นๆ
5. กด Add
   
#### ตัวอย่าง
item_id | product_name | detail | price | weight | color | material | W | L | H | condition | year | brand | amount | descriptions | category | gender | images |
---------|-------------|--------|-------|--------|-------|----------|---|---|---|-----------|------|-------|--------|--------------|----------|--------|--------|
0001     |Dior Limited |nice one|123456 |500     |white  |cotton    |34 |45 |56 |Good       |2024  |Dior   |1       |no comment    |Bag       |W       |```img```

จากนั้นระบบจะพากลับไปที่หน้า Product

สามารถ Edit และ Delete ได้ โดนกดผ่าน **Button**

สามารถ Edit แก้ไขสินค้านั้นๆได้ยกเว้น itemid


### วิธีการเพิ่มบัญชี
1. กดเข้าที่หน้า Administrators
2. Add Admin
3. กรอกข้อมูลบัญชีที่ต้องการระบุ
5. กด Add

#### ตัวอย่าง
ADMIN ID | USERNAME | FIRSTNAME | LASTNAME | ADMIN_EMAIL | ADMIN_PASSWORD | PHONE | ADMIN_STATUS
---------|----------|-----------|----------|-------------|----------------|-------|-----------|
0001     |admin1    | firstadmin| numberone|admin@admin.com|123456        |0812324567|Active


จากนั้นระบบจะพากลับไปที่หน้า **Administrators**

สามารถ Edit และ Delete ได้ โดนกดผ่าน **button**

สามารถ Edit แก้ไขสินค้านั้นๆได้ยกเว้น Admin ID

เมื่อต้องการออกจากระบบให้กดปุ่ม logout เพื่อทำการลบ token เพื่อไม่ให้ผู้ใช้รายอื่นสามารถเข้าระบบหลังบ้านผ่านเครื่องที่อาจจะมี token เหลืออยู่ได้

หากไม่มี token แล้วจะไม่สามารถเข้าสู่หน้าจัดการของผู้ดูแลระบบได้และจะขึ้นแจ้งเตือนดังนี้
```plaintext
http://localhost:3000/account_post?error=unauthorized
```

## USER
สามารถดูสินค้าได้ผ่านหน้า Men, Women, Recommend และสามารถกรองข้อมูลสินค้าและหาชื่อสินค้าได้ผ่านระบบ search และ advanced search ได้ โดนสามารถระบุชื่อสินค้า ยี่ห้อ สี ประเภท และ ราคาสูงสุดและต่ำสุดได้


 



