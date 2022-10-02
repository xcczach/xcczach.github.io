import { Grid, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './App.css'

const App = ()=>{
  return (
    <Grid container>
      <Grid item xs={12}>
        <AppBar>
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}>
              <MenuIcon></MenuIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Grid>
    </Grid>
  );
}

export default App
