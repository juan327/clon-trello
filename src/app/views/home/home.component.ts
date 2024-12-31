import { Component, ElementRef, inject, OnInit, signal, ViewChild, viewChild } from '@angular/core';
import { GenericService } from '@app/_services/generic.service';
import { ListEntity, CardEntity, DTOListEntity, DTOCardEntity } from 'src/app/_interfaces/listEntity';
import { HomeEnum } from './enums/enum_home';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Cooldown } from 'src/app/decorators/cooldown.decorator';
import { IndexeddbService } from '@app/_services/indexeddb.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor() { }

  genericService = inject(GenericService);
  indexeddbService = inject(IndexeddbService);
  fb = inject(FormBuilder);

  $HomeEnum = HomeEnum;
  $listas: DTOListEntity[] = [];

  $modals: { card: boolean } = {
    card: false,
  };
  $selectedCard: DTOCardEntity | null = null;
  $modalForm: FormGroup = this.fb.group({
    description: new FormControl('')
  });

  $dragCard: DTOCardEntity | null = null;
  $dragList: DTOListEntity | null = null;

  public ngOnInit() {
    const tables = [{tableName: HomeEnum.TABLE_LISTAS_NAME as string, primaryKey: HomeEnum.TABLE_LISTAS_PRIMARYKEY as string}, {tableName: HomeEnum.TABLE_TARJETAS_NAME as string, primaryKey: HomeEnum.TABLE_TARJETAS_PRIMARYKEY as string}];
    this.indexeddbService.initDB(tables);
    
    this.indexeddbService.getAllItems<CardEntity>(HomeEnum.TABLE_TARJETAS_NAME, 'cardIndex', 'asc').then(responseTarjetas => {
      this.indexeddbService.getAllItems<ListEntity>(HomeEnum.TABLE_LISTAS_NAME, 'listIndex', 'asc').then(responseListas => {
        this.$listas = responseListas.map<DTOListEntity>(listItem=>{
          return { listId: listItem.listId, listIndex: listItem.listIndex, name: listItem.name, created: listItem.created, cardPreview: null,
            cards: responseTarjetas.filter(c=>c.listId === listItem.listId).map<DTOCardEntity>(cardItem => {
              return { cardId: cardItem.cardId, cardIndex: cardItem.cardIndex, listId: cardItem.listId, created: cardItem.created, name: cardItem.name, description: cardItem.description, nameEditing: false, descriptionEditing: false };
            })};
        });
      }, error => {
        console.error(error);
      });
    }, error => {
      console.error(error);
    });
  }

  public agregarLista() {
    const listId = this.genericService.generateGuid();
    const created = new Date();

    const count = this.$listas.length + 1;
    const newObj: ListEntity = { listId: listId, listIndex: count, name: `Lista ${count}`, created: created };
    this.$listas.push({ ...newObj, cards: [], cardPreview: null });
    this.indexeddbService.addItem<ListEntity>(HomeEnum.TABLE_LISTAS_NAME, newObj).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  public eliminarLista(listItem: DTOListEntity) {
    this.$listas = this.$listas.filter(item => item.listId !== listItem.listId);
    this.indexeddbService.deleteItem(HomeEnum.TABLE_LISTAS_NAME, listItem.listId).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });

    for(let i = 0; i < listItem.cards.length; i++) {
      this.indexeddbService.deleteItem(HomeEnum.TABLE_TARJETAS_NAME, listItem.cards[i].cardId).then(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
    }
  }

  public agregarTarjeta(listItem: DTOListEntity) {
    const cardId = this.genericService.generateGuid();
    const created = new Date();

    const count = listItem.cards.length + 1;
    const newObj: CardEntity = { cardId: cardId, cardIndex: count, listId: listItem.listId, created: created, name: 'Tarjeta ' + count, description: '' };
    listItem.cards.push({ ...newObj, nameEditing: false, description: '', descriptionEditing: false });

    this.indexeddbService.addItem<CardEntity>(HomeEnum.TABLE_TARJETAS_NAME, newObj).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  public editarTarjeta(cardItem: DTOCardEntity, event: any) {
    event.stopPropagation(); // Evita que el clic se propague al div

    if(cardItem.nameEditing) {
      this.submitEditarTarjeta(cardItem);
      cardItem.nameEditing = false;
    } else {
      cardItem.nameEditing = true;

      setTimeout(() => {
        this.submitEditarTarjeta(cardItem);
      }, 100);
    }
  }

  public eliminarTarjeta(listItem: DTOListEntity, cardItem: DTOCardEntity, event: any) {
    event.stopPropagation(); // Evita que el clic se propague al div
    listItem.cards = listItem.cards.filter(item => item.cardId !== cardItem.cardId);
    this.indexeddbService.deleteItem(HomeEnum.TABLE_TARJETAS_NAME, cardItem.cardId).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  // Método que se ejecuta cuando el foco se pierde (blur)
  public onBlurEditarLista(listItem: DTOListEntity) {
    const input = document.getElementById(`${this.$HomeEnum.ID_INPUT_EDIT_LIST}${listItem.listId}`);
    if(input === null) return;

    if(input.innerText.trim() === '') {
      input.innerText = listItem.name;
    }
    else{
      listItem.name = input.innerText;
      this.indexeddbService.updateItem(HomeEnum.TABLE_LISTAS_NAME, listItem.listId, listItem).then(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
    }
  }

  private submitEditarTarjeta(cardItem: DTOCardEntity) {
    const input = document.getElementById(`${this.$HomeEnum.ID_INPUT_EDIT_CARD}${cardItem.cardId}`);
    if(input === null) return;

    if(input.innerText.trim() === '') {
      input.innerText = cardItem.name;
    }
    else{
      cardItem.name = input.innerText;
      this.genericService.selectTextToElement(input, true);

      this.indexeddbService.updateItem(HomeEnum.TABLE_TARJETAS_NAME, cardItem.cardId, cardItem).then(response => {
        console.log(response);
      }, error => {
        console.error(error);
      });
    }
  }

  public selectCard(cardItem: DTOCardEntity) {
    if(cardItem.nameEditing === true) return;
    this.$modals.card = true;
    this.$selectedCard = cardItem;
  }

  public editarDescription(cardItem: DTOCardEntity) {
    cardItem.descriptionEditing = true;
    this.$modalForm = this.fb.group({
      description: new FormControl(cardItem.description)
    });
    
    setTimeout(() => {
      const input = document.getElementById(this.$HomeEnum.ID_TEXTAREA_CARD);
      if(input === null) return;
      input.focus();
    }, 100);
  }

  public submitEditarDescription(cardItem: DTOCardEntity, modelForm: FormGroup) {
    const findLista = this.$listas.find(c=>c.listId === cardItem.listId);
    if(findLista === undefined) return;

    const findCard = findLista.cards.find(c => c.cardId === cardItem.cardId);
    if(findCard === undefined) return;

    findCard.description = modelForm.value.description;
    findCard.descriptionEditing = false;
    cardItem = findCard;

    this.indexeddbService.updateItem(HomeEnum.TABLE_TARJETAS_NAME, cardItem.cardId, cardItem).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  public cancelEditarDescription(cardItem: DTOCardEntity) {
    cardItem.descriptionEditing = false;
  }

  // Cuando comienza a arrastrarse un elemento
  public onDragStart(event: DragEvent, listItem: DTOListEntity, cardItem: DTOCardEntity) {
    this.$dragCard = cardItem;
    this.$dragList = listItem;
  }

  public onDragEnd() {
    this.$dragCard = null;
    this.$dragList = null;
    this.limpiarCardPreviews();
  }

  // Maneja el evento de "drop" cuando se suelta el elemento
  public onDrop(event: DragEvent, listItem: DTOListEntity) {
    if(this.$dragCard === null || this.$dragList === null) return;

    const dragCard: DTOCardEntity = this.$dragCard;
    const dragList: DTOListEntity = this.$dragList;

    this.deleteCard(dragList, dragCard);

    dragCard.listId = listItem.listId;
    // Si se detectó una posición específica para soltar el ítem, se inserta ahí
    listItem.cards.push(dragCard);
    this.onDragEnd();
    this.indexeddbService.updateItem<CardEntity>(HomeEnum.TABLE_TARJETAS_NAME, dragCard.cardId, dragCard).then(response => {
      console.log(response);
    }, error => {
      console.error(error);
    });
  }

  // Evita el comportamiento predeterminado para permitir el "drop"
  // ayuda a la previsualización del elemento
  @Cooldown(50)
  public onDragOver(event: DragEvent, listItem: DTOListEntity) {
    event.preventDefault();
    if(this.$dragList === null) return;
    if(this.$dragCard === null) return;
    if(this.$dragList.listId === listItem.listId) return;
    listItem.cardPreview = this.$dragCard;
  }

  @Cooldown(50)
  public onDragLeave(event: DragEvent, listItem: DTOListEntity) {
    event.preventDefault();
    listItem.cardPreview = null;
  }

  private deleteCard(listItem: DTOListEntity, cardItem: DTOCardEntity): void {
    const { listIndex, cardIndex } = this.findIndexTarjeta(listItem, cardItem);
    if(this.$listas[listIndex] === undefined) return;
    if(this.$listas[listIndex].cards[cardIndex] === undefined) return;
    this.$listas[listIndex].cards.splice(cardIndex, 1);
  }

  private findIndexTarjeta(listItem: DTOListEntity, cardItem: DTOCardEntity): { listIndex: number, cardIndex: number } {
    const listIndex = this.$listas.findIndex(c => c.listId === listItem.listId);
    const cardIndex = this.$listas[listIndex].cards.findIndex(c => c.cardId === cardItem.cardId);
    return { listIndex: listIndex, cardIndex: cardIndex };
  }

  private limpiarCardPreviews() {
    for(let i = 0; i < this.$listas.length; i++) {
      this.$listas[i].cardPreview = null;
    }
  }

}
