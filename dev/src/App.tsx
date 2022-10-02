import { Grid, AppBar, Toolbar, IconButton, Menu, MenuItem, Autocomplete, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

enum PageState { MainPage, DocPage };

const App = () => {
  const [pageState, setPageState] = useState<PageState>(PageState.MainPage);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hasAnchor = Boolean(anchorEl);
  const openMainMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  }
  const closeMainMenu = () => {
    setAnchorEl(null);
  }
  const changePage = (pageState: PageState) => {
    return () => {
      closeMainMenu();
      setPageState(pageState);
    }
  }
  return (
    <Grid container direction="column"
      justifyContent="flex-start"
      alignItems="center">
      <Grid item xs={12}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}
              onClick={openMainMenu}>
              <MenuIcon></MenuIcon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Toolbar/>
        <Menu anchorEl={anchorEl} open={hasAnchor} onClose={closeMainMenu}>
          <MenuItem onClick={changePage(PageState.DocPage)}>文档检索</MenuItem>
        </Menu>
      </Grid>
      <Grid item xs={12}>
        <PageContent pageState={pageState}></PageContent>
      </Grid>
    </Grid>
  );
}

const PageContent = ({ pageState }: { pageState: PageState }) => {
  switch (pageState) {
    case PageState.MainPage:
      return (
        <MainPage></MainPage>
      );

    case PageState.DocPage:
      return (
        <DocPage></DocPage>
      );

    default:
      return (
        <MainPage></MainPage>
      );
  }
}

const MainPage = () => {
  return (
    <div>Hello world!</div>
  );
}

const getDocNameList = ()=>{
  const req = new XMLHttpRequest();
  let text: string = "";
  req.onload = function(){
    text = this.responseText;
  }
  req.open("GET","/documents/sample.md",true);
  req.send();
  return text;
}

const DocPage = () => {
  return (
    <Grid container direction="column"
    justifyContent="flex-start"
    alignItems="center">
      <Grid item xs={12}>
        <Autocomplete options={["1","2"]} renderInput={(params)=><TextField {...params}/>} 
        onChange={(event, newValue)=>{
          console.log(getDocNameList());
        }}/>
      </Grid>
    </Grid>
  );
}

export default App
