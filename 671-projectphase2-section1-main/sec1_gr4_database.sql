create database if not exists shopdatabase_final;

use shopdatabase_final;

create table items
(
	itemid varchar(100) not null unique,
    product_name varchar(100) not null,
    detail varchar(500) not null,
    price varchar(100) not null,
    weight varchar(100) not null,
    color varchar(100) not null,
    material varchar(100) not null,
    width varchar(100) not null,
    length varchar(100) not null,
    height varchar(100) not null,
    item_condition varchar(500) not null,
    item_year varchar(4) not null,
    brand varchar(100) not null,
    amount int(1) not null,
    descriptions varchar(1000),
    category varchar(100),
    gender varchar(1),
    
    constraint PK_itemid primary key (itemid)
    

    
);

CREATE TABLE item_images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    itemid VARCHAR(100) NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    
    CONSTRAINT FK_item FOREIGN KEY (itemid) REFERENCES items (itemid) ON DELETE CASCADE
);




create table admin 
(
	adminid varchar(10) not null unique default '0',
    username varchar(100) not null default 'admin555',
    firstname varchar(100) not null default 'admin555',
    lastname varchar(100) not null default 'admin555',
    admin_email varchar(100) not null default 'admin@admin.com',
    admin_password varchar(100) not null default 'admin555',
    phone varchar(100) not null default '0000000000',
		
    admin_status char(100) not null default 'Active',
    
    constraint PK_adminid primary key (adminid)
);

create table login_info
(
	login_info_pk varchar(100) not null unique primary key,
    adminid varchar(10),
    login_time timestamp,
    action varchar(100),
    
    constraint adminid_fk foreign key (adminid) references admin (adminid)
    
);



INSERT INTO admin (adminid,username,firstname,lastname,admin_email,admin_password,phone,admin_status) value ("0001","admin" ,"admin","admin","admin@admin.com","111111","000000000","Active");

select * from login_info


