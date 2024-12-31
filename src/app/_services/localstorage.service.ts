import { Injectable } from "@angular/core";
import { DTOLocalStorage } from "@app/_interfaces/generic";
import { GenericService } from "./generic.service";

@Injectable({
    providedIn: 'root'
})
export class localstorageService {

    constructor(private genericService: GenericService
    ) { }

    localStorage: DTOLocalStorage | null = null;

    init(): void {
        this.localStorage = this.genericService.getLocalStorageDTO('user');
    }

}
