/**
 * Geo Service
 * API service for fetching infrastructure geolocation data
 * 
 * @author CHOUABBIA Amine
 * @created 12-24-2025
 * @updated 12-24-2025
 */

import axiosInstance from '../../../../shared/config/axios';
import { StationDTO, TerminalDTO, HydrocarbonFieldDTO } from '../../core/dto';
import { InfrastructureData } from '../types/geo.types';

class GeoService {
  /**
   * Get all infrastructure with geo data
   */
  async getAllInfrastructure(): Promise<InfrastructureData> {
    try {
      console.log('GeoService - Fetching stations from /network/core/station');
      console.log('GeoService - Fetching terminals from /network/core/terminal');
      console.log('GeoService - Fetching hydrocarbon fields from /network/core/hydrocarbonField');
      
      const [stationsResponse, terminalsResponse, fieldsResponse] = await Promise.all([
        axiosInstance.get<StationDTO[]>('/network/core/station'),
        axiosInstance.get<TerminalDTO[]>('/network/core/terminal'),
        axiosInstance.get<HydrocarbonFieldDTO[]>('/network/core/hydrocarbonField')
      ]);

      console.log('GeoService - Stations API response:', stationsResponse);
      console.log('GeoService - Stations data:', stationsResponse.data);
      console.log('GeoService - Stations is array?', Array.isArray(stationsResponse.data));
      
      console.log('GeoService - Terminals API response:', terminalsResponse);
      console.log('GeoService - Terminals data:', terminalsResponse.data);
      console.log('GeoService - Terminals is array?', Array.isArray(terminalsResponse.data));
      
      console.log('GeoService - Fields API response:', fieldsResponse);
      console.log('GeoService - Fields data:', fieldsResponse.data);
      console.log('GeoService - Fields is array?', Array.isArray(fieldsResponse.data));

      // Ensure we always return arrays, even if backend returns null/undefined
      const result = {
        stations: Array.isArray(stationsResponse.data) ? stationsResponse.data : [],
        terminals: Array.isArray(terminalsResponse.data) ? terminalsResponse.data : [],
        hydrocarbonFields: Array.isArray(fieldsResponse.data) ? fieldsResponse.data : []
      };
      
      console.log('GeoService - Returning result:', result);
      return result;
    } catch (error) {
      console.error('GeoService - Error fetching infrastructure data:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('GeoService - Error response:', (error as any).response);
      }
      // Return empty arrays on error to prevent crashes
      return {
        stations: [],
        terminals: [],
        hydrocarbonFields: []
      };
    }
  }

  /**
   * Get infrastructure within bounding box (for performance optimization)
   * TODO: Implement backend endpoint for spatial queries
   */
  async getInfrastructureInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<InfrastructureData> {
    // For now, fetch all and filter client-side
    const data = await this.getAllInfrastructure();
    
    return {
      stations: data.stations.filter(s => 
        s.latitude >= bounds.south && s.latitude <= bounds.north &&
        s.longitude >= bounds.west && s.longitude <= bounds.east
      ),
      terminals: data.terminals.filter(t => 
        t.latitude >= bounds.south && t.latitude <= bounds.north &&
        t.longitude >= bounds.west && t.longitude <= bounds.east
      ),
      hydrocarbonFields: data.hydrocarbonFields.filter(f => 
        f.latitude >= bounds.south && f.latitude <= bounds.north &&
        f.longitude >= bounds.west && f.longitude <= bounds.east
      )
    };
  }
}

export default new GeoService();
