import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { distinctUntilChanged } from 'rxjs/operators';

import { DynamicObject } from '../entities/common.entities';

@Injectable()
export class DataStoreService {
    private currentStoreSubject = new BehaviorSubject<DynamicObject>({} as DynamicObject);
    public currentStore = this.currentStoreSubject.asObservable().pipe(distinctUntilChanged());

    constructor() {}

    setData(key: string, value: any) {
        const currentStore = this.getCurrentStore();
        currentStore[key] = value;
        this.currentStoreSubject.next(currentStore);
    }

    getData(key: string): any {
        const currentStore = this.getCurrentStore();
        return currentStore[key];
    }

    clearStore() {
        const currentStore = this.getCurrentStore();
        Object.keys(currentStore).forEach((key) => {
            delete currentStore[key];
        });
        this.currentStoreSubject.next(currentStore);
    }

    private getCurrentStore(): DynamicObject {
        return this.currentStoreSubject.value;
    }
}
