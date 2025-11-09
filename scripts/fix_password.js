import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

async function fixAdminPassword() {

    // Creamos un pool solo para este Script de esta manera no afecta al POOL global

    const scriptPool = new Pool ({
    host: 'localhost',
    user: 'postgres',
    password: 'williamc',
    database: 'libreria',
    port: 5432,
    });

    try {
        console.log('Inciando correccion de password del admin');

        const userResult = await scriptPool.query(
            'SELECT id_usuarios, email, password FROM usuarios WHERE email = $1',
            ['admin@example.com']
        );

        if(userResult.rows.length === 0) {
            console.log('Usuario admin@example.com no encontrado')
            return;
        };

        const user = userResult.rows[0];
        console.log('Usuario encotrado', user.email);
        console.log('password actual', user.password);
        console.log('logitud encotrado', user.password.length);

        // hashear la nueva contraseña

        const hashedPasswordFix = await bcrypt.hash('admin123', 10);
        console.log('nuevo hash generado', hashedPasswordFix);

        // Actualizar en la base de datos 

        await scriptPool.query(
            'UPDATE usuarios SET password = $1 WHERE email = $2',
            [hashedPasswordFix, 'admin@example.com']
        );

        console.log('password del admin hasheada correctamente');
        console.log('ahora puedes probar el login con');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
    } catch (error) {
        console.error('Error', error.message);
    } finally {
        await scriptPool.end();
    }
}

fixAdminPassword();