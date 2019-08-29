
import { useQuery } from '@apollo/react-hooks'
import { storeQuery } from '../../api'

export default () => {
  const { data: { store = {} } = {} } = useQuery(storeQuery)
  return store;
}