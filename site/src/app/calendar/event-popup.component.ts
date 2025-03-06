import { Component, EventEmitter, inject, Output } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { InstructorService } from '../services/instructor.service';
import { Appointment } from '../services/appointment.service';

@Component({
  selector: 'event-popup',
  imports: [],
  template: `
    <div>
      <select (change)="selectInstructor($event)">
        @for (instructor of instructorService.instructors; track $index) {
        <option [value]="instructor.id">{{ instructor.name }}</option>
        }
      </select>
    </div>
    <div>
      <select #select>
        @for (subject of getInstructorSubjects(); track $index) {
        <option [value]="subject">
          {{ subjectService.getById(subject)?.name }}
        </option>
        }
      </select>
    </div>
    <div>From <input type="time" #time1 /> to <input type="time" #time2 /></div>
    <div><input placeholder="Location" /></div>
    <div>
      <button
        (click)="
          createAppointment(
            select.value,
            [time1.valueAsDate!, time2.valueAsDate!],
            instructor
          )
        "
      >
        SAVE
      </button>
      <button (click)="close.emit()">X</button>
    </div>
  `,
  styles: ``,
})
export class EventPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Appointment>();
  subjectService: SubjectService = inject(SubjectService);
  instructorService: InstructorService = inject(InstructorService);
  instructor: number = 0;

  constructor() {
    this.subjectService.whenReady(() => {});
  }

  selectInstructor(event: Event) {
    this.instructor = (event.target as any).value;
  }
  getInstructorSubjects(): number[] | undefined {
    return this.instructorService.getById(this.instructor)?.subjects;
  }
  createAppointment(subject: string, times: Array<Date>, instructor: number) {
    this.create.emit({
      id: 0,
      subject: Number(subject),
      instructor: Number(instructor),
      date: '',
      time: [
        (times[0].getHours() - 1) * 60 + times[0].getMinutes(),
        (times[1].getHours() - 1) * 60 + times[1].getMinutes(),
      ],
    });
  }
}
