import React from 'react';
import './index.css';
import { Grid } from '@mui/material';

export const Header = () => {
  chrome.runtime.onMessage.addListener;

  return (
    <div>
      <Grid container className="main-div">
        <Grid item xs={4}>
          Full Name
        </Grid>
        <Grid item xs={4}>
          Contacts Download for WhatsApp
        </Grid>
        <Grid item xs={4}>
          icon
        </Grid>
      </Grid>
    </div>
  );
};
