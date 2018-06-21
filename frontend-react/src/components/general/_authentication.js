import { compose, pure } from 'recompose'
import { graphql } from 'react-apollo'
import { authQuery } from '../../api'
import { default as Loading } from './_loading'

const connectionData = graphql(authQuery, {
  options: { fetchPolicy: 'network-only' },
});
const ConnectionResult = ({ children }) => children;

export default compose(connectionData, Loading, pure)(ConnectionResult);
