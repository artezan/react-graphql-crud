import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import gql from 'graphql-tag';
import { Query, Subscription } from 'react-apollo';

// Declare a constant before the class name for the query.
const GET_BOOKS = gql`
  {
    books {
      _id
      title
      author
      isbn
    }
  }
`;
const COMMENTS_SUBSCRIPTION = gql`
  subscription {
    bookEdited {
      updated_date
      title
    }
  }
`;

const RealTime = ({ repoFullName }) => (
  <Subscription subscription={COMMENTS_SUBSCRIPTION}>
    {({ data, loading }) => (
      // <h4>New comment: {!loading && commentAdded.content}</h4>
      // eslint-disable-next-line jsx-a11y/accessible-emoji
      <span> Real time 🛰️ {console.log(data)} </span>
    )}
  </Subscription>
);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isFlushed: false
    };
  }
 
  render() {
    return (
      <div>
        <RealTime />
        <Query query={GET_BOOKS}>
          {({ loading, error, data, refetch, subscribeToMore }) => {
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;
            if (this.props.location.state === 'flushDeal') {
              console.log('here')
              this.props.location.state = 'flushDeal1'
              refetch();
            }
            subscribeToMore({
              document: COMMENTS_SUBSCRIPTION,
              updateQuery: (prev, { subscriptionData }) => {
                console.log(subscriptionData);
                refetch();
              }
            });
            return (
              <div className="container">
                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">LIST OF BOOKS</h3>
                    <h4>
                      <Link to="/create">Add Book</Link>
                    </h4>
                  </div>
                  <div className="panel-body">
                    <table className="table table-stripe">
                      <thead>
                        <tr>
                          <th />
                          <th>Title</th>
                          <th>Author</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.books.map((book, index) => (
                          <tr key={index}>
                            <td>
                              <div>
                                <img src={book.isbn} alt="" />
                              </div>
                            </td>
                            <td>
                              <Link to={`/show/${book._id}`}>{book.title}</Link>
                            </td>
                            <td>{book.author}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default App;
