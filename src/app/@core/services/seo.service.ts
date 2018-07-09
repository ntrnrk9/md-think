import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { AppConfig } from '../../app.config';
@Injectable()
export class SeoService {
    readonly siteTitle = AppConfig.siteTitle;

    constructor(private title: Title, private meta: Meta) { }

    setTitle(title: string[]): SeoService {
        title.push(this.siteTitle);
        this.title.setTitle(title.join(' | '));
        return this;
    }

    setDescription(description: string): SeoService {
        this.meta.updateTag({
            name: 'description',
            content: description
        });
        return this;
    }
}
