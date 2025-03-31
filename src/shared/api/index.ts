import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://easy-script.koston.duckdns.org/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

export default instance
