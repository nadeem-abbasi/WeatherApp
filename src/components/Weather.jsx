import React from 'react';
import {
	Grid,
	FormControl,
	RadioGroup,
	FormControlLabel,
	Radio,
	List,
	ListItem,
	ListItemText,
	Typography,
	Divider
} from '@material-ui/core';
import ArrowBackIos from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIos from '@material-ui/icons/ArrowForwardIos';
import OpenWeatherApi from '../utils/api';
import Slider from 'react-slick';
import '../utils/slick.css';
import moment from 'moment';
import _ from 'lodash';
import store from '../store';
import { savePreferences } from '../store/actionTypes';
import WeatherChart from './WeatherChart';
import Loader from 'react-loader-spinner';

class Weather extends React.Component {
	constructor(props) {
		super(props);

		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
	}
	state = {
		unit: store.getState().savePreferences
			? store.getState().savePreferences.unit
			: 'imperial',
		weather: [],
		loading: true,
		sliderSettings: {
			dots: false,
			infinite: false,
			speed: 500,
			slidesToShow: 3,
			slidesToScroll: 1
		},
		pageIndex: 0
	};

	componentDidMount() {
		this.callApi();
	}
	callApi = () => {
		const { unit } = this.state;
		this.setState({ loading: true });
		OpenWeatherApi.getWeather(unit, (error, response) => {
			if (error) {
				console.log(error);
			} else {
				if (response) {
					let weatherData = [];
					response.list.forEach((data) => {
						weatherData.push({
							date: moment(data.dt_txt, 'YYYY-MM-DD HH:mm:ss').format(
								'DD MMM YY'
							),
							dayTemp: data.main.temp,
							tempMin: data.main.temp_min,
							tempMax: data.main.temp_max
						});
					});

					let weatherByDay = _(weatherData)
						.groupBy('date')
						.map((items, date) => {
							return {
								date: date,
								temp: _.round(
									_.map(items, 'dayTemp').reduce((sum, n, i, p) => {
										return sum + n;
									}, 0) / items.length,
									2
								),
								minTemp: _.min(_.map(items, 'tempMin')),
								maxTemp: _.max(_.map(items, 'tempMax'))
							};
						})
						.value();

					this.setState({
						weather: weatherByDay,
						loading: false
					});
				}
			}
		});
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value }, () => {
			store.dispatch(savePreferences(this.state.unit));
			this.callApi();
		});
	};

	next() {
		this.slider.slickNext();
		this.setState({ pageIndex: this.state.pageIndex + 1 });
	}
	previous() {
		this.slider.slickPrev();
		this.setState({ pageIndex: this.state.pageIndex - 1 });
	}

	render() {
		const { unit, weather, loading, sliderSettings, pageIndex } = this.state;
		const { classes } = this.props;

		return (
			<>
				{loading && loading ? (
					<div className={classes.loading}>
						<Typography variant="h6">
							<span style={{ display: 'inline-block' }}>Loading </span>
							<Loader
								type="ThreeDots"
								height="40"
								width="40"
								style={classes.loader}
							/>
						</Typography>
					</div>
				) : (
					<>
						<Grid item lg={12} md={12} sm={12} xs={12}>
							<FormControl component="fieldset">
								<RadioGroup
									aria-label="unit"
									name="unit"
									className={classes.radioGroup}
									value={unit}
									onChange={this.handleChange}
								>
									<FormControlLabel
										value="metric"
										control={<Radio color="primary" />}
										label="Celsius"
									/>

									<FormControlLabel
										value="imperial"
										control={<Radio color="primary" />}
										label="Fahrenheit"
									/>
								</RadioGroup>
							</FormControl>
							<Divider />
						</Grid>

						<Grid
							container
							justify="flex-start"
							alignItems="stretch"
							alignContent="space-between"
						>
							<Grid
								item
								lg={6}
								md={6}
								sm={6}
								xs={6}
								align="left"
								className={classes.navArrows}
							>
								{pageIndex > 0 && (
									<ArrowBackIos
										fontSize="large"
										onClick={this.previous}
										color="primary"
									/>
								)}
							</Grid>
							<Grid
								item
								lg={6}
								md={6}
								sm={6}
								xs={6}
								align="right"
								className={classes.navArrows}
							>
								{pageIndex < weather.length - 3 && (
									<ArrowForwardIos
										fontSize="large"
										onClick={this.next}
										color="primary"
									/>
								)}
							</Grid>
						</Grid>

						<Grid item lg={12} md={12} sm={12} xs={12}>
							<Slider
								ref={(c) => (this.slider = c)}
								{...sliderSettings}
								className={classes.slickSlider}
							>
								{weather.map((day) => (
									<>
										<List dense className={classes.sliderCard}>
											<ListItem
												alignItems="flex-start"
												className={classes.sliderList}
											>
												<ListItemText
													secondary={
														<Typography
															variant="h6"
															className={classes.cardColorPrimary}
														>
															{day.temp}
															{unit === 'imperial' ? '°F' : '°C'}
														</Typography>
													}
													primary={
														<Typography
															variant="body1"
															className={classes.cardColorSecondary}
														>
															Date
														</Typography>
													}
												/>
											</ListItem>
											<ListItem
												alignItems="flex-start"
												className={classes.sliderList}
											>
												<ListItemText
													primary={
														<Typography
															variant="body1"
															className={classes.cardColorSecondary}
														>
															Date
														</Typography>
													}
													secondary={
														<Typography
															variant="h6"
															className={classes.cardColorPrimary}
														>
															{day.date}
														</Typography>
													}
												/>
											</ListItem>
											<ListItem className={classes.sliderList}>
												<ListItemText
													secondary={
														<Typography
															variant="h6"
															className={classes.cardColorPrimary}
														>
															{day.minTemp}
															{unit === 'imperial' ? '°F' : '°C'}
														</Typography>
													}
													primary={
														<Typography
															variant="body1"
															className={classes.cardColorSecondary}
														>
															Min. Temp
														</Typography>
													}
												/>
											</ListItem>
											<ListItem className={classes.sliderList}>
												<ListItemText
													secondary={
														<Typography
															variant="h6"
															className={classes.cardColorPrimary}
														>
															{day.maxTemp}
															{unit === 'imperial' ? '°F' : '°C'}
														</Typography>
													}
													primary={
														<Typography
															variant="body1"
															className={classes.cardColorSecondary}
														>
															Max. Temp
														</Typography>
													}
												/>
											</ListItem>
										</List>
									</>
								))}
							</Slider>
						</Grid>
						<Grid item lg={12} md={12} sm={12} xs={12}>
							<Divider color="primary" />
							<WeatherChart data={weather} unit={unit} classes={classes} />
						</Grid>
					</>
				)}
			</>
		);
	}
}

export default Weather;
