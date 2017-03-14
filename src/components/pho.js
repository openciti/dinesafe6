import { Urls } from '../data/urls.js'
import { actions } from '../classes/app_config'
import { store } from './dinesafemain'
let axios = require('axios')
import React, { Component } from 'react'
//let uniqueId = require('lodash.uniqueid')

export class Pho extends Component {
  componentDidMount = () => {
    const geo = store.getState().app.geo;
    const phourl = `${Urls.heroku.pho.near}lat=${geo.lat}&lng=${geo.lng}&limit=50`;
    //console.log(phourl);
    axios.get(phourl).then( (res) => {
      console.log(res.data);
      store.dispatch( { type: actions.PHO, venues: res.data } )
    })
  }
  render() {
    const phovenues = store.getState().app.phoVenues;
    const phos = phovenues.map( (venue) => {
      return (
        <div key={'pho_' + venue.id}>
          <div >
            <figure>
              <img width="160px" height="120px" src={`images/pho/${venue.id}.png`} />
              <figcaption>{venue.id} | {venue.name}</figcaption>
            </figure>
            <h4>{venue.address} , {venue.mun}</h4>
            <h5>({venue.lat}, {venue.lng})</h5>
          </div>
          <hr /><br />
        </div>
      )
    });

    return <div>{phos}</div>;
  }
}