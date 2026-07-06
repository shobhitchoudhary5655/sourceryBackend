import geocoder from "./geocoder";

export const getLocationName = async (
    latitude: number,
    longitude: number
): Promise<string> => {

    try {

        const result = await geocoder.reverse({
            lat: latitude,
            lon: longitude,
        });

        console.log("Reverse Geocoder Result:");
        console.log(JSON.stringify(result, null, 2));

        if (!result.length) {
            return "Unknown Location";
        }

        return result[0].formattedAddress || "Unknown Location";

    } catch (error) {

        console.error(error);

        return "Unknown Location";
    }
};