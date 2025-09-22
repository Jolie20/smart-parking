import { useState,createContext,useContext,ReactNode } from "react";
import { vehicleService } from "../services/vehicleService";
import { Vehicle } from "../types";

interface VehicleContextType {
    vehicles: Vehicle[];
    addVehicle: (make: string, model: string, year: number, licensePlate: string) => Promise<Vehicle | null>;
    removeVehicle: (id: string) => Promise<boolean>;
    isLoading: boolean;
}

