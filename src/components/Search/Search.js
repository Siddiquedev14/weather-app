// ibne
import React, { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { fetchCities } from "../../api/OpenWeatherService";
import { Box, Typography } from "@mui/material";

const Search = ({ onSearchChange }) => {
  const [searchValue, setSearchValue] = useState(null);

  const loadOptions = async (inputValue) => {
    try {
      console.log("Search input:", inputValue);
      const citiesList = await fetchCities(inputValue);
      console.log("Cities list received:", citiesList);

      const options = citiesList.data.map((city) => {
        return {
          value: `${city.latitude} ${city.longitude}`,
          label: `${city.name}, ${city.countryCode}`,
        };
      });

      console.log("Options created:", options);
      return { options };
    } catch (error) {
      console.error("Error loading cities:", error);
      return { options: [] };
    }
  };

  const onChangeHandler = (enteredData) => {
    console.log("Search selection changed:", enteredData);
    setSearchValue(enteredData);
    onSearchChange(enteredData);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      borderRadius: "10px",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(255, 255, 255, 0.2)"
        : "none",
      "&:hover": {
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgba(0, 0, 0, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "10px",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(255, 255, 255, 0.1)"
        : "transparent",
      color: "white",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "white",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.7)",
    }),
  };

  return (
    <Box sx={{ width: "100%", marginBottom: "2rem" }}>
      <Typography
        variant="h6"
        sx={{
          color: "white",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        🌍 Search for any city worldwide
      </Typography>
      <AsyncPaginate
        placeholder="Type city name (e.g., London, New York, Tokyo)..."
        debounceTimeout={600}
        value={searchValue}
        onChange={onChangeHandler}
        loadOptions={loadOptions}
        styles={customStyles}
        noOptionsMessage={() => "No cities found. Try a different search term."}
        loadingMessage={() => "Searching cities..."}
        isClearable={true}
        isSearchable={true}
      />
    </Box>
  );
};

export default Search;
