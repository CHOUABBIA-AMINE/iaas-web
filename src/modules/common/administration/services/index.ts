/**
 * Administration Services - Central Export
 * @author CHOUABBIA Amine
 */

import StructureServiceClass from './StructureService';
import StructureTypeServiceClass from './StructureTypeService';
import JobServiceClass from './JobService';
import { employeeService } from './employeeService';
import { militaryRankService } from './militaryRankService';
import { countryService } from './countryService';
import { localityService } from './localityService';
import { stateService } from './stateService';

// Re-export as named exports for consistency
export const structureService = StructureServiceClass;
export const structureTypeService = StructureTypeServiceClass;
export const jobService = JobServiceClass;
export { employeeService };
export { militaryRankService };
export { countryService };
export { localityService };
export { stateService };
