import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface Option {
  name: string;
  active: boolean;
}

@Component({
  selector: 'app-filter-selector',
  imports: [],
  templateUrl: './filter-selector.component.html',
  styleUrl: './filter-selector.component.scss',
})
export class FilterSelectorComponent {
  @Output() update = new EventEmitter<Array<Option>>();
  @Input() category: string = '';
  @Input() options: Array<Option> = [];
  all: boolean = false;

  limit(): Array<Option> {
    if (this.all) {
      return this.options;
    } else {
      return this.options.slice(0, 3);
    }
  }

  setAll(value: boolean) {
    let newOptions = [];
    for (let option of this.options) {
      let newOption = option;
      newOption.active = value;
      newOptions.push(newOption);
    }
    this.options = newOptions;
    console.log(this.options);
    this.update.emit(this.options);
  }

  handleClick(index: number) {
    let copy = structuredClone(this.options);
    copy[index].active = !copy[index].active;
    this.update.emit(copy);
  }
}
