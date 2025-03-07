import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { Instructor, InstructorService } from '../services/instructor.service';

@Component({
  selector: 'instructor-popup',
  imports: [],
  template: `
    <div>
      <div>
        <input placeholder="name" [value]='name' (keyup)='handleNameInput($event)' />
        <input placeholder="picture" [value]='image' (keyup)='handleImageInput($event)' />
        <input type="color" #color />
      </div>
      <div>
        <input placeholder="experience" />
        <select name="personality">
          <option value="neither">/</option>
          <option value="energetic">energetic</option>
          <option value="friendly">friendly</option>
          <option value="political">political</option>
        </select>
        <select name="teaching">
          <option value="neither">/</option>
          <option value="homework">lots of homework</option>
          <option value="stories">story teller</option>
          <option value="quizzes">random quizzer</option>
        </select>
      </div>
      <div>
        @for (i of subjects; track $index) {
        <select
          name="subject"
          style="display: block;"
          (change)="this.select($event, $index)"
        >
          @for (subject of subjectService.subjects; track $index) {
            <option [value]="subject.id">{{ subject.name }}</option>
          }
        </select>
        }
      </div>
      <div>
        <button
          (click)="createInstructor(name, image, color.value)"
          [disabled]='!validInput(name, image)'
        >
          Save
        </button>
        @if (subjects.length < subjectService.subjects.length) {
          <button (click)="subjects.push(0)">+</button>
        }
        <button (click)="close.emit()">X</button>
      </div>
    </div>
  `,
  styles: `

  `,
})
export class EventPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Instructor>();
  subjectService: SubjectService = inject(SubjectService);
  instructorService: InstructorService = inject(InstructorService);
  instructor: number = 0;
  subjects: Array<number> = [0];
  name: string = '';
  image: string = '';

  constructor() {
    this.subjectService.whenReady(() => {});
  }

  select(event: Event, index: number) {
    this.subjects[index] = Number((event.target as HTMLSelectElement).value);
  }
  createInstructor(name: string, image: string, color: string) {
    this.instructorService.createInstructor({
      name,
      id: 0,
      subjects: this.subjects,
      image,
      color,
    });
  }
  validInput(name: string, image: string): boolean {
    if ((new Set(this.subjects)).size !== this.subjects.length) { return false; }
    if (name.length === 0 || image.length === 0) { return false; }
    return true;
  }
  handleNameInput(event: KeyboardEvent) { this.name = (event.target! as HTMLInputElement).value; }
  handleImageInput(event: KeyboardEvent) { this.image = (event.target! as HTMLInputElement).value; }
}
