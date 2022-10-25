import React, { useState } from "react";
import { Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { makeStyles } from "@mui/styles";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { updateDestination, removeDestination } from "../../apis/dataApis";

import { toast } from "react-toastify";

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
  card: {
    boxShadow: "none",
    borderRadius: "4px",

    overflow: "hidden",
    "&:hover": {
      //   backgroundColor: "#e3f0ff",
      backgroundColor: "#E8F0FE",
      //   border: "1px solid #e3f0ff !important",
      border: "1px solid #E8F0FE !important",
    },
  },
  scrollbar: {
    "&::-webkit-scrollbar": {
      width: "0.3em",
    },
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
      background: "#f1f1f1",
      webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#014493",
      borderRadius: 20,
      padding: 5,
    },
  },
  modalFields: {
    padding: "10px 0px",
    margin: 3,
  },
}));

function Destinations({
  destinations,
  setSelectedDestination,
  setDestinations,
}) {
  const classes = useStyles();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editDestination, setEditDestination] = useState();
  const [deleteDestination, setDeleteDestination] = useState();

  // popover

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  // popover end

  const handleEditDestination = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    console.log(event.currentTarget);

    const editData = {
      destination: {
        _id: editDestination?._id,
        username: localStorage.getItem("username"),
        address: editDestination?.address,
        description: data.get("description"),
        latitude: editDestination?.latitude,
        longitude: editDestination?.longitude,
      },
    };
    console.log({ editData });

    const editResponse = await updateDestination(editData);
    console.log({ destinations, editResponse });

    if (editResponse?.success) {
      const newData = [...destinations];

      const index = newData.findIndex(
        (obj) => obj._id === editResponse?.data?._id
      );

      newData[index] = editResponse?.data;
      console.log({ newData });
      setDestinations(newData);

      setModalIsOpen(false);

      toast.success("Your destination has been updated!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error("Something went wrong. Could not update.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleDeleteDestination = async () => {
    const destinationData = deleteDestination?._id;

    console.log({ destinationData });
    const deleteResponse = await removeDestination(destinationData);

    if (deleteResponse?.success) {
      const newData = destinations.filter(
        (destination) => destination?._id !== deleteResponse?.data?._id
      );
      setDestinations(newData);

      setDeleteModalOpen(false);

      toast.success("Your destination has been deleted!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } else {
      toast.error("Something went wrong. Try again.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleAutomaticMapHover = (destination) => {
    console.log("Destinations page", { destination });
    setEditDestination(destination);
    setDeleteDestination(destination);
    setSelectedDestination(destination);
  };

  return (
    <>
      <Grid
        justifyContent="flex-start"
        // spacing={2}
        className={classes.scrollbar}
        style={{ maxHeight: "calc(100vh - 270px)", overflow: "auto" }}
      >
        {destinations?.map((destination, index) => (
          <Card
            style={{
              border: "none",
              boxShadow: "none",
              position: "relative",
              overflow: "hidden",
            }}
            className={classes.card}
            onClick={() => handleAutomaticMapHover(destination)}
            key={index}
            sx={{ minWidth: 275, marginBottom: 3 }}
          >
            <Box
              style={
                index % 2 === 0
                  ? { height: 13, background: "#a0cbff" }
                  : { height: 13, background: "#696969" }
              }
            ></Box>
            <CardContent style={{ padding: "8px 8px 16px" }}>
              <Typography
                sx={{ fontSize: 14, paddingLeft: "8px" }}
                color="text.secondary"
                gutterBottom
              >
                {destination?.date}
              </Typography>
              <Typography
                variant="h6"
                component="div"
                sx={{ paddingLeft: "8px", fontSize: 17 }}
              >
                {destination?.address}
              </Typography>

              <Typography sx={{ paddingLeft: "10px", fontSize: 15 }}>
                {destination?.description}
              </Typography>
              <br />

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  color: "#00489E",
                }}
              >
                <EditIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setModalIsOpen(true);
                    setEditDestination(destination);
                  }}
                />
                <DeleteIcon
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setDeleteModalOpen(true);
                    setDeleteDestination(destination);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </Grid>
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
            Update Destination
          </Typography>

          <Box
            component="form"
            className={classes.modalFields}
            noValidate
            onSubmit={handleEditDestination}
          >
            <TextField
              fullWidth
              variant="outlined"
              disabled
              id="address"
              value={editDestination?.address}
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
              // label="Description"
              name="description"
              value={editDestination?.description}
              onChange={({ value }) =>
                setEditDestination((prev) => ({ ...prev, description: value }))
              }
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
                Update
              </Button>
            </div>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ padding: 3 }}
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Delete Destination
          </Typography>
          <Typography
            id="modal-modal-title"
            component="div"
            style={{ margin: "10px 0px" }}
          >
            Are you sure you want to delete?
          </Typography>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              style={{
                fontWeight: 500,
                background: "none",
              }}
              onClick={() => setDeleteModalOpen(false)}
            >
              No
            </Button>
            <Button
              variant="outlined"
              style={{
                fontWeight: 500,
                border: "1px solid red",
                color: "red",
              }}
              onClick={() => handleDeleteDestination()}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default Destinations;
