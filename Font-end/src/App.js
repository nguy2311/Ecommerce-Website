import React, { Fragment, useEffect, useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { routes } from './routes/index.js'
import { jwtDecode } from "jwt-decode";
import * as UserControllers from './controller/UserController.js'
import { useDispatch } from 'react-redux'
import DefaultComponent from './components/DefaultComponent/DefaultComponent.jsx'
import { isJsonString } from './utils.js'
import {resetUser, updateUser } from './redux/slides/userSlide.js'
import Loading from './components/LoadingComponent/Loading.jsx';




function App() {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false)

  
  useEffect(() =>{
    setIsLoading(true)
    const {decoded,storageData} = handleDecoded()
    if(decoded?.id){
      handleGetDetailsUser(decoded?.id,storageData)          
    }
    setIsLoading(false)
  },[])


  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if (storageData && isJsonString(storageData) ) {
      storageData = JSON.parse(storageData)
      decoded = jwtDecode(storageData)
    }
    return { decoded, storageData }
  }

  UserControllers.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken =  jwtDecode(refreshToken)
    if (decoded?.exp < currentTime.getTime() / 1000) {
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserControllers.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      }else {
        dispatch(resetUser())
      }
    }
    return config;
  }, (err) => {
    return Promise.reject(err)
  })

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserControllers.getDetailsUser(id, token)
    dispatch(updateUser({ ...res?.data, access_token: token, refreshToken: refreshToken}))
  }

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
          <Routes>
            {routes.map((route) => {
              const Page = route.page
              const Layout = route.isShowHeader ? DefaultComponent : Fragment
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page/>
                  </Layout>
                } />
              )
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  )
}


export default App