
import { useQuery } from 'react-apollo-hooks'
import { storeQuery } from '../../api'

export default () => {
  const { data: { store = {} } = {} } = useQuery(storeQuery)
  return store;
}