import { Injectable } from "@angular/core";
import { DTOLocalStorage } from "@app/_interfaces/generic";

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  
  constructor(
  ) { }

  private typingTimeout: any;

  getLocalStorageDTO(name: string): DTOLocalStorage | null {
    const response = localStorage.getItem(name);
    if (response == null || response === undefined) {
      return null;
    }

    return JSON.parse(response);
  }

  getLocalStorage(name: string): string | null {
    const response = localStorage.getItem(name);
    if (response == null || response === undefined) {
      return null;
    }

    return response;
  }

  setLocalStorage(name: string, value: string): void {
    localStorage.setItem(name, value);
  }

  // Función para generar un GUID / UUID versión 4
  generateGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  public debounce(callback: () => void, delay: number) {
    // Limpiar el temporizador anterior si existe
    clearTimeout(this.typingTimeout);
    // Establecer un nuevo temporizador
    this.typingTimeout = setTimeout(callback, delay);
  }

  public selectTextToElement(element: HTMLElement, selectAll: boolean = false) {
    const range = document.createRange(); // Crea un nuevo rango
    const selection = window.getSelection(); // Obtiene la selección actual
    if(selection === null) return;

    range.selectNodeContents(element); // Selecciona todo el contenido del elemento
    if(!selectAll) {
      range.collapse(false); // Colapsa el rango al final del contenido
    }

    selection.removeAllRanges(); // Limpia las selecciones anteriores
    selection.addRange(range); // Añade el nuevo rango
  }

}
