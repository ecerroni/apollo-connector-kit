import App from '../components/App'
import Header from '../components/Header'
import { Authenticate } from '../components/general/'

export default () => (
  <App>
    <Authenticate>
      <Header />
      <div>Welcome to the next-apollo-connector boilerplate</div>
    </Authenticate>
  </App>
)
