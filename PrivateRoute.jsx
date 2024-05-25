import { useEffect } from "react"
import { useCookies } from "react-cookie"
import { Outlet, useNavigate } from "react-router-dom"
import LoginWithMasterKey from "./src/Pages/Login"

function RequireUser() {
  const [cookies] = useCookies(["jwt"])
  const navigate = useNavigate()

  useEffect(() => {
    if (!cookies.jwt) {
      navigate("/")
    }
  }, [cookies, navigate])

  return cookies.jwt ? <Outlet /> : <LoginWithMasterKey />
}

export default RequireUser
