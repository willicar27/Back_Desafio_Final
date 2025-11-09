import { addBook, getAllBook, getBookById, deleteBook } from "../models/libros.model.js";

export const addBookNew = async (req, res) => {
    const { titulo, autor, editorial, anio_publicacion, genero, descripcion, precio, url_img } = req.body;
    const usuario_id = req.user.id_usuarios;
    try {
        await addBook(titulo, autor, editorial, anio_publicacion, genero, descripcion, precio, url_img, usuario_id);
        res.status(201).json({ message: 'Libro agregado con éxito' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllBooknew = async (req, res) => {
    try {
        const books = await getAllBook();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getBookByIdnew = async (req, res) => {
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
};

export const deleteBookNew = async (req, res) => {
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
};