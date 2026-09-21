import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { POPULAR_CITIES, calculateQiblaDirection } from '../data/prayerData';
import { CityLocation } from '../types';

export const QiblaSection: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityLocation>(POPULAR_CITIES[0]); // Karachi
  const [qiblaInfo, setQiblaInfo] = useState(
    calculateQiblaDirection(POPULAR_CITIES[0].latitude, POPULAR_CITIES[0].longitude)
  );
  const [deviceHeading, setDeviceHeading] = useState<number>(0);

  useEffect(() => {
    setQiblaInfo(calculateQiblaDirection(selectedCity.latitude, selectedCity.longitude));
  }, [selectedCity]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setDeviceHeading(360 - event.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const handleDetectGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const userCity: CityLocation = {
            name: "GPS: My Location",
            country: "Current",
            latitude: lat,
            longitude: lon,
            timezone: -new Date().getTimezoneOffset() / 60,
          };
          setSelectedCity(userCity);
        },
        (err) => {
          console.log("Could not access GPS. Please select a city from the list.");
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] flex items-center space-x-3">
            <Compass className="w-8 h-8 text-[#2e7d32]" />
            <span>Qibla Direction</span>
            <span className="text-lg text-[#2e7d32] font-arabic">قبلة الصلاة</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time interactive compass pointing directly towards the Holy Kaaba in Makkah
          </p>
        </div>

        {/* Location selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDetectGPS}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#2e7d32] hover:border-[#2e7d32] text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Detect GPS location"
          >
            <MapPin className="w-4 h-4 text-[#2e7d32]" />
            <span className="hidden sm:inline font-bold">Use GPS</span>
          </button>

          <select
            value={selectedCity.name}
            onChange={(e) => {
              const found = POPULAR_CITIES.find(c => c.name === e.target.value);
              if (found) setSelectedCity(found);
            }}
            className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-bold focus:outline-none focus:border-[#2e7d32] cursor-pointer"
          >
            {selectedCity.name === "GPS: My Location" && (
              <option value="GPS: My Location">GPS: My Location</option>
            )}
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}, {c.country}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Compass Dial Display (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
          {/* Compass Circle */}
          <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full border-8 border-emerald-100 bg-gradient-to-tr from-[#f4faf6] via-white to-[#edf7f0] shadow-inner flex items-center justify-center">
            {/* Outer Cardinal Markers */}
            <span className="absolute top-3 font-black text-xs text-rose-600">N (0°)</span>
            <span className="absolute right-4 font-bold text-xs text-slate-500">E (90°)</span>
            <span className="absolute bottom-3 font-bold text-xs text-slate-500">S (180°)</span>
            <span className="absolute left-3 font-bold text-xs text-slate-500">W (270°)</span>

            {/* Minor Tick Marks Ring */}
            <div className="absolute inset-5 rounded-full border border-dashed border-emerald-200 pointer-events-none" />

            {/* Rotating Compass Needle pointing towards Kaaba bearing */}
            <motion.div
              animate={{ rotate: qiblaInfo.bearing }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Target Pointer to Kaaba */}
              <div className="absolute top-4 flex flex-col items-center">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center shadow-md transform -translate-y-1">
                  <span className="text-base leading-none">🕋</span>
                </div>
                <div className="w-1.5 h-28 bg-gradient-to-b from-[#2e7d32] to-emerald-200 rounded-full shadow-xs" />
              </div>

              {/* South pointer */}
              <div className="absolute bottom-6 flex flex-col items-center">
                <div className="w-1.5 h-20 bg-gradient-to-t from-slate-300 to-transparent rounded-full" />
              </div>

              {/* Center Pivot Jewel */}
              <div className="w-7 h-7 rounded-full bg-[#2e7d32] border-2 border-white shadow-md z-20" />
            </motion.div>
          </div>

          {/* Readout stats */}
          <div className="mt-8 text-center space-y-1">
            <div className="text-4xl sm:text-5xl font-black text-[#111827] font-mono">
              {qiblaInfo.bearing}°
            </div>
            <p className="text-xs text-[#2e7d32] font-bold uppercase tracking-wider">
              Exact Qibla Angle from True North
            </p>
          </div>
        </div>

        {/* Info & Details Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#111827] flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-[#2e7d32]" />
              <span>Location Coordinates</span>
            </h2>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Current City:</span>
                <span className="font-bold text-slate-800">{selectedCity.name}, {selectedCity.country}</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Latitude / Longitude:</span>
                <span className="font-mono text-[#2e7d32] font-bold">
                  {selectedCity.latitude.toFixed(2)}° N, {selectedCity.longitude.toFixed(2)}° E
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">Target (Kaaba, Makkah):</span>
                <span className="font-mono text-slate-800 font-bold">21.42° N, 39.83° E</span>
              </div>
              <div className="flex justify-between p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-[#2e7d32] font-semibold">Distance to Makkah:</span>
                <span className="font-bold text-[#2e7d32] font-mono text-sm">
                  {qiblaInfo.distanceKm.toLocaleString()} KM
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-[#111827] flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#2e7d32]" />
              <span>How to Use the Qibla Compass</span>
            </h3>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li>Place your mobile device flat on a horizontal surface.</li>
              <li>Align the top of your device until the Kaaba needle points straight ahead.</li>
              <li>Facing that direction aligns you directly with the Holy Kaaba for your Salah.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
