----------------# ModerWatchV02-------------------

# Documentación de Servicios - Sistema de Inventario (MERN) 
 
## Autenticación 
**POST /api/auth/register**   
Registra un nuevo usuario.   
**Entrada:** nombre, email, password   
**Salida:** mensaje, usuario   
 
**POST /api/auth/login**   
Inicia sesión y genera token JWT.   
**Entrada:** email, password   
**Salida:** token, usuario   
 
--- 
 
## Productos 
**GET /api/products** → Lista todos los productos   
**POST /api/products** → Crea un producto   
**GET /api/products/:id** → Obtiene producto por ID   
**PUT /api/products/:id** → Actualiza producto   
**DELETE /api/products/:id** → Elimina producto   
 
--- 
 
## Órdenes 
**GET /api/orders** → Lista órdenes   
**POST /api/orders** → Crea nueva orden   
 
--- 
 
## Proveedores 
**GET /api/suppliers** → Lista proveedores   
**POST /api/suppliers** → Crea proveedor   
**PUT /api/suppliers/:id** → Actualiza proveedor   
**DELETE /api/suppliers/:id** → Elimina proveedor   
 