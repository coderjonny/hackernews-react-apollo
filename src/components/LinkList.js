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
    const linksToRender = this.props.allLinksQuery.allLinks

    console.log('linkList props', this.props);

    return (
      <div>
        {
          linksToRender && linksToRender.map( link => (
            <Link key={link.id} link={link}/>
          ))
        }
      </div>
    )
  }
}

const ALL_LINKS_QUERY = gql`{
    allLinks {
      id
      description
      url
    }
}`

export default graphql(  ALL_LINKS_QUERY,
                         {  name: 'allLinksQuery' },
                       )(LinkList)
