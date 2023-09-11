import React from "react";
import "./sidebar.css";
import { useAppContext } from "../../App";

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
  const { selectedState, selectedDataOption, setSelectedDataOption } =
    useAppContext();

  const handleChangeSelect = (event) => {
    if (event?.target?.value?.length) {
      setSelectedDataOption(event.target.value);
      return;
    }
    setSelectedDataOption(undefined);
  };

  const handleFileChange = (event) => {
    console.log(event?.target?.files[0]);
  }

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
                href="https://nrcs.app.box.com/v/soils/folder/17971946225"
              >
                click here
              </a>
            </span>
          )}
        </div>
        <div>
          <span>3. Upload your data file (.mdb, .tiff)</span>
          <input disabled={!selectedDataOption || !selectedState} type="file" accept=".tiff,.mdb" onChange={handleFileChange}/>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
