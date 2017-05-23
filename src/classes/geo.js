import { store } from '../components/main'
import { Pop } from './pop'
import { actions } from '../appConfig/actions'

/*
Config and helpers for geolocation
*/
export class Geo {

    // Determines if a toastr (Pop / pop.js) message will be shown
    // upon successful aquisition of geoloaction data
    static INIT = false
    static REFRESH = true

    static locSet = (lat, lng) => {
      return `<h3>Location Set</h3>(${lat}, ${lng})`
    }

    static currentLoc = (lat, lng) => {
      return `<h3>Current Location</h3>(${lat}, ${lng})`
    }

    static badGeoNav = 'Geolocation failed'

    static getLocation = (isRefresh) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( (pos) => {
          var lat = pos.coords.latitude
          var lng = pos.coords.longitude
          store.dispatch( { type: actions.GEO, lat: lat, lng: lng } )
          if (isRefresh || true) { // || true is temporary
            Pop.OK(Geo.locSet(lat, lng))
          }
        }, () => Geo.badGeo())
      }
      else {
        Geo.badGeo()
      }
    }

    static badGeo = () => {
      Pop.ERR(Geo.badGeoNav)
    }
    static showGeo = () => {
      const geo = store.getState().app.geo
      const msg = Geo.currentLoc(geo.lat, geo.lng)
      Pop.INFO(msg)
    }
    static refreshGeo = () => {
      Geo.getLocation(Geo.REFRESH)
    }

}
