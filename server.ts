import http from 'node:http';
import { URL } from 'node:url';

export interface CustomRequest extends http.IncomingMessage {
  body?: any;
  [key: string]: any;
}

export type CustomResponse = http.ServerResponse;

class CustomError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.code = code;
  }
}

type NextMiddlewareExecutor = (error?: CustomError) => void;

export type Middleware = (
  request: CustomRequest,
  response: CustomResponse,
  next?: NextMiddlewareExecutor
) => void;

type URLPath = string;

type AllowedHTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH';


export class HTTPServer {
  private port: number;
  private server: ReturnType<typeof http.createServer>; 
  private middlewareMap: Record<AllowedHTTPMethods, Record<URLPath, Middleware[]>> = {
    GET: {},
    POST: {},
    PUT: {},
    PATCH: {},
  };
  private globalProcessors: Middleware[] = [];

  constructor(port: number) {
    this.port = port;
    this.server = http.createServer(
      (request: CustomRequest, response: CustomResponse) => {
        if (
          request.method !== 'GET' &&
          request.method !== 'POST' &&
          request.method !== 'PUT' &&
          request.method !== 'PATCH'
        ) {
          response.writeHead(500).end(`Sorry, currently not handling ${request.method}`);
          return;
        }
        this.handleRequest(request, response);
      }
    );
    this.server.listen(port, () => {
      console.log('listening at port:', port);
    });
  }

  private handleRequest(request: CustomRequest, response: CustomResponse) {
    if (request.method) {
      const method = request.method as AllowedHTTPMethods;
      const url = new URL(request.url ?? '', `http://${request.headers.host}`);
      const path = url.pathname;
      const pathMiddlewares = this.middlewareMap[method][path] || [];

      this.executeMiddleware(request,response,this.globalProcessors, 0);
      this.executeMiddleware(request,response,pathMiddlewares, 0);
    }
  }

  public get(path: string, ...middleware: Middleware[]) {
    this.middlewareMap['GET'][path] = this.middlewareMap['GET'][path] || [];
    this.middlewareMap['GET'][path].push(...middleware);
  }

  public post(path: string, ...middleware: Middleware[]) {
    this.middlewareMap['POST'][path] = this.middlewareMap['POST'][path] || [];
    this.middlewareMap['POST'][path].push(...middleware);
  }

  public put(path: string, ...middleware: Middleware[]) {
    this.middlewareMap['PUT'][path] = this.middlewareMap['PUT'][path] || [];
    this.middlewareMap['PUT'][path].push(...middleware);
  }

  public patch(path: string, ...middleware: Middleware[]) {
    this.middlewareMap['PATCH'][path] = this.middlewareMap['PATCH'][path] || [];
    this.middlewareMap['PATCH'][path].push(...middleware);
  }

  public use(middleware: Middleware) {
    this.globalProcessors.push(middleware);
  }

  private executeMiddleware(request:CustomRequest,response:CustomResponse,
    middlewares: Middleware[],
    nextIndex: number
  ){
    if (nextIndex < middlewares.length) {
      const next = this.nextFunctionCreator(request, response, nextIndex, middlewares);
      middlewares[nextIndex](request, response, next);
    }
  };

  private nextFunctionCreator(
    request: CustomRequest,
    response: CustomResponse,
    nextIndex: number,
    middlewares: Middleware[]
  ): NextMiddlewareExecutor {
    return (error?: CustomError) => {
      if (error) {
        response.writeHead(error.code).end(error.message);
      } else if (nextIndex < middlewares.length - 1) {
        middlewares[nextIndex + 1](request, response, this.nextFunctionCreator(request, response, nextIndex + 1, middlewares));
      }
    };
  }
}
