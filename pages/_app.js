import '../styles/globals.css'
import Layout from '../components/Layout'
import { DataProvider } from '../store/GlobalState'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function MyApp({ Component, pageProps }) {
  return (
    <DataProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ToastContainer />
    </DataProvider>
  )
}

export default MyApp
