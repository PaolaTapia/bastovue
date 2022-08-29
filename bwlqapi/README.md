<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

#Ejecutar en Desarrollo
1. clonar repositorio

2. Ejecutar
```
npm install 
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```
4. Levantar la BD
```
docker-compose up -d
```
5.Ejecutar la api en dev
```
npm run start:dev
```
6.Ejecutar seed para reconstuir DB de prueba
```
http://localhost:3000/api/v1/seed
```

##Stack usado

* MongoDB 
* Nestjs
