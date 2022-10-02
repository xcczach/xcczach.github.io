import { Grid, AppBar, Toolbar, IconButton, Menu, MenuItem, Autocomplete, TextField, List, ListItem, ListItemButton, ListItemText, Typography, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ArrowBackIos } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { Remarkable } from 'remarkable'

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
        <Toolbar />
        <Menu anchorEl={anchorEl} open={hasAnchor} onClose={closeMainMenu}>
          <MenuItem onClick={changePage(PageState.MainPage)}>主页</MenuItem>
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

const DocPage = () => {
  const [docList, setDocList] = useState<string[]>([]);
  useEffect(() => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        setDocList(JSON.parse(req.responseText).doclist)
      }
    }
    req.open("GET", "/documents/doclist.json?t=" + Math.random(), true);
    req.send();
  }, []);
  const [isNavigating, setIsNavigating] = useState(true);
  const [targetDoc, setTargetDoc] = useState("");
  const openDoc = (target: string) => {
    setIsNavigating(false);
    setTargetDoc(target);
  }
  const closeDoc = () => {
    setIsNavigating(true);
    setTargetDoc("");
  }

  if (isNavigating) {
    return (<DocNaviPage docList={docList} onClick={openDoc}></DocNaviPage>);
  } else {
    return (<DocShowPage docName={targetDoc} onBack={closeDoc}></DocShowPage>);
  }
}

const DocNaviPage = ({ docList, onClick }: { docList: string[], onClick: (targetDoc: string) => void }) => {
  return (
    <Grid container direction="column"
      justifyContent="flex-start"
      alignItems="center">
      <Grid item xs={12}>
        <Autocomplete options={docList.map(item => item.slice(0, item.length - 3))} renderInput={(params) => <TextField {...params} />}
          onChange={(_event, newValue) => {
            if (newValue !== null) {
              setTimeout(() => {
                onClick(newValue + ".md");
              }, 100);
            }
          }} />
      </Grid>
      <Grid item xs={12}>
        <List>
          {
            docList.map(item =>
              <ListItem key={item}>
                <ListItemButton onClick={() => {
                  setTimeout(() => {
                    onClick(item);
                  }, 300);
                }}>
                  <ListItemText primary={item.slice(0, item.length - 3)}></ListItemText>
                </ListItemButton>
              </ListItem>)
          }
        </List>
      </Grid>
    </Grid>
  );
}

const DocShowPage = ({ docName, onBack }: { docName: string, onBack: () => void }) => {
  const [content, setContent] = useState("");
  useEffect(() => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState == 4 && req.status == 200) {
        setContent(req.responseText);
      }
    }
    req.open("GET", "/documents/" + docName + "?t=" + Math.random(), true);
    req.send();
  }, []);
  return (
    <Grid container>
      <Grid item xs={2}>
        <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2, mt: 1 }}
          onClick={() => {
            setTimeout(() => {
              onBack();
            }, 300);
          }}>
          <ArrowBackIos></ArrowBackIos>
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        <Typography variant='h3'>{docName.slice(0, docName.length - 3)}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Divider></Divider>
        <div dangerouslySetInnerHTML={{ __html: new Remarkable().render(content) }}></div>
      </Grid>
    </Grid>
  );
}

export default App
