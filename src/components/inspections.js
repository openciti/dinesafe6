import React, { Component } from 'react'
import { Icon, Table } from 'semantic-ui-react'
import { store } from './main'
import { actions } from '../appConfig/actions'
import { NODATA, statusConfig, severityConfig } from '../appConfig/inspectionconfg'
import { Urls } from '../appConfig/urls'
import { Pop } from '../classes/pop'
import { cap, idify, nodata, getParameterByName, lastWord } from '../classes/strings'
import { StatusLabel } from './statuslabel'

let axios = require('axios')

export class Inspections extends Component {
  state = { latest: null, vid: null, address: null, name: null, fullDetails: '', modalOpen: false, readMore: [] }
  componentDidMount = () => {
    const vid = getParameterByName('vid')
    const address = getParameterByName('address')
    const name = getParameterByName('name')
    const latest = getParameterByName('latest')
    this.setState( { vid: vid, address: address, name: name, latest: latest } )

    const url = latest ? Urls.inspectionsByVidLatestVersionUrlGen(vid) : Urls.inspectionsByVidUrlGen(vid)

    axios.get(url).then( (res) => {
      store.dispatch( { type: actions.SETINSPECTIONS, inspections: res.data } )
    }).catch( e => Pop.ERR(e) )


  }

  /*
   inspections table columns
   id,rid,eid,iid,etype,status,details,date,severity,action,outcome,mipy,version,venue_id,created_at,updated_at
  */
  toggleReadMore = (id) => {
    let readMore = this.state.readMore
    if (readMore.includes(id)) {
      readMore = this.state.readMore.filter( (element) => {
        return element !== id
      } )
    this.setState( { readMore: readMore } )
    }
    else {
      readMore.push(id)
      this.setState( { readMore: readMore } )
    }
    console.log(this.state.readMore)
  }


  renderReadMore = (i) => {
    return (
      <ul>
        <li>(db) id: {i.id}</li>
        <li>iid: {i.iid}</li>
        <li>rid: {i.rid}</li>
        <li>eid: {i.eid}</li>
        <li>status: {i.status}</li>
        <li>details: {i.details}</li>
        <li>date: {i.date}</li>
        <li>severity: {i.severity}</li>
        <li>action: {i.action}</li>
        <li>outcome: {i.outcome}</li>
        <li>min inspections/yr: {i.mipy}</li>
        <li>version: {i.version}</li>
        <li>venue_id: {i.venue_id}</li>
        <li>created_at: {i.created_at}</li>
        <li>updated_at: {i.updated_at}</li>
      </ul>
    )
  }


  render() {
    const inspections = store.getState().app.inspections
    const rows = inspections.map( (i) => {
      const key = `inspection_${i.iid}_${idify(i.created_at)}`
      const severityText = cap(nodata(i.severity.trim()))
      const severityFirstChar = severityText[0]
      const severityCfg = severityConfig[severityFirstChar]
      const severityFinalText = severityFirstChar === 'N' ? 'NA' : lastWord(severityText).replace(NODATA, 'OK')

      const statusText = i.status.toUpperCase().trim()
      const statusCfg = statusConfig[statusText]


      const readMore = this.state.readMore

      const iidData = readMore.includes(i.id) ? this.renderReadMore(i) : i.iid
      const chevron = readMore.includes(i.id) ? 'chevron left' : 'chevron right'
      return (
        <Table.Row key={key}>
          <Table.Cell onClick={ () => this.toggleReadMore(i.id) }><Icon name={chevron} />{iidData}</Table.Cell>
          <Table.Cell>{i.version}</Table.Cell>
          <Table.Cell><StatusLabel text={statusText} config={statusCfg} /></Table.Cell>
          <Table.Cell singleLine>{i.date}</Table.Cell>
          <Table.Cell singleLine><StatusLabel text={severityFinalText} config={severityCfg} /></Table.Cell>
          <Table.Cell>{cap(nodata(i.action))}</Table.Cell>
          <Table.Cell>{cap(nodata(i.details))}</Table.Cell>
          <Table.Cell>{cap(nodata(i.outcome))}</Table.Cell>
        </Table.Row>
      )
    })
    return (
      <div>
        <h3>{cap(this.state.name)}</h3>
        <h4>{cap(this.state.address)}</h4>
        <Table className='dataTable' celled padded selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell rowSpan='2'>Inspection ID <br /> Tap <Icon name='chevron right' /> to expand for full Details </Table.HeaderCell>
              <Table.HeaderCell>Version</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell singleLine>Date</Table.HeaderCell>
              <Table.HeaderCell singleLine>Severity</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
              <Table.HeaderCell>Details</Table.HeaderCell>
              <Table.HeaderCell>Outcome</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {rows}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.HeaderCell>{rows.length} inspections</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </div>
    )
  }
}
