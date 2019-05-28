import React from 'react';
import Weather from './components/Weather';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import styles from './utils/style';

const App = (props) => {
	return (
		<Grid
			container
			justify="center"
			alignItems="center"
			direction="column"
			spacing={8}
			className={props.classes.appBackground}
		>
			<Weather classes={props.classes} />
		</Grid>
	);
};

export default withStyles(styles)(App);
