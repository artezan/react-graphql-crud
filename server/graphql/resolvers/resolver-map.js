const BookModel = require('../../models/book');
const { PubSub } = require('apollo-server');

const pubsub = new PubSub();
const BOOK_EDITED = 'BOOK_EDITED';

const resolvers = {
  Query: {
    book: async (parent, args) => await BookModel.findById(args._id).exec(),
    books: async () => await BookModel.find().exec(),
    bookByAuthor: async (parent, { author }) =>
      await BookModel.find({ author: params.author }).exec()
  },
  Mutation: {
    addBook: async (_, args) => {
      try {
        let newBook = new BookModel(args);
        return await newBook.save();
      } catch (error) {
        return error.message;
      }
    },
    updateBook: async (_, { input }) => {
      const newBook = {
        isbn: input.isbn,
        title: input.title,
        author: input.author,
        description: input.description,
        published_year: input.published_year,
        publisher: input.publisher,
        updated_date: new Date()
      };
      try {
        pubsub.publish(BOOK_EDITED, { bookEdited: newBook });
        return await BookModel.findByIdAndUpdate(input._id, newBook).exec();
      } catch (error) {
        return error.message;
      }
    },
    addBooks: async (_, args) => {
      args.arr.forEach(element => {
        const bookModel = new BookModel(element);
        const newBook = bookModel.save();
      });
      const newBook = await BookModel.find().exec();
      if (!newBook) {
        throw new Error('Error');
      }
      return newBook;
    },
    removeBook: async (_, { _id }) => {
      try {
        const remBook = await BookModel.findByIdAndRemove(_id).exec();
        return remBook;
      } catch (error) {
        error.message;
      }
    }
  },
  Subscription: {
    bookEdited: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([BOOK_EDITED])
    }
  }
};
module.exports = resolvers;

/* export const resolvers = {
  Query: {
    author(parent, args, context, info) {
      return find(authors, { id: args.id });
    },
  },
  Author: {
    books(author) {
      return filter(books, { author: author.name });
    },
  },
}; */
