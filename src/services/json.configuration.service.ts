import { Injectable } from 'injection-js';
import * as consign from 'consign';
import { ConfigurationService } from './configuration.service';

@Injectable()
export class JsonConfigurationService implements ConfigurationService {
  private config: any = {};

  constructor() {
    consign({ cwd: process.env.CONFIG }).include('.').into(this.config);
  }

  getFragment(name: string): string {
    return `assets/${this.config.fragments[ name ]}`;
  }

}