import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";
import MapLibreComponent from "./components/map/map";
import Sidebar from "./components/sidebar/sidebar";
import usStates from "./utils/us-states.json";

export interface State {
  readonly name: string;
  readonly id: string;
  readonly center: ReadonlyArray<number>;
}

export interface IApplicationContext {
  readonly stateMap: Map<string, State>;
  readonly mapInstance: any;
  readonly updateMapInstance: (map: any) => void;
}

const ApplicationContext = createContext<IApplicationContext>({
  stateMap: new Map(),
  mapInstance: undefined,
  updateMapInstance: undefined,
});

export const useAppContext = () => useContext(ApplicationContext);

function App() {
  const [stateMap, setStateMap] = useState<Map<string, State>>(new Map());
  const [mapInstance, setMapInstance] = useState<any>();

  useEffect(() => {
    const newStateList = usStates.features.reduce<Map<string, State>>(
      (acc, feature) => {
        return acc.set(feature.id, {
          name: feature.properties.name,
          id: feature.id,
          center: [...feature.properties.center].reverse(),
        });
      },
      new Map()
    );

    setStateMap(newStateList);
  }, []);
  return (
    <ApplicationContext.Provider
      value={{
        stateMap: stateMap,
        mapInstance: mapInstance,
        updateMapInstance: setMapInstance,
      }}
    >
      <div className="app-container">
        <Sidebar />
        <MapLibreComponent />
      </div>
    </ApplicationContext.Provider>
  );
}

export default App;
