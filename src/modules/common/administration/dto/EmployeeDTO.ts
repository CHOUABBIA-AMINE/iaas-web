/**
 * Employee DTO
 * Data Transfer Object for Employee entity
 * 
 * @author CHOUABBIA Amine
 * @created 12-23-2025
 */

import { PersonDTO } from './PersonDTO';
import { JobDTO } from './JobDTO';
import { StructureDTO } from './StructureDTO';

export interface EmployeeDTO {
  id: number;
  personId: number;
  person?: PersonDTO;
  jobId: number;
  job?: JobDTO;
  structureId: number;
  structure?: StructureDTO;
  employeeNumber?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}
