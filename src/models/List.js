import uniqid from 'uniqid';

export default class List {
    constructor(){
        this.items = []
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }

        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index, 1);
        // [3,5,7] splice(1, 2) -> returns [5, 7], original array is [3] - delete item from array, immutable
        // [3,5,7] slice(1, 2) -> returns 5, original array is [3,5,7]
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
        //find returns whole el in this case objests
    }
}