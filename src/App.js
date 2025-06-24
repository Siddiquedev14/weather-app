// ibne
import React, { useState } from "react";
import { Box, Container, Grid, SvgIcon, Typography } from "@mui/material";
import Search from "./components/Search/Search";
import WeeklyForecast from "./components/WeeklyForecast/WeeklyForecast";
import TodayWeather from "./components/TodayWeather/TodayWeather";
import { fetchWeatherData } from "./api/OpenWeatherService";
import { transformDateFormat } from "./utilities/DatetimeUtils";
import UTCDatetime from "./components/Reusable/UTCDatetime";
import LoadingBox from "./components/Reusable/LoadingBox";
import { ReactComponent as SplashIcon } from "./assets/splash-icon.svg";
import ErrorBox from "./components/Reusable/ErrorBox";
import { ALL_DESCRIPTIONS } from "./utilities/DateConstants";
import {
  getTodayForecastWeather,
  getWeekForecastWeather,
} from "./utilities/DataUtils";
import PublicIcon from "@mui/icons-material/Public";

function App() {
  const [todayWeather, setTodayWeather] = useState(null);
  const [todayForecast, setTodayForecast] = useState([]);
  const [weekForecast, setWeekForecast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const searchChangeHandler = async (enteredData) => {
    const [latitude, longitude] = enteredData.value.split(" ");

    setIsLoading(true);

    const currentDate = transformDateFormat();
    const date = new Date();
    let dt_now = Math.floor(date.getTime() / 1000);

    try {
      const [todayWeatherResponse, weekForecastResponse] =
        await fetchWeatherData(latitude, longitude);
      const all_today_forecasts_list = getTodayForecastWeather(
        weekForecastResponse,
        currentDate,
        dt_now
      );

      const all_week_forecasts_list = getWeekForecastWeather(
        weekForecastResponse,
        ALL_DESCRIPTIONS
      );

      setTodayForecast([...all_today_forecasts_list]);
      setTodayWeather({ city: enteredData.label, ...todayWeatherResponse });
      setWeekForecast({
        city: enteredData.label,
        list: all_week_forecasts_list,
      });
    } catch (error) {
      setError(true);
    }

    setIsLoading(false);
  };

  let appContent = (
    <Box
      xs={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        width: "100%",
        minHeight: "500px",
      }}
    >
      <SvgIcon
        component={SplashIcon}
        inheritViewBox
        sx={{ fontSize: { xs: "100px", sm: "120px", md: "140px" } }}
      />
      <Typography
        variant="h4"
        component="h4"
        sx={{
          fontSize: { xs: "12px", sm: "14px" },
          color: "rgba(255,255,255, .85)",
          fontFamily: "Poppins",
          textAlign: "center",
          margin: "2rem 0",
          maxWidth: "80%",
          lineHeight: "22px",
        }}
      >
        Explore current weather data and 6-day forecast of more than 200,000
        cities!
      </Typography>
    </Box>
  );

  if (todayWeather && todayForecast && weekForecast) {
    appContent = (
      <React.Fragment>
        <Grid item xs={12} md={todayWeather ? 6 : 12}>
          <Grid item xs={12}>
            <TodayWeather data={todayWeather} forecastList={todayForecast} />
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <WeeklyForecast data={weekForecast} />
        </Grid>
      </React.Fragment>
    );
  }

  if (error) {
    appContent = (
      <ErrorBox
        margin="3rem auto"
        flex="inherit"
        errorMessage="Something went wrong"
      />
    );
  }

  if (isLoading) {
    appContent = (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          minHeight: "500px",
        }}
      >
        <LoadingBox value="1">
          <Typography
            variant="h3"
            component="h3"
            sx={{
              fontSize: { xs: "10px", sm: "12px" },
              color: "rgba(255, 255, 255, .8)",
              lineHeight: 1,
              fontFamily: "Poppins",
            }}
          >
            Loading...
          </Typography>
        </LoadingBox>
      </Box>
    );
  }

  return (
    <>
      {/* Main Content Wrapper for vertical centering */}
      <div className="main-content-wrapper">
        {/* Header */}
        <Box className="header-modern">
          <Typography variant="h2" component="h1" className="header-title">
            smart-weather-app
          </Typography>
          <Typography variant="subtitle1" className="header-subtitle">
            by Siddique Raza
          </Typography>
          <div className="header-divider"></div>
        </Box>

        {/* Search Bar Modern Card Section */}
        <Box className="search-section-modern ">
          <span className="search-datetime-modern">
            <UTCDatetime />
          </span>
          <span className="search-label-modern">
            <PublicIcon
              className="icon"
              sx={{ fontSize: "1.4rem", mr: 1, color: "#00e676" }}
            />
            Search for any city worldwide
          </span>
          <Box className="search-bar-modern">
            <Search onSearchChange={searchChangeHandler} />
          </Box>
        </Box>

        {/* Main Weather Card */}
        <Container
          sx={{
            maxWidth: { xs: "100%", sm: "98%", md: "1200px" },
            width: "100%",
            margin: "0 auto",
            padding: {
              xs: "0.2rem 0.1rem 1.2rem",
              sm: "0.5rem 0.2rem 1.5rem",
              md: "1rem 0.5rem 2rem",
            },
            marginBottom: { xs: "0.2rem", sm: "0.5rem" },
            borderRadius: { xs: "0", sm: "22px" },
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <Box
            className="modern-card"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: { xs: 3, md: 4 },
              alignItems: "stretch",
              justifyContent: "center",
              width: "100%",
              p: { xs: 1, sm: 2, md: 3 },
            }}
          >
            {/* Left: Current Weather */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Render only the CURRENT WEATHER part of appContent */}
              {todayWeather && todayForecast && weekForecast ? (
                <TodayWeather
                  data={todayWeather}
                  forecastList={todayForecast}
                />
              ) : (
                appContent
              )}
            </Box>
            {/* Right: Weekly Forecast */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {todayWeather && todayForecast && weekForecast ? (
                <WeeklyForecast data={weekForecast} />
              ) : null}
            </Box>
          </Box>
          {/* Footer */}
          <Box
            sx={{
              width: "100%",
              textAlign: "center",

              left: 0,
              bottom: 0,
              py: 1.5,
              background: "transparent",
              zIndex: 100,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "Poppins",
                fontSize: { xs: "0.9rem", sm: "1rem" },
                letterSpacing: "1px",
              }}
            >
              Made with{" "}
              <span style={{ color: "#DC2941", fontWeight: 700 }}>❤️</span> by
              Siddique Raza | smart-weather-app
            </Typography>
          </Box>
        </Container>
      </div>
    </>
  );
}

export default App;
