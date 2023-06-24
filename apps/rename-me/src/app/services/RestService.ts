import { catchError, Observable, of } from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { switchMap } from 'rxjs/operators';

const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = 8888;

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/; // Note: missing trailing "Z" in time strings from backend

function stringToDate(key: string, value: unknown) {
  if (typeof value === 'string' && dateFormat.test(value)) {
    return new Date(value + 'Z');
  }

  return value;
}

class RestClientService {
  private static instance: RestClientService;
  private protocol: string;
  private host: string;
  private port: number;

  private constructor({
    protocol,
    host,
    port,
  }: { protocol?: string; host?: string; port?: number } = {}) {
    console.debug('Ctor RestClientService');
    this.protocol = protocol || PROTOCOL;
    this.host = host || HOST;
    this.port = port || PORT;
  }

  public static getInstance(): RestClientService {
    if (!RestClientService.instance) {
      RestClientService.instance = new RestClientService();
    }

    return RestClientService.instance;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public get$<RES>(url: URL): Observable<RES | any> {
    const urlStr = url.toString();
    // const urlStr = `${this.protocol}://${this.host}:${this.port}${path}`;
    return fromFetch(urlStr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNyc2Etc2hhMjU2IiwidHlwIjoiSldUIn0.eyJzdWIiOiJwb3J0b2Z2YW5jb3V2ZXJ2dHNkaGlzdXBwb3J0IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6IlZhbmNvdXZlciBWVFMgREhJIFN1cHBvcnQiLCJyb2xlcyI6IltcbiAgXCJWVFNcIlxuXSIsImRlYnVnIjoiVHJ1ZSIsIm1vZHVsZXMiOiJbXG4gIFwiVHJhbnNpdHNcIlxuXSIsImNsaWVudGlkIjoiUG9ydE9mVmFuY291dmVyIiwiZGVzY3JpcHRpb24iOiIiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL2dyb3Vwc2lkIjpbIkR5bmFtaWMtU3VwcG9ydC1BY2Nlc3MiLCJFZGl0b3JzIiwiU3VwcG9ydC1BY2Nlc3MiXSwiZXhwIjoxNjg2Mzc2Mzk5LCJpc3MiOiJkaGlncm91cC5jb20iLCJhdWQiOiJkaGlncm91cC5jb20ifQ.QXtH-EP5TREAtLM8knxmje7a8jttYogqPb-bA2ub_rNRElWEgkaqzwfYB7Ppddg8R342q7bBxPpxmMoMnZBG9Ml1z49TH0ujI-peoO9LjEGHVdbBdVZkNTLX7RjRvh73V9F-oMOnQ6yHyPdrV3B1bxthjX7HupOUWLJlLV2Ryuq7yTkO3DRtAAcvId54YEElmZYOsN-0ed54PBK3Y_Ze-eOP_Z69VJXrhycKu-nahxv-kpWHzkYZDwgxCcdrQSsjdiO7_Wo_ta6PFQZsPUEZnvBWVCnyCmxQbCqxEp0MteT7OBfiS-7VNibu2D-hfMuZFftUbdwQuLzgLNZ-BqRMRw`,
      },
    }).pipe(
      switchMap((response) => {
        if (response.ok) {
          // OK return data
          return response.text().then((text) => JSON.parse(text, stringToDate));
        } else {
          // Server is returning a status requiring the client to try something else.
          return of({ error: true, message: `Error ${response.status}` });
        }
      }),
      catchError((err) => {
        console.error('Error in RestClientService.get$', err);
        return of(err);
      })
    );
  }
}

// POST, PUT, DELETE, etc. are not implemented yet.
export { RestClientService };
