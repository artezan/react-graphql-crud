const { gql } = require('apollo-server-express');


 const schema = gql`
 type Book {
  _id: String
  isbn: String
  title: String
  author: String
  description: String
  published_year: Float
  publisher: String
  updated_date: String
}
input BookInput {
  _id: String
  isbn: String
  title: String
  author: String
  description: String
  published_year: Float
  publisher: String
}

type Author {
  books: [Book]
}

type Query {
  book(_id: String): Book
  books: [Book]
  bookByAuthor: [Book]
}

type Mutation {
  addBook(isbn: String
    title: String
    author: String
    description: String
    published_year: Float
    publisher: String): Book

  updateBook(input: BookInput): Book
  addBooks(arr: [BookInput]): Book
  removeBook(_id: String): Book
}
type Subscription {
  bookEdited: Book
}

`;
module.exports = schema;

/*
Los tipos de entrada se declaran como 'input' 
 */