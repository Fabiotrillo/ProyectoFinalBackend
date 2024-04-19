import {expect} from "chai";
import supertest from "supertest";
import productModel from "../src/dao/db/models/products.model.js";
import cartModel from "../src/dao/db/models/carts.model.js";
import {app} from "../src/app.js"
import { userDao } from "../src/repository/index.js";
import userModel from "../src/dao/db/models/users.model.js";


const requester = supertest(app)

describe("testing App Ecommerce", () => {


    // Testeo Productos
    describe("Test del modulo Products", () => {

        beforeEach(async () => {
            // Eliminar todos los productos creados durante la prueba
            await productModel.deleteMany({});
        });

        it("el endpoint post /api/products crea un producto y recibe 401 en statusCode Por auth", async function () {
            const mockProduct = {
                title: 'Nuevo Producto',
                description: 'Descripción del nuevo producto',
                code: 'ABC123',
                price: 50,
                stock: 10,
                category: 'Electrónica',
                image: "www.image.com",
            };

            const result = await requester.post("/api/products").send(mockProduct);
            const { statusCode, _body } = result;
            expect(statusCode).to.be.equal(401);
            expect(_body.status).to.be.equal("error")
        });

        it("el endpoint get /api/products/:pid debe obtener el producto por id y buscar en sus propiedades el titulo del producto", async function () {

            const newProduct = await productModel.create({
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: '12345',
                price: 100,
                stock: 20,
                category: 'Electrónica',
                image: 'www.example.com/product_image.jpg'
            });

            const result = await requester.get(`/api/products/${newProduct._id}`);
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.have.property('msg');
            expect(result.body.msg).to.have.property('title').that.equals('Producto de prueba');
        });

        it("el endpoint delete /api/products/:pid debe poder eliminar el producto correctamente", async function () {
            // Crear un producto de prueba en la base de datos
            const newProduct = await productModel.create({
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: '12345',
                price: 100,
                stock: 20,
                category: 'Electrónica',
                image: 'www.example.com/product_image.jpg'
            });

            // Realizar una solicitud DELETE para eliminar el producto por su ID
            const result = await requester.delete(`/api/products/${newProduct._id}`);

            // Verificar el código de estado HTTP
            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('object');
            expect(result.body).to.have.property('status');
            expect(result.body).to.have.property('msg');
            expect(result.body.status).to.equal("success");
        });

    });

    // testeo Carts
    describe("Test del modulo Carritos", () => {

        beforeEach(async () => {
            // Eliminar todos los carritos creados durante la prueba
            await cartModel.deleteMany({});
            // Eliminar todos los productos creados durante la prueba
            await productModel.deleteMany({});
        });
        it("el endpoint post /api/carts crea un carrito correctamente", async function () {
            
            const products = [
                { product: "60f0e45c43e3ca22d0cb2e44", quantity: 2 },
                { product: "60f0e45c43e3ca22d0cb2e45", quantity: 3 }
            ];

            const result = await requester.post("/api/carts").send({ products });
            expect(result.statusCode).to.equal(201);
            expect(result.body).to.have.property("status").that.equals("success");
            expect(result.body).to.have.property("msg").that.equals("Carrito creado");
        });

        it("el endpoint post /api/carts/:cid/products/:pid agrega un producto al carrito correctamente", async function(){
            // Crear un producto de prueba en la base de datos
            const newProduct = await productModel.create({
                title: 'Producto de prueba',
                description: 'Descripción del producto de prueba',
                code: '12345',
                price: 100,
                stock: 20,
                category: 'Electrónica',
                image: 'www.example.com/product_image.jpg'
            });

            const newCart = await cartModel.create({});


            // ID del carrito creado
            const cid = newCart._id;

            // ID del producto a agregar al carrito
            const pid = newProduct._id;

            // Cantidad del producto a agregar al carrito
            const quantity = 1;

            // Realizar una solicitud POST para agregar un producto al carrito
            const result = await requester.post(`/api/carts/${cid}/products/${pid}`).send({ quantity });


            expect(result.statusCode).to.equal(200);
            expect(result.body).to.be.an('object');
            expect(result.body).to.have.property('status').that.equals('Success');
            expect(result.body).to.have.deep.property('msg').that.equals('Producto agregado correctamente al carrito');

        });

        it("el endpoint get /api/carts/:cid debe obtener el carrito por su ID", async function (){

            const newCart = await cartModel.create({});

            // ID del carrito creado
            const cid = newCart._id;


            const result = await requester.get(`/api/carts/${cid}`);

            expect(result.statusCode).to.equal(200);
            // Verificar el cuerpo de la respuesta
            expect(result.body).to.be.an('object');
            expect(result.body).to.have.property('status').that.equals('success');
            expect(result.body).to.have.property('msg').that.equals('Cart encontrado');
            expect(result.body).to.have.property('cart').that.is.an('object');
            // Agrega más verificaciones según las propiedades del carrito recuperado
        });


    });

    describe("Test del modulo Sessions",()=>{
        
        after(async () => {
            await userModel.deleteMany({});
        });

        it("Debe Registrar un usuario y guardar la session", async function(){
            const newUser = {
                first_name: 'Nuevo',
                last_name: 'Usuario',
                email: 'nuevo_usuario@example.com',
                age: 25,
                password: 'contraseña_segura',
                // Otros datos necesarios para el registro
              };

              this.sessionData = {
                email: newUser.email,
                password: newUser.password,
              };
             
            

            const response = await requester.post("/api/sessions/register").send(newUser);
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('User registrado');


        });

        it("Debe loguear el usuario creado correctamente y recibir success", async function(){
            const newUser = {
                email: this.sessionData.email,
                password: this.sessionData.password
            }
            const response = await requester.post("/api/sessions/login").send(newUser);
            expect(response.status).to.equal(200);
            expect(response.body.status).to.equal('success');
            
        });

        it("Debe fallar al iniciar sesión y redireccionar al faillogin", async function() {
            const invalidUser = {
                email: this.sessionData.email,
                password: this.sessionData.password1
            };
            const response = await requester.post("/api/sessions/login").send(invalidUser);
            expect(response.status).to.equal(302); // Verificar que se produjo una redirección
            expect(response.headers.location).to.equal('/api/sessions/faillogin')
        });


    })

});