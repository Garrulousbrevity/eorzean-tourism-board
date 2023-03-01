import React from 'react';
import {
  Divider,
  Drawer,
  Toolbar,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { SORT_COLUMNS } from './Constants';

function Menu({
  searchTerm,
  onChangeSearchTerm,
  sortColumn,
  onChangeSortColumn,
  filterFound,
  onChangeFilterFound,
  filterSecondBatch,
  onChangeFilterSecondBatch,
}) {
  return (
    <Drawer variant="permanent" anchor="left">
      <Toolbar />
      <Divider />
      <TextField
        label="Search"
        type="search"
        value={searchTerm}
        onChange={({ target: { value } }) => onChangeSearchTerm(value)}
      />

      <TextField
        select
        label="Sort By"
        value={sortColumn}
        onChange={({ target: { value } }) => onChangeSortColumn(value)}
      >
        {SORT_COLUMNS.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>

      <FormControlLabel
        label="Hide Collected"
        control={
          <Checkbox
            checked={filterFound}
            onChange={({ target: { checked } }) => onChangeFilterFound(checked)}
          />
        }
      />
      <FormControlLabel
        label="Hide Second Batch"
        control={
          <Checkbox
            checked={filterSecondBatch}
            onChange={({ target: { checked } }) =>
              onChangeFilterSecondBatch(checked)
            }
          />
        }
      />
    </Drawer>
  );
}

export default Menu;
