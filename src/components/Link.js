import React, { Component } from 'react'
import { GC_USER_ID } from '../constants'
import { timeDifferenceForDate } from '../utils'

import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

class Link extends Component {
  render() {
    const userId = localStorage.getItem(GC_USER_ID)
    const link = this.props.link

    return (
      <div className='flex mt2 items-start'>
        <div className='flex items-center'>
          <span className='gray'>
            {this.props.index + 1}.
          </span>
          { userId &&
            <div className='ml1 gray f11'
                 onClick={() => this._voteForLink()}>▲</div>
          }
        </div>
        <div className='ml1'>
          <div>{link.description} ({link.url})</div>
          <div className='f6 lh-copy gray'>
            {link.votes.length} votes | by {link.postedBy ? link.postedBy.name : 'Unknown'} {timeDifferenceForDate(this.props.link.createdAt)}
          </div>
        </div>
      </div>
    )
  }

  _voteForLink = async () => {
    const userId = localStorage.getItem(GC_USER_ID)
    const voterIds = this.props.link.votes.map( v => v.user.id )

    if (voterIds.includes(userId)) {
      return
    }

    const linkId = this.props.link.id;
    await this.props.createVoteMutation({
      variables: {
        userId,
        linkId
      },
      update: (store, { data: { createVote } }) => {
        this.props.updateStoreAfterVote(store, createVote, linkId)
      },
      optimisticResponse: {
        createVote: {
          id: -1,
          link: {
            votes: [
              {
                id: -1,
                user: {
                  id: userId,
                  __typename: "User"
                },
                __typename: "Vote"
              }
            ],
            __typename: "Link"
          },
          user: {
            id: userId,
            __typename: "User"
          },
          __typename: "Vote"
        }
      }
    })
  }
}

const CREATE_VOTE_MUTATION = gql`
  mutation CreateVoteMutation($userId: ID!, $linkId: ID!) {
    createVote(userId: $userId, linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }

`

export default graphql(CREATE_VOTE_MUTATION, {
  name: 'createVoteMutation'
})(Link)
