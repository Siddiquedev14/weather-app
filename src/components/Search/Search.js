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
      backgroundColor: "rgba(255, 255, 255, 0.13)",
      border: "1.5px solid rgba(255,255,255,0.18)",
      borderRadius: "12px",
      minHeight: 48,
      color: "#fff",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(100, 181, 246, 0.2)"
        : "none",
      "&:hover": {
        border: "1.5px solid #6a82fb",
      },
    }),
    menu: (provided) => ({
      ...provided,
      background: "rgba(30, 60, 114, 0.97)",
      borderRadius: "16px",
      boxShadow: "0 8px 32px 0 rgba(31,38,135,0.25)",
      marginTop: 4,
      zIndex: 20,
      position: "absolute",
      left: 0,
      right: 0,
      overflow: "hidden",
    }),
    option: (provided, state) => ({
      ...provided,
      background: state.isFocused ? "rgba(100, 181, 246, 0.18)" : "transparent",
      color: "#fff",
      cursor: "pointer",
      padding: "10px 16px",
      fontSize: "1rem",
      transition: "background 0.15s",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    input: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "rgba(255, 255, 255, 0.7)",
    }),
    menuList: (provided) => ({
      ...provided,
      padding: 0,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h6"
        sx={{
          color: "white",
          marginBottom: "1rem",
          textAlign: "center",
          fontWeight: 500,
        }}
      ></Typography>
      <AsyncPaginate
        placeholder="Type city name (e.g., London, New York, Tokyo)..."
        debounceTimeout={600}
        value={searchValue}
        onChange={onChangeHandler}
        loadOptions={loadOptions}
        styles={customStyles}
        menuPortalTarget={document.body}
        noOptionsMessage={() => "No cities found. Try a different search term."}
        loadingMessage={() => "Searching cities..."}
        isClearable={true}
        isSearchable={true}
      />
    </Box>
  );
};

export default Search;
