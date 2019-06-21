import React, { Component } from 'react';
import { Link } from "react-router-dom";
import "./App.css";
import gql from "graphql-tag";
import { Query } from "react-apollo";

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
//pollInterval={500}
class App extends Component  {
  // componentWillMount() {
  //   this.props.data.subscribeToMore({
  //     document: GET_BOOKS,
  //     updateQuery: (prev, {subscriptionData}) => {
  //       return prev;
  //     }
  //   });
  // }
  render() {
    return (
      <Query  query={GET_BOOKS}>
        {({ loading, error, data }) => {
          if (loading) return "Loading...";
          if (error) return `Error! ${error.message}`;
  
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
    )
  }
  
    
  
  
}

export default App;
