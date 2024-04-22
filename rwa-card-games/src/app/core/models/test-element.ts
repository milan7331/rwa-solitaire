export interface DragAndDropList {
    id: string;
    elements: Element[];
}

export interface Element {
    listId: string;
    value: string;
}