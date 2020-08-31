import { toggleSettingsModal } from 'actions/toolbar';
import get from 'lodash/get';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Tab,
  Tabs,
  Theme,
} from '@material-ui/core';

import Color from './Pages/ColorSettings';
import OrphanedFiles from './Pages/Orphaned Files';
import DownloadSettings from './Pages/DownloadSettings';

const useStyles = makeStyles((theme: Theme) => ({
  tabPanel: { flex: 1, overflow: 'auto' },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  content: {
    flexDirection: 'row',
    display: 'flex',
  },
}));

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  const classes = useStyles();

  return (
    <div
      className={classes.tabPanel}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const SettingsModal = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const isOpen = useSelector(state => get(state, 'toolbar.settingsModalVisible', false));

  const [currentTab, setCurrentTab] = React.useState(0);

  return (
    <Dialog open={isOpen} onClose={() => dispatch(toggleSettingsModal(false))} fullWidth maxWidth="lg">
      <DialogTitle id="form-dialog-title">Settings</DialogTitle>
      <DialogContent className={classes.content}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currentTab}
          onChange={(_e, data) => setCurrentTab(data)}
          aria-label="Vertical tabs example"
          className={classes.tabs}
        >
          <Tab label="Download" {...a11yProps(0)} />
          <Tab label="Color" {...a11yProps(1)} />
          <Tab label="Orphaned Files" {...a11yProps(2)} />
          <Tab label="Item Four" {...a11yProps(3)} />
          <Tab label="Item Five" {...a11yProps(4)} />
          <Tab label="Item Six" {...a11yProps(5)} />
          <Tab label="Item Seven" {...a11yProps(6)} />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
          <DownloadSettings />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Color />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <OrphanedFiles />
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          Item Five
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
          Item Six
        </TabPanel>
        <TabPanel value={currentTab} index={6}>
          Item Seven
        </TabPanel>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
};

export default SettingsModal;
