import { CityLocation, PrayerTimesData } from '../types';

export const POPULAR_CITIES: CityLocation[] = [
  { name: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011, timezone: 5 },
  { name: "Lahore", country: "Pakistan", latitude: 31.5497, longitude: 74.3436, timezone: 5 },
  { name: "Islamabad", country: "Pakistan", latitude: 33.6844, longitude: 73.0479, timezone: 5 },
  { name: "Makkah", country: "Saudi Arabia", latitude: 21.4225, longitude: 39.8262, timezone: 3 },
  { name: "Madinah", country: "Saudi Arabia", latitude: 24.5247, longitude: 39.5692, timezone: 3 },
  { name: "Dubai", country: "UAE", latitude: 25.2048, longitude: 55.2708, timezone: 4 },
  { name: "London", country: "United Kingdom", latitude: 51.5074, longitude: -0.1278, timezone: 0 },
  { name: "New York", country: "United States", latitude: 40.7128, longitude: -74.006, timezone: -5 },
  { name: "Istanbul", country: "Turkey", latitude: 41.0082, longitude: 28.9784, timezone: 3 },
  { name: "Toronto", country: "Canada", latitude: 43.6532, longitude: -79.3832, timezone: -5 },
  { name: "Kuala Lumpur", country: "Malaysia", latitude: 3.139, longitude: 101.6869, timezone: 8 },
  { name: "Jakarta", country: "Indonesia", latitude: -6.2088, longitude: 106.8456, timezone: 7 },
];

/**
 * Calculates prayer times using standard solar declination approximations
 */
export function calculatePrayerTimes(city: CityLocation, date: Date = new Date()): PrayerTimesData {
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  );

  // Solar declination approximation
  const declination = 23.45 * Math.sin(((360 / 365) * (dayOfYear - 81) * Math.PI) / 180);
  const timeOffset = (city.longitude / 15 - city.timezone) * 60; // in minutes
  const solarNoonMinutes = 12 * 60 - timeOffset;

  // Latitudes in radians
  const latRad = (city.latitude * Math.PI) / 180;
  const decRad = (declination * Math.PI) / 180;

  // Calculation of hour angle
  const getHourAngle = (angle: number) => {
    const angleRad = (angle * Math.PI) / 180;
    const cosHA =
      (Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return 180;
    return (Math.acos(cosHA) * 180) / Math.PI;
  };

  // Fajr at 18 degrees below horizon
  const fajrHA = getHourAngle(-18);
  const sunriseHA = getHourAngle(-0.833);
  
  // Asr (Shafi'i/Hanafi average shadow length)
  const asrAlt = (Math.atan(1 + Math.tan(Math.abs(latRad - decRad))) * 180) / Math.PI;
  const asrHA = getHourAngle(90 - asrAlt);

  // Maghrib (Sunset)
  const sunsetHA = sunriseHA;

  // Isha at 18 degrees below horizon
  const ishaHA = getHourAngle(-18);

  const fajrMin = solarNoonMinutes - (fajrHA / 15) * 60;
  const sunriseMin = solarNoonMinutes - (sunriseHA / 15) * 60;
  const dhuhrMin = solarNoonMinutes + 4; // slight buffer after zawaal
  const asrMin = solarNoonMinutes + (asrHA / 15) * 60;
  const maghribMin = solarNoonMinutes + (sunsetHA / 15) * 60;
  const ishaMin = solarNoonMinutes + (ishaHA / 15) * 60;
  const tahajjudMin = fajrMin - 90; // Last third of the night recommendation

  const formatTime = (mins: number) => {
    let m = Math.round(mins);
    if (m < 0) m += 24 * 60;
    if (m >= 24 * 60) m -= 24 * 60;
    const hours = Math.floor(m / 60);
    const minutes = m % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const h12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${String(h12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
  };

  return {
    fajr: formatTime(fajrMin),
    sunrise: formatTime(sunriseMin),
    dhuhr: formatTime(dhuhrMin),
    asr: formatTime(asrMin),
    maghrib: formatTime(maghribMin),
    isha: formatTime(ishaMin),
    tahajjud: formatTime(tahajjudMin),
  };
}

/**
 * Calculates Bearing (direction in degrees 0-360) towards the Holy Kaaba in Makkah
 */
export function calculateQiblaDirection(userLat: number, userLon: number): { bearing: number; distanceKm: number } {
  const makkahLat = 21.4225;
  const makkahLon = 39.8262;

  const lat1 = (userLat * Math.PI) / 180;
  const lon1 = (userLon * Math.PI) / 180;
  const lat2 = (makkahLat * Math.PI) / 180;
  const lon2 = (makkahLon * Math.PI) / 180;

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = (Math.atan2(y, x) * 180) / Math.PI;
  bearing = (bearing + 360) % 360;

  // Haversine distance formula
  const R = 6371; // Earth radius in km
  const dLat = lat2 - lat1;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  return {
    bearing: Math.round(bearing * 10) / 10,
    distanceKm,
  };
}
