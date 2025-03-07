import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { InstructorService } from '../services/instructor.service';
import { Appointment } from '../services/appointment.service';

@Component({
  selector: 'event-popup',
  imports: [],
  template: `
    <div>
      <div class='exit'><button (click)='close.emit()'>X</button></div>
      <div class='inputs'>
        <div>
          <select (change)='selectInstructor($event)' class='instructor'>
            @for (currentInstructor of instructorService.instructors; track $index) {
              <option [value]='currentInstructor.id' [selected]='instructor === currentInstructor.id'>{{ currentInstructor.name }}</option>
            }
          </select>
        </div>
        <div>
          <select #select class='subject'>
            @for (subject of getInstructorSubjects(); track $index) {
            <option [value]='subject' [selected]='subject === defaultSubject'>
              {{ subjectService.getById(subject)?.name }}
            </option>
            }
          </select>
        </div>
        <div>From <input type='time' [value]='formatTime(defaultTime[0])' #time1 /> to <input type='time' [value]='formatTime(defaultTime[1])' #time2 /></div>
        <div><input placeholder='Location' value='Kiel, Germany' class='location'/></div>
      </div>
      <div class='save'>
        <button
          (click)='
            createAppointment(
              select.value,
              [time1.valueAsDate!, time2.valueAsDate!],
              instructor
            )
          '
        >
          Save
        </button>
      </div>
    </div>
  `,
  styles: `
    .instructor, .subject, .location {
      box-sizing: border-box;
      width: 203px;
    }
    .inputs {
      margin: 10px 0 10px 0;
    }
    .exit, .save {  
      display: flex;
      justify-content: flex-end;
    }
  `,
})
export class EventPopupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<Appointment>();
  @Input() instructor: number = 0;
  @Input() defaultSubject: number = 0;
  @Input() defaultTime: Array<number> = [540, 600];
  subjectService: SubjectService = inject(SubjectService);
  instructorService: InstructorService = inject(InstructorService);

  constructor() {
    this.subjectService.whenReady(() => {});
  }

  selectInstructor(event: Event) {
    this.instructor = Number((event.target as HTMLSelectElement).value);
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
  twoDigits(value: number): string {
    if (value < 10) {
        return `0${value}`;
    }
    return `${value}`;
  }

  formatTime(time: number): string {
    return `${this.twoDigits(Math.floor(time / 60))}:${this.twoDigits(time % 60)}`;
  }
}
