import { AppBar, Box, IconButton, Toolbar } from '@mui/material';
import { React } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import ThemePicker from './ThemePicker';

function Menu({ theme, onChangeTheme, onMenuButtonClick }) {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Box display="flex" flexGrow={1}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={onMenuButtonClick}
          >
            <MenuIcon />
          </IconButton>
        </Box>
        <ThemePicker theme={theme} onChangeTheme={onChangeTheme} />
      </Toolbar>
    </AppBar>
  );
}

export default Menu;
