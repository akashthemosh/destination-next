import axios from "axios";

const api = axios.create({
  withCredentials: true,
});

export const getDestinations = async () => {
  try {
    const response = await api.get(`destinations/`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log({ response });
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error in: getDestinations", { error });
    return false;
  }
};

export const addDestination = async (destinationData) => {
  try {
    const response = await api.post(`destinations/`, destinationData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log({ response });
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error in: addDestination", { error });
    return false;
  }
};

export const updateDestination = async (destinationData) => {
  try {
    const response = await api.put(`destinations/`, destinationData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response) {
      console.log({ response });
      // localStorage.setItem("update", true);
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error in: addDestination", { error });
    return false;
  }
};

export const removeDestination = async (destinationData) => {
  try {
    console.log("api", destinationData);
    const response = await api.delete(`destinations/?id=${destinationData}`);
    if (response) {
      console.log({ response });
      // localStorage.setItem("delete", true);
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.log("error in: deleteDestination", { error });
    return false;
  }
};
