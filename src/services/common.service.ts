import { Injectable } from 'injection-js';
import * as base64 from 'base64-async';
import * as fs from 'fs';

@Injectable()
export class CommonService {

  async getAssetsFolder(): Promise<string> {
    return Promise.resolve(process.env.ASSETS);
  }

  async encodeFileToBase64(filePath: string): Promise<string> {
    return Promise.resolve(base64.encode(fs.readFileSync(filePath)));
  }
}
