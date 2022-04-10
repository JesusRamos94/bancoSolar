CREATE DATABASE bancosolar;

CREATE TABLE usuarios (id SERIAL PRIMARY KEY, nombre VARCHAR(50) not null,
balance not null int CHECK (balance >= 0));

CREATE TABLE transferencias (id SERIAL PRIMARY KEY, emisor INT not null, receptor
INT not null, monto int not null, fecha TIMESTAMP, FOREIGN KEY (emisor) REFERENCES
usuarios(id), FOREIGN KEY (receptor) REFERENCES usuarios(id));