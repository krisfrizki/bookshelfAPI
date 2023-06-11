const {nanoid} = require('nanoid');
const books = require('./books');

const addBooksHandler = (request,h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const id = nanoid(16);

    let finished = null;
    if(pageCount == readPage){
        finished = true;
    } else {
        finished = false;
    };

    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt
    };

    
    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        response.code(400);
        return response;
        
    } else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        response.code(400);
        return response;
    } else {
        books.push(newBook);
    
        const isSuccess = books.some((book) => book.id === id);
        if(isSuccess) {
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil ditambahkan',
                data: {
                    bookId: id
                }
            });
            response.code(201);
            return response;
        }
    }
};

const getAllBooksHandler = (request,h) => {

    const {name,reading,finished} = request.query;

    let filterBooks = books;

    if (name) {
        const book = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
        return {
          status: 'success',
          data: {
            books: book.map(({name, publisher}) => ({
              name, publisher,
            })),
          },
        };
      }
      if (reading === '1') {
        const book = books.filter((book) => book.reading === true);
        return {
          status: 'success',
          data: {
            books: book.map(({id, name, publisher}) => ({
              id,name, publisher,
            })),
          },
        };
      } else if (reading === '0') {
        const book = books.filter((book) => book.reading === false);
        return {
          status: 'success',
          data: {
            books: book.map(({id, name, publisher}) => ({
              id,name, publisher,
            })),
          },
        };
      }
      if (finished === '1') {
        const book = books.filter((book) => book.finished === true);
        return {
          status: 'success',
          data: {
            books: book.map(({id, name, publisher}) => ({
              id,name, publisher,
            })),
          },
        };
      } else if (finished === '0') {
        const book = books.filter((book) => book.finished === false);
        return {
          status: 'success',
          data: {
            books: book.map(({id, name, publisher}) => ({
              id,name, publisher,
            })),
          },
        };
      }
    if(books !== undefined){
        const response = h.response({
            status: 'success',
            data: {
                books: filterBooks.map(book => ({
                    id: book.id,
                    name: book.name,
                    publisher: book.publisher
                }))
            }
        });
        response.code(200);
        return response;
    }
}

const getBookByIdHabdler = (request,h) => {
    const {bookId} = request.params;

    const book = books.filter(b => b.id === bookId)[0];

    if(book !== undefined) {
        return {
            status: 'success',
            data: {
                book
            }
        }
    } else {
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        })
        response.code(404);
        return response;
    }

};

const editBookByIdHandler = (request,h) => {
    const {bookId} = request.params;

    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const book = books.filter(b => b.id === bookId)[0];

    if(!name){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    } else if(readPage > pageCount){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    } else if(book == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan'
        })
        response.code(404);
        return response;
    } else {
        const updatedAt = new Date().toISOString();
        
        const index = books.findIndex(book => book.id === bookId);
        
        if(index !== -1){
            books[index] = {
                ...books[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt
            };
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil diperbarui'
            });
            response.code(200);
            return response;
        }
        
    }
};

const deleteBookByIdHandler = (request,h) => {
    const {bookId} = request.params;

    const book = books.filter(b => b.id === bookId)[0];
    if(book == undefined){
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan'
        });
        response.code(404);
        return response;
        
    } else {
        index = books.findIndex(book => book.id === bookId);
        if(index !== -1){
            books.splice(index,1);
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus'
            });
            response.code(200);
            return response;
        }
    };
}

module.exports = {
    addBooksHandler,
    getAllBooksHandler,
    getBookByIdHabdler,
    editBookByIdHandler,
    deleteBookByIdHandler
}