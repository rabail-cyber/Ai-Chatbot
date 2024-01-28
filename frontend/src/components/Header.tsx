import { AppBar, Toolbar } from '@mui/material';
import Logo from './material/Logo';
import { useAuth } from '../context/AuthContext';
import NavigationLinks from './material/NavigationLinks';


const Header = () => {
  const auth=useAuth()
  return (
    <AppBar sx={{bgcolor: "transparent", position: "static", boxShadow: "none"}}>
      <Toolbar sx={{display: "flex"}}>
        <Logo/>
        <div>{auth?.isLoggedIn ? (
          <>
          <NavigationLinks 
          bg="#00fffc"
          to="/chat"
          text="Go To Chat"
          textColor='Black'
          />
          <NavigationLinks 
          bg='#51538f'
          textColor='white'
          to='/'
          text='logout'
          onclick={auth.logout}
          />
          </>
          ) : (
            <>
        <NavigationLinks 
          bg="#00fffc"
          to="/login"
          text="Login"
          textColor='Black'
          />
          <NavigationLinks 
          bg='#51538f'
          textColor='white'
          to='/signup'
          text='SignUp'
          />
            </>
          )}
          </div>
      </Toolbar>
    </AppBar>
  )
}

export default Header;
