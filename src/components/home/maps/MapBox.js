import "mapbox-gl/dist/mapbox-gl.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { makeStyles } from "@mui/styles";
import Button from "@mui/material/Button";
import MapGL, { Marker, Popup } from "react-map-gl";
import Geocoder from "react-map-gl-geocoder";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { addDestination } from "../../../apis/dataApis";
import { toast } from "react-toastify";
import markerImg from "../../../assets/marker.png";

import "./Mapbox.css";

const MAPBOX_TOKEN = process.env.REACT_APP_MAP_TOKEN;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  boxShadow: 24,
  borderRadius: "10px",
  p: 4,
};

const useStyles = makeStyles(() => ({
  wrapper: {
    padding: "30px 0px 25px 0px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "100vh",

    // border: "1px solid black",
  },
}));

function MapBox({ selectedDestination, setDestinations }) {
  const classes = useStyles();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });

  const mapRef = useRef();
  const geocoderContainerRef = useRef();

  const [searchResult, setSearchResult] = useState();
  const [popupSelect, setPopupSelect] = useState(false);

  const [address, setAddress] = useState();
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();
  const [showAddBtn, setShowAddBtn] = useState(false);

  useEffect(() => {
    console.log("Mapbox", { selectedDestination });
    if (selectedDestination) {
      setViewport({
        latitude: selectedDestination?.latitude,
        longitude: selectedDestination?.longitude,
        zoom: 10,
      });
    }
  }, [selectedDestination]);

  const handleViewportChange = useCallback((newViewport) => {
    setViewport(newViewport);
  }, []);

  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      return handleViewportChange({
        ...newViewport,
      });
    },
    [handleViewportChange]
  );

  const handleOnResult = async (event) => {
    console.log(event);
    setSearchResult(event?.result);

    setAddress(event?.result?.place_name);
    setLongitude(event?.result?.geometry?.coordinates[0]);
    setLatitude(event?.result?.geometry?.coordinates[1]);
  };

  const handleAddDestination = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log(event.currentTarget);

    const addData = {
      destination: {
        username: localStorage.getItem("username"),
        address: address,
        description: data.get("description"),
        latitude,
        longitude,
      },
    };
    console.log({ addData });

    const addResponse = await addDestination(addData);

    if (addResponse?.success) {
      setDestinations((prev) => [...prev, addResponse?.data]);

      setModalIsOpen(false);
      toast.success("Your destination has been added!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else if (!addResponse?.success && addResponse?.description === "repeat") {
      toast.error(addResponse?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error("Something went wrong. Could not add.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    console.log({ searchResult });
    if (searchResult) {
      setShowAddBtn(true);
    }
  }, [searchResult, address]);
  return (
    <>
      <div className={classes.wrapper}>
        <div
          ref={geocoderContainerRef}
          // className=".mapboxgl-ctrl-geocoder--input"
        />
        <div>
          {showAddBtn && (
            <Button
              variant="contained"
              style={{ backgroundColor: "#00489E" }}
              onClick={() => setModalIsOpen(true)}
            >
              Add Destination
            </Button>
          )}
        </div>
      </div>
      <div
        style={{
          height: "calc(100vh - 290px)",
          // width: "100vh",
        }}
      >
        <MapGL
          ref={mapRef}
          {...viewport}
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/streets-v11"
          onViewportChange={handleViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          <Geocoder
            mapRef={mapRef}
            containerRef={geocoderContainerRef}
            onResult={handleOnResult}
            placeholder="Search Destination"
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            className="mapboxgl-ctrl-geocoder"
            hideOnSelect={true}
          />
          {searchResult ? (
            <Marker
              latitude={latitude}
              longitude={longitude}
              // onClick={() =>
              //   selectedDestination ? setPopupSelect(true) : null
              // }
            >
              <img
                src={markerImg}
                width="50"
                height="50"
                alt="Selected"
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ) : null}
          {selectedDestination ? (
            <Marker
              latitude={selectedDestination?.latitude}
              longitude={selectedDestination?.longitude}
              onClick={() => {
                setPopupSelect(true);
              }}
            >
              <img
                src={markerImg}
                width="50"
                height="50"
                alt="Selected"
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ) : null}
          {popupSelect && (
            <Popup
              latitude={selectedDestination?.latitude || latitude}
              longitude={selectedDestination?.longitude || longitude}
              onClose={() => {
                setPopupSelect(false);
              }}
            >
              <div>
                <h4>Destination: {selectedDestination?.address}</h4>
                <p>{selectedDestination?.description}</p>
              </div>
            </Popup>
          )}
        </MapGL>
      </div>
      <Modal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: 3 }}
      >
        <Box sx={modalStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ marginBottom: 15 }}
          >
            Add Destination
          </Typography>

          <Box
            component="form"
            className={classes.modalFields}
            noValidate
            onSubmit={handleAddDestination}
          >
            <TextField
              fullWidth
              variant="outlined"
              disabled
              value={address ? address : null}
              id="address"
              label="Address"
              name="address"
              style={{ padding: "5px 0px 15px" }}
              autoComplete="family-name"
            />
            <TextField
              fullWidth
              variant="outlined"
              multiline
              maxRows={4}
              id="description"
              label="Description"
              name="description"
              autoFocus
              autoComplete="family-name"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                variant="contained"
                type="submit"
                sx={{ mt: 3, mb: 2 }}
                style={{
                  fontWeight: 500,
                }}
              >
                Add
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

export default MapBox;
