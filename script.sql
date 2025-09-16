create table usuarios
(
    id             char(36) default (uuid())          not null,
    nombre_usuario text                               null,
    correo         varchar(200)                       not null,
    password       varchar(100)                       not null,
    perfil         enum ('admin', 'user')             null,
    fecha_creacion datetime default CURRENT_TIMESTAMP null
);

