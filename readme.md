**Backend API con Express y MySQL** 

Este proyecto es un servidor backend que proporciona una API para interactuar con una base de datos MySQL. Utiliza Express.js para manejar las solicitudes HTTP y MySQL para la conexión y consultas a la base de datos.

Archivos del Proyecto 

- config.js: Este archivo contiene la configuración del servidor y la base de datos. Incluye variables como el puerto en el que se ejecutará el servidor y las credenciales de la base de datos.
- db.js: En este archivo se encuentra la lógica para establecer la conexión con la base de datos MySQL. Utiliza las variables de configuración definidas en config.js para establecer la conexión.
- index.js: Este es el archivo principal de la aplicación. Define las rutas de la API y configura el servidor Express para manejar las solicitudes HTTP. Utiliza las funciones definidas en db.js para realizar consultas a la base de datos.

Configuración 

Clonar el Repositorio: 

git clone [https://github.com/EduardoMollinedo/cip-cda-registro  ](https://github.com/EduardoMollinedo/cip-cda-registro)

Instalar Dependencias: cd cip-cda-registro npm install 

Configurar las Variables de Entorno: 

Copia el archivo .env.example y renómbralo a .env. Edita este archivo según tus configuraciones específicas, como el puerto del servidor y las credenciales de la base de datos. 

Uso 

Obtener un mensaje de bienvenida: GET / 

Este endpoint devuelve un mensaje de bienvenida indicando que el servidor está conectado. 

Obtener información de un colegiado por ID: GET /colegiados/:id 

Este endpoint devuelve información sobre un colegiado específico en la base de datos. Debes proporcionar el ID del colegiado como parámetro en la URL.

Obtener información de pagos por número de documento: GET /pagos/:id 

Este endpoint devuelve información sobre pagos basados en el número de documento. Debes proporcionar el número de documento como parámetro en la URL.

Tecnologías Utilizadas 

Express.js: Framework de aplicaciones web para Node.js. MySQL: Sistema de gestión de bases de datos relacional.

Cors: Middleware para permitir solicitudes de recursos desde un origen diferente al del servidor. 
