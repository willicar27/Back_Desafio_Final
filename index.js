import express from 'express';
import cors from 'cors';
import { addUser, loginUser, getUserProfile, getUserProfileID, deleteProfile } from './src/controllers/ususario.controller.js';
import { addBookNew, getAllBooknew, getBookByIdnew, deleteBookNew } from './src/controllers/libros.controllers.js';
import { newOrdenController } from './src/controllers/pedidos.controllers.js'
import dotenv from 'dotenv';
import { authenticateJWT , checkAdmin } from './src/middlewares/middleware.js';


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

app.post('/libros', authenticateJWT, checkAdmin, addBookNew);

app.get('/libros', authenticateJWT, getAllBooknew);


app.get('/libros/:id', authenticateJWT, getBookByIdnew);

app.delete('/libros/:id', authenticateJWT, checkAdmin, deleteBookNew);

// ---------------------------------------------------------------------------------------------------------------

app.post('/pedidos', authenticateJWT, newOrdenController);