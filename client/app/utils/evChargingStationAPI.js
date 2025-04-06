import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
    "X-Goog-FieldMask":
      "places.displayName,places.evChargeOptions,places.formattedAddress,places.location,places.shortFormattedAddress,places.photos",
  },
};

const NearByEVCarPark = (data) => axios.post(BASE_URL, data, config);

export default NearByEVCarPark;