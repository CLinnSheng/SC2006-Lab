import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const config = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask":
      "places.types,places.displayName,places.evChargeOptions,places.formattedAddress,places.location,places.shortFormattedAddress",
  },
};

const NearByEVCarPark = (data) => axios.post(BASE_URL, data, config);

export default NearByEVCarPark;
