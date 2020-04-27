drop table if exists products;

create table products (
    id integer primary key,
    name varchar(30),
    quantity integer,
    img varchar(100)
);

insert into products(id,name,quantity,img) values(1,'Lucario',4,'img/lucario.png');
insert into products(id,name,quantity,img) values(2,'Weavile',2,'img/weavile.png');
insert into products(id,name,quantity,img) values(3,'Gallade',1,'img/gallade.png');
insert into products(id,name,quantity,img) values(4,'Froslass',4,'img/froslass.png');
insert into products(id,name,quantity,img) values(5,'Starly',10,'img/starly.png');
insert into products(id,name,quantity,img) values(6,'Tangela',5,'img/tangela.png');