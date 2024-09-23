import { Router } from 'express';
export interface Routes {
  path?: string;
  router: Router;
}

export interface ValidationError {
  type: string;
  value: string | number;
  msg: string;
  path: string;
  location: string;
}
