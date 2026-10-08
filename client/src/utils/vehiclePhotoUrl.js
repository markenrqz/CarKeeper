import { SERVER_ORIGIN } from "../services/api";

// Convert a stored vehicle photo path into a URL
// that the browser can display.
export const getVehiclePhotoUrl = (photo) => {
  if (!photo) {
    return null;
  }

  // Already usable URLs do not need to be changed.
  // blob: is used for a newly selected local preview.
  // data: allows data URLs if they are ever used later.
  if (/^(https?:|blob:|data:)/i.test(photo)) {
    return photo;
  }

  // MongoDB stores uploaded photos as paths such as:
  // /uploads/vehicles/example.jpg
  const photoPath = photo.startsWith("/") ? photo : `/${photo}`;

  return `${SERVER_ORIGIN}${photoPath}`;
};
