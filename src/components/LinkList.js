import React, { Component } from 'react'
import Link from './Link'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

class LinkList extends Component {

  render() {

    if (this.props.allLinksQuery && this.props.allLinksQuery.loading) {
      return <div>Loading</div>
    }
    if (this.props.allLinksQuery && this.props.allLinksQuery.error) {
      return <div>Error</div>
    }
    let linksToRender = this.props.allLinksQuery.allLinks

    //make lsit mutable and then sort by votes
    let sorted = linksToRender.map( l => l).sort(
      (a,b) => (b.votes.length - a.votes.length)
    )

    return (
      <div>
        {
          sorted.map( (link, index) => (
            <Link
              key={link.id}
              updateStoreAfterVote={this._updateCacheAfterVote}
              link={link} index={index}/>
          ))
        }
      </div>
    )
  }

  _updateCacheAfterVote = (store, createVote, linkId) => {
    // 1
    const data = store.readQuery({ query: ALL_LINKS_QUERY })

    // 2
    const votedLink = data.allLinks.find(link => link.id === linkId)
    votedLink.votes = createVote.link.votes

    // 3
    store.writeQuery({ query: ALL_LINKS_QUERY, data })
  }

}

export const ALL_LINKS_QUERY = gql`{
    allLinks {
      id
      description
      url
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
}`

export default graphql(  ALL_LINKS_QUERY,
                         {  name: 'allLinksQuery' },
                       )(LinkList)
