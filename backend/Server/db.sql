
drop table if exists group_movies cascade;
drop table if exists group_members cascade;
drop table if exists reviews cascade;
drop table if exists favorites cascade;
drop table if exists moviegroups cascade;
drop table if exists groups cascade; -- Poistetaan myös vanha 'groups'-taulu
drop table if exists users cascade;

create table users (
    id serial primary key,
    username varchar(50) not null unique,
    email varchar(100) not null unique,
    password varchar(255) not null,
    created_at timestamp default current_timestamp
);

create table moviegroups (
    id serial primary key,
    owner_id int references users(id) on delete cascade,
    name varchar(100) not null unique,
    description text,
    created_at timestamp default current_timestamp
);

create table favorites (
    id serial primary key,
    user_id int references users(id) on delete cascade,
    movie_id int not null,
    created_at timestamp default current_timestamp,
    unique (user_id, movie_id)
);

create table reviews (
    id serial primary key,
    user_id int references users(id) on delete cascade,
    movie_id int not null,
    rating int not null check (rating >= 1 and rating <= 5),
    comment text,
    created_at timestamp default current_timestamp
);

create table group_members (
    id serial primary key,
    group_id int references moviegroups(id) on delete cascade,
    user_id int references users(id) on delete cascade,
    role varchar(20) default 'member',
    created_at timestamp default current_timestamp,
    unique (group_id, user_id)
);

create table group_movies (
    id serial primary key,
    group_id int references moviegroups(id) on delete cascade,
    user_id int references users(id) on delete cascade,
    movie_id int not null,
    created_at timestamp default current_timestamp,
    unique (group_id, movie_id)
);

