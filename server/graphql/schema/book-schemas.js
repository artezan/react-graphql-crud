var GraphQLSchema = require('graphql').GraphQLSchema;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLList = require('graphql').GraphQLList;
var GraphQLObjectType = require('graphql').GraphQLObjectType;
var GraphQLNonNull = require('graphql').GraphQLNonNull;
var GraphQLID = require('graphql').GraphQLID;
var GraphQLString = require('graphql').GraphQLString;
var GraphQLInputObjectType = require('graphql').GraphQLInputObjectType;
var GraphQLInt = require('graphql').GraphQLInt;
var GraphQLDate = require('graphql-date');
var BookModel = require('../../models/book');
var PubSub = require('graphql-subscriptions').PubSub;

const pubsub = new PubSub(); //create a PubSub instance
const FIRST_EVENT = 'FIRST_EVENT';

// multiple
const createBookInputType = new GraphQLInputObjectType({
  name: 'CreateBookInput',
  fields: () => ({
    isbn: {
      type: new GraphQLNonNull(GraphQLString)
    },
    title: {
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    },
    description: {
      type: GraphQLString
    },
    published_year: {
      type: GraphQLInt
    },
    publisher: {
      type: GraphQLString
    }
  })
});

// Create a GraphQL Object Type for Book models
var bookType = new GraphQLObjectType({
  name: 'book',
  fields: function() {
    return {
      _id: {
        type: GraphQLString
      },
      isbn: {
        type: GraphQLString
      },
      title: {
        type: GraphQLString
      },
      author: {
        type: GraphQLString
      },
      description: {
        type: GraphQLString
      },
      published_year: {
        type: GraphQLInt
      },
      publisher: {
        type: GraphQLString
      },
      updated_date: {
        type: GraphQLDate
      }
    };
  }
});

// GraphQL query type that calls a list of book and single book by ID
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: function() {
    return {
      books: {
        type: new GraphQLList(bookType),
        resolve: function() {
          const books = BookModel.find().exec();
          if (!books) {
            throw new Error('Error');
          }
          return books;
        }
      },
      book: {
        type: bookType,
        args: {
          id: {
            name: '_id',
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const bookDetails = BookModel.findById(params.id).exec();
          if (!bookDetails) {
            throw new Error('Error');
          }
          return bookDetails;
        }
      },
      bookByAuthor: {
        type: new GraphQLList(bookType),
        args: {
          author: {
            name: 'author',
            type: GraphQLString
          }
        },
        resolve: function(root, params) {
          const bookDetails = BookModel.find({ author: params.author }).exec();
          if (!bookDetails) {
            throw new Error('Error');
          }
          return bookDetails;
        }
      }
    };
  }
});

// mutation
var mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: function() {
    return {
      addBook: {
        type: bookType,
        args: {
          isbn: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve: function(root, params) {
          const bookModel = new BookModel(params);
          const newBook = bookModel.save();
          if (!newBook) {
            throw new Error('Error');
          }
          return newBook;
        }
      },

      addBooks: {
        type: new GraphQLList(bookType),
        args: {
          arr: { type: new GraphQLList(createBookInputType) }
        },
        resolve: function(root, params) {
          params.arr.forEach(element => {
            const bookModel = new BookModel(element);
            const newBook = bookModel.save();
          });
          const newBook = BookModel.find().exec();
          if (!newBook) {
            throw new Error('Error');
          }
          return newBook;
        }
      },
      updateBook: {
        type: bookType,
        args: {
          id: {
            name: 'id',
            type: new GraphQLNonNull(GraphQLString)
          },
          isbn: {
            type: new GraphQLNonNull(GraphQLString)
          },
          title: {
            type: new GraphQLNonNull(GraphQLString)
          },
          author: {
            type: new GraphQLNonNull(GraphQLString)
          },
          description: {
            type: new GraphQLNonNull(GraphQLString)
          },
          published_year: {
            type: new GraphQLNonNull(GraphQLInt)
          },
          publisher: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const newBook = {
            isbn: params.isbn,
            title: params.title,
            author: params.author,
            description: params.description,
            published_year: params.published_year,
            publisher: params.publisher,
            updated_date: new Date()
          }
          const newChannel = newBook;
          pubsub.publish(FIRST_EVENT, { channelAdded: newChannel });  // publish to a topic
          return BookModel.findByIdAndUpdate(
            params.id,
            newBook,
            function(err) {
              if (err) return next(err);
            }
          );
        }
      },
      removeBook: {
        type: bookType,
        args: {
          id: {
            type: new GraphQLNonNull(GraphQLString)
          }
        },
        resolve(root, params) {
          const remBook = BookModel.findByIdAndRemove(params.id).exec();
          if (!remBook) {
            throw new Error('Error');
          }
          return remBook;
        }
      }
    };
  }
});

// Subs
var subscriptionType = new GraphQLObjectType({
  name: 'Subscription',
  fields: {
    bookEdit: {
      type: GraphQLString,
      subscribe: () => pubsub.asyncIterator(FIRST_EVENT), // subscribe to changes in a topic
      resolve: root => {
        return new Date().toString();
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: queryType,
  mutation: mutation,
  subscription: subscriptionType
});
