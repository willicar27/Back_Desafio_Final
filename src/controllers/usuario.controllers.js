import bcrypt from "bcryptjs";
import {checkEmailQuery, insertUserQuery} from "../models/usuario.model.js"

export const addUser = async (email, password, nombre) => {

    // Validar que se proporcionen todos los campos requeridos

    if (!email || !password || !nombre) {
        throw new Error('Todos los campos son requeridos');
    }

    // Verificar si el correo electrónico ya está registrado se agrega esto por que estaba registrando usuarios con el mismo email

    try {
        const existingUSer = await checkEmailQuery (email);

        // verificacion de correo
        if (existingUSer) {
            throw new Error('El correo electrónico ya está registrado');
        };

        // Hasheo de contraseña

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insertar el nuevo usuario en la base de datos en caso de que no exista el email

        // const insertUserQuery = 'INSERT INTO usuarios (email, password, nombre, apellido) VALUES ($1, $2, $3, $4)';
        const newUSer = await insertUserQuery(email, hashedPassword, nombre);

        return { message: 'Usuario agregado con exito',
            user:{
                email: newUSer.email,
                nombre: newUSer.nombre
            }
        };

        
        

        // console.log('Usuario agregado con éxito');

    } catch (error) {
        throw new Error('Error al agregar usuario: ' + error.message);
    }
};