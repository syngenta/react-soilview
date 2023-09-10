import React, { useRef, useEffect, useState, useContext } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./map.css";
import usStates from "../../utils/us-states.json";
import { useAppContext } from "../../App";

export default function MapLibreComponent() {
  const appContext = useAppContext();
  const { stateMap, mapInstance, updateMapInstance } = appContext;

  useEffect(() => {
    if (!stateMap || mapInstance) return;
    const map = new maplibregl.Map({
      container: "map", // container id
      style: "https://demotiles.maplibre.org/style.json", // style URL
      center: [-95.7129, 37.0902],
      zoom: 4,
    });
    map.on("load", () => {
      map.addSource("us-states", {
        type: "geojson",
        data: usStates,
      });

      // Add a layers to display the data
      map.addLayer({
        id: "us-states-fill",
        type: "fill",
        source: "us-states",
        layout: {},
        paint: {
          "fill-color": "#5f5f5f",
          "fill-opacity": 0.1,
        },
      });

      const centroidSource = {
        type: "FeatureCollection",
        features: [...stateMap.keys()].map((key) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: stateMap.get(key).center,
            },
            properties: {
              label: stateMap.get(key).name,
            },
          };
        }),
      };
      map.addSource("us-states-label", {
        type: "geojson",
        data: centroidSource,
      });

      map.addLayer({
        id: "labels",
        type: "symbol",
        source: "us-states-label",
        layout: {
          "text-field": ["get", "label"],
          "text-size": 14,
          "text-anchor": "top",
          "text-offset": [0, 1],
        },
      });
      map.getCanvas().style.cursor = 'default';
      updateMapInstance(map);
    });

    // Cleanup when the component unmounts
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [stateMap]);

  const onMouseMove = (event) => {
    if (mapInstance?.getCanvas()) {
      mapInstance.getCanvas().style.cursor = 'pointer';
    }
    const featureId = event.features?.length ? event.features[0] : null;
    // logic to select state here
  };

  const onMouseLeave = () => {
    if (mapInstance?.getCanvas()) {
      mapInstance.getCanvas().style.cursor = 'default';
    }
  }

  useEffect(() => {
    if (!mapInstance) return;
    mapInstance.on("mousemove", "us-states-fill", onMouseMove);
    mapInstance.on('mouseleave', 'us-states-fill', onMouseLeave)

    return () => {
      if (!mapInstance) return;
      mapInstance.off("mouseMove", "us-states-fill", onMouseMove);
    };
  }, [mapInstance]);

  return (
    <div className="map-wrap">
      <div id="map" className="map" />
    </div>
  );
}
