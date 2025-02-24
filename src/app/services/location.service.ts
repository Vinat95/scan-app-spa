import { Injectable } from "@angular/core";
import { Geolocation } from "@capacitor/geolocation";

@Injectable({
  providedIn: "root",
})
export class LocationService {
  async getCurrentPosition(): Promise<{ lat: number; lon: number } | null> {
    try {
      const position = await Geolocation.getCurrentPosition();
      return {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
    } catch (error) {
      console.error("Errore nel recuperare la posizione:", error);
      return null;
    }
  }

  async getTownFromCoordinates(
    lat: number,
    lon: number
  ): Promise<string | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const data = await response.json();
      return data.display_name || null;
    } catch (error) {
      console.error("Errore nel recuperare la città:", error);
      return null;
    }
  }
}
