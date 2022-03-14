import { createContext, useContext, useReducer } from 'react'
import { register } from '../services/Api'

const AuthContext = createContext()

const actionTypes = {
  REGISTER: 'REGISTER',
  LOADING: 'LOADING',
  ERROR: 'ERROR'
}

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null
}

const AuthReducer = (state, action) => {
  // action = { type, data, error }
  switch (action.type) {
    case actionTypes.REGISTER:
      return {
        ...initialState, user: action.data.user, token: action.data.token
      }
    case actionTypes.LOADING:
      return {
        ...initialState, loading: true
      }
    case actionTypes.ERROR:
      return {
        ...initialState, error: action.error
      }
    default:
      throw new Error(`Unhandled action type : ${action.type}`)
  }
}

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, initialState)
  return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside a AuthProvider')
  return context
}

const registerUser = async (userInfos, dispatch) => {
  try {
    const data = await register(userInfos)
    if (data.user && data.jwt) {
      dispatch({
        type: actionTypes.REGISTER,
        data: { user: data.user, token: data.jwt }
      })
    }
  } catch (error) {
    dispatch({
      type: actionTypes.ERROR,
      error: error
    })
  }
}

export {
  actionTypes,
  AuthProvider,
  useAuth,
  registerUser
}
