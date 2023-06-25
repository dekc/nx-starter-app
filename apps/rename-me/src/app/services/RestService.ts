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
        Authorization: `Bearer {token>}`, // TODO: pass token
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
