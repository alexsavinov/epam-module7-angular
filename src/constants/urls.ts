import {environment} from "../environments/environment";

const {API} = environment;

export const urls = {
  auth: `${API}/auth`,
  users: `${API}/users`,
  tags: `${API}/tags`,
  certificates: `${API}/certificates`,
  orders: `${API}/orders`
}
