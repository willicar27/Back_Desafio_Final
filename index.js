import express from 'express';
import cors from 'cors';
import { addUser, loginUser, getUserProfile, getUserProfileID, deleteProfile } from './src/controllers/ususario.controller.js';
import { addBook , getBookById , deleteBook, getAllBooks} from './src/queries/queriesLibros.js';
import dotenv from 'dotenv';
import { authenticateJWT , checkAdmin } from './src/middlewares/middleware.js';
import { newOrder } from './src/queries/pedidos.js';


dotenv.config();
const app = express();
const PORT = 3000;

// Configurar CORS y el middleware para parsear JSON no se le agrega ruta a mi cors ya que tengo varios dominios locales y me da error si le agrego una ruta

app.use(cors());
app.use(express.json());

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// RUTA POST

app.post('/usuarios', async (req, res) => {
  const { email, password, nombre } = req.body;
  try {
    const result = await addUser(email, password, nombre);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta POST para login

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await loginUser(email, password); // Usar la función de login
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta GET

app.get('/usuarios', authenticateJWT, getUserProfile );

// Ruta GET por ID

app.get('/usuarios/:id', authenticateJWT, getUserProfileID);

// Ruta DELETE

app.delete('/usuarios/:id', authenticateJWT, checkAdmin, deleteProfile);

//-------------------------------------------------------------------------------------------------------------
// rutas para libros

app.post('/libros', authenticateJWT, checkAdmin, async (req, res) => {
    const { titulo, autor, editorial, anio_publicacion, genero, descripcion, precio, url_img } = req.body;
    const usuario_id = req.user.id_usuarios;
    try {
        await addBook(titulo, autor, editorial, anio_publicacion, genero, descripcion, precio, url_img, usuario_id);
        res.status(201).json({ message: 'Libro agregado con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/libros', authenticateJWT, async (req, res) => {
    try {
        const books = await getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/libros/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    try {
        const book = await getBookById(id);
        if (!book) {
            return res.status(404).json({ message: 'Libro no encontrado' });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/libros/:id', authenticateJWT, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID de libro inválido' });
    }

    const result = await deleteBook(id);

    if (result === 0) {
      return res.status(404).json({ message: 'libro no encontrado' });
    }

    res.status(200).json({ message: 'libro eliminado con éxito' });

  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
});

// ---------------------------------------------------------------------------------------------------------------

app.post('/pedidos', authenticateJWT, async (req, res) => {
  const { monto_total, libros } = req.body; 
  const usuario_id = req.user.id_usuarios;

  try {
    const nuevoPedido = await newOrder(monto_total, usuario_id, libros);
    res.status(201).json({
      message: 'Pedido agregado con éxito',
      pedido: nuevoPedido
    });
  } catch (error) {
    console.error('Error al crear pedido:', error.message);
    res.status(500).json({ error: 'Error al crear el pedido.' });
  }
});