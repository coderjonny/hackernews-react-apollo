import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import Link from './Link'

class Search extends Component {

  state = {
    links: [],
    searchText: ''
  }

  handleInput = (e) => this.setState({ searchText: e.target.value })

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type='text'
            onSubmit={this._executeSearch}
            onChange={this.handleInput}
          />
          <button
            onClick={() => this._executeSearch()}
          >
            OK
          </button>
        </div>
        { this.state.isLoading ?
          <div> loading.. </div>
          :
          this.state.links.map(
            (link, index) => <Link key={link.id} link={link} index={index}/>
          )
        }
      </div>
    )
  }

  _executeSearch = async () => {
    this.setState({isLoading: true})

    try {
      const { searchText } = this.state
      const result = await this.props.client.query({
        query: ALL_LINKS_SEARCH_QUERY,
        variables: { searchText }
      })
      const links = result.data.allLinks

      this.setState({
        links,
        isLoading: false
      })
    } catch (err) {
      console.log(err);
    }
  }

}

//When wrapped around a component, it injects the 'ApolloClient' instance
//into the component's props
export default withApollo(Search)

const ALL_LINKS_SEARCH_QUERY = gql`
  query AllLinksSearchQuery($searchText: String!) {
    allLinks(filter: {
      OR: [{
        url_contains: $searchText
      }, {
        description_contains: $searchText
      }]
    }) {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`
