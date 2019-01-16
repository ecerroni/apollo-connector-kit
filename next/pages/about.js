import App from '../components/App'
import Header from '../components/Header'

export default () => (
  <App>
    <Header />
    <article>
      <h1>NEXTJS + APOLLO 2.0</h1>
      <p>
        Only authentication through local storage strategy works
      </p>
      <p>
        No HttpOnly authentication
      </p>
    </article>
  </App>
)
