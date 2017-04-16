create database Bamazon;

use Bamazon;

create table Products (
  id integer(11) auto_increment not null,
  product_name varchar(100) null,
  department_name varchar(100) null,
  price decimal(6, 2) null,
  stock_quantity integer(3) null,
  primary key (id)
);
