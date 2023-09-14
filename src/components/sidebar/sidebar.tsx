import React from "react";
import "./sidebar.css";
import { useAppContext } from "../../App";
import { parseSoilFile } from "./utils";

const options = [
  {
    id: "general",
    label: "General Soil Map",
  },
  {
    id: "color",
    label: "Soil Color",
  },
];

const Sidebar: React.FC = () => {
  const { selectedState, selectedDataOption, setSelectedDataOption, mapInstance } =
    useAppContext();

  const handleChangeSelect = (event) => {
    if (event?.target?.value?.length) {
      setSelectedDataOption(event.target.value);
      return;
    }
    setSelectedDataOption(undefined);
  };

  const handleFileChange = async (event) => {
    if (!mapInstance) return;
    const content = await parseSoilFile(event.target.files[0]);

    mapInstance.addSource(`soil-map-${selectedState}-source`, {
      type: "geojson",
      data: content,
    });

    mapInstance.addLayer({
      id: `soil-map-${selectedState}-layer`,
      type: "fill",
      source: `soil-map-${selectedState}-source`,
      layout: {},
      paint: {
        "fill-color": "#5f5f5f",
        "fill-opacity": 0.6,
      },
    });

  };

  return (
    <div className="sidebar-container">
      <span className="siderbar-title">SoilView US</span>
      <div className="sidebar-body">
        <div className="sidebar-body-title">
          <span>1. Select a state on the map:</span>
          <span>
            <b>{`Selected State: ${selectedState?.name || "None"}`}</b>
          </span>
        </div>
        <div className="sidebar-body-title">
          <span>2. Select the type of data you like to upload:</span>
          <div>
            <label htmlFor="dataOptionSelect">Choose an option: </label>
            <select
              value={selectedDataOption}
              onChange={handleChangeSelect}
              disabled={!selectedState}
              id="dataOptionSelect"
            >
              <option value={undefined}></option>
              {options.map((option) => (
                <option id={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {selectedDataOption && (
            <span>
              To download your content,{" "}
              <a
                target="_blank"
                href={
                  selectedDataOption === "general"
                    ? "https://nrcs.app.box.com/v/soils/folder/18247487156"
                    : "https://nrcs.app.box.com/v/soils/folder/175284091466"
                }
              >
                click here
              </a>
            </span>
          )}
        </div>
        <div>
          <span>3. Upload your data file (.zip, .tiff)</span>
          <input
            disabled={!selectedDataOption || !selectedState}
            type="file"
            accept=".tiff,.zip"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
