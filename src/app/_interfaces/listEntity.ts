export interface DTOListEntity extends ListEntity {
    cards: DTOCardEntity[];
    cardPreview: DTOCardEntity | null;
}

export interface DTOCardEntity extends CardEntity {
    nameEditing: boolean;
    descriptionEditing: boolean;
}

export interface ListEntity {
    listId: string;
    listIndex: number;
    name: string;
    created: Date;
}

export interface CardEntity {
    cardId: string;
    cardIndex: number;
    listId: string; //FK
    name: string;
    description: string;
    created: Date;
}