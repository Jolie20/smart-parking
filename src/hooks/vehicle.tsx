import { useState,createContext,useContext,ReactNode } from "react";
import { vehicleService } from "../services/vehicleService";
import { Vehicle } from "../types";

interface VehicleContextType {
    vehicles: Vehicle[];
    addVehicle: (make: string, model: string, year: number, licensePlate: string) => Promise<Vehicle | null>;
    removeVehicle: (id: string) => Promise<boolean>;
    isLoading: boolean;
}

const vehicleContext = createContext<VehicleContextType | undefined>(undefined);
export const useVehicle = () => {
    const context = useContext(vehicleContext);
    if (context === undefined) {
        throw new Error("useVehicle must be used within a VehicleProvider");
    }
    return context;
};

export const VehicleProvider = ({ children }: { children: ReactNode }) => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const addVehicle = async (make: string, model: string, year: number, licensePlate: string): Promise<Vehicle | null> => {
        setIsLoading(true);
        try {
            const newVehicle = await vehicleService.create({ make, model, year, licensePlate });
            setVehicles((prev) => [...prev, newVehicle]);
            return newVehicle;
        } catch (e) {
            return null;
        } finally {
            setIsLoading(false);
        }   
    };
    const removeVehicle = async (id: string): Promise<boolean> => {
        setIsLoading(true); 
        try {
            await vehicleService.remove(id);
            setVehicles((prev) => prev.filter(v => v.id !== id));
            return true;
        }
        catch (e) {
            return false;
        }   finally {
            setIsLoading(false);
        } 
    }
    return (
        <vehicleContext.Provider value={{ vehicles, addVehicle, removeVehicle, isLoading }}>
            {children}
        </vehicleContext.Provider>
    );
}

