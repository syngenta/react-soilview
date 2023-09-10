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
    if (event.target.value?.length) {
      setSelectedDataOption(event.targer.value);
      return;
    }
    setSelectedDataOption(undefined);
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
        </div>
        <div>

        </div>
      </div>
      <span>footer</span>
    </div>
  );
};

export default Sidebar;
