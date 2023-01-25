import axios from 'axios'

export async function request(url: string){
  return axios.get(url)

}

