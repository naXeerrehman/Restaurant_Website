import React, { useEffect, useRef } from "react";

const GoogleMap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const location = { lat: 54.9714, lng: -2.1038 }; // Latitude and Longitude for Hexham, UK

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 15,
        center: location,
      });

      // Add marker with a label
      const marker = new window.google.maps.Marker({
        position: location,
        map: map,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Default marker icon
          labelOrigin: new window.google.maps.Point(10, 40), // Adjust label position
        },
        label: {
          text: "Hinckley Beanery",
          color: "red",
          fontSize: "14px",
          fontWeight: "bold",
        },
      });

      // Add an info window
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="font-size: 24px; font-weight: bold;">Hinckley Beanery</div>`,
      });

      // Open info window when marker is clicked
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    };

    if (window.google && window.google.maps) {
      initMap();
    } else {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="-mt-10 relative z-[12] text-3xl text-white">
      <h1 className="px-2 mb-1">Google Map</h1>
      <div
        ref={mapRef}
        className="w-[100%] h-[50vh] lg:h-[70vh] mx-auto border-2 border-red-600"
      />
    </div>
  );
};

export default GoogleMap;
