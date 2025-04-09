import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { NINJA_API } from './api_tokens';
import { Request } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const upload = multer();

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.post('/imgtotext', upload.single('image'), 
  async (req: MulterRequest, res) => {
    if (!req.file) {
      res.status(400).send({ error: 'No file uploaded' });
      return;
    }
    
    console.log('Forming data for Ninja API...');

    const { where, api } = NINJA_API;
    const form = new FormData();
    form.append('image', req.file.buffer, {
      filename: 'asd.png',
      contentType: 'image/png'
    });

    console.log('Sending to Ninja API...');

    try {
      const response = await axios.post(where, form, {
          headers: {
              'X-Api-Key': api,
              ...form.getHeaders(),
          },
      });
      res.send(response.data);
    } catch (error: any) {
        console.error('Full error:', error);
        res.status(500).send({ error: 'Failed to process image' });
    }
  }
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
