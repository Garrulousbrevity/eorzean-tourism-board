import { Divider, Drawer, Toolbar, TextField, MenuItem} from "@mui/material";
import { SORT_COLUMNS } from "./Constants";

function Menu({
  searchTerm,
  onChangeSearchTerm,
  sortColumn,
  onChangeSortColumn,
}) {
    return (
    <Drawer
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Divider />
      <TextField 
        label="Search" 
        type="search" 
        value={searchTerm}
        onChange={({target: {value}}) => onChangeSearchTerm(value)}
      />

      <TextField
        select
        label="Sort By"
        value={sortColumn}
        onChange={({target: {value}}) => onChangeSortColumn(value)}
      >
        {SORT_COLUMNS.map((option) => (
          <MenuItem key={option} value={option} >
            {option}
          </MenuItem>
        ))}
      </TextField>
    </Drawer>
  );
};

export default Menu; 