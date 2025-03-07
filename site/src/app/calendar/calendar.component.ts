import { Component, inject } from '@angular/core';
import { InstructorService } from '../services/instructor.service';
import { SubjectService } from '../services/subject.service';
import { EventPopupComponent } from './event-popup.component';
import { CommonModule } from '@angular/common';
import {
  Appointment,
  AppointmentService,
} from '../services/appointment.service';
import {
  FilterSelectorComponent,
  Option,
} from '../filter-selector/filter-selector.component';
import { InstructorSmallComponent } from '../instructors/instructor-small.component';

@Component({
  selector: 'app-calendar',
  imports: [
    CommonModule,
    EventPopupComponent,
    FilterSelectorComponent,
    FilterSelectorComponent,
    InstructorSmallComponent,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  date: Date = new Date();
  instructorService: InstructorService = inject(InstructorService);
  subjectService: SubjectService = inject(SubjectService);
  appointmentService: AppointmentService = inject(AppointmentService);
  showPopup: boolean = false;
  days: Array<number> = [];
  selectedDay: number = 0;
  selecting: boolean = false;
  selected: Array<number> = [];
  filter: Array<Option> = [];
  search: string = '';
  updating: number = -1;
  hovering: Array<number> | null = null;

  constructor() {
    for (let i = -3; i <= 16; i++) this.days.push(i);
    this.subjectService.whenReady(
      () => (this.filter = this.subjectService.subjectOptions())
    );
  }

  relativeDate(value: number): Date {
    let date = new Date();
    date.setDate(date.getDate() + value);
    return date;
  }

  dynamicStyle(index: number, search: string): string {
    let instructors: Array<number> = [];
    for (let i = 0; i < index + 1; i++) {
      if (!instructors.includes(this.dayAppointments(search)[i].instructor))
        instructors.push(this.dayAppointments(search)[i].instructor);
      if (
        this.dayAppointments(search)[index].instructor ==
        this.dayAppointments(search)[i].instructor
      )
        break;
    }
    let time = this.dayAppointments(search)[index].time;
    return `
        background-color: ${
          this.instructorService.getById(
            this.dayAppointments(search)[index].instructor
          )!.color
        }; 
        left: ${2 * (time[0] - 9 * 60)}px; 
        top: ${(instructors.length - 1) * 60}px; 
        width: ${2 * (time[1] - time[0])}px;`;
  }

  createAppointment(appointment: Appointment) {
    appointment.date = this.formatSelectedDate();
    this.appointmentService.createAppointment(appointment);
  }

  updateAppointment(appointment: Appointment) {
    appointment.id = this.updating;
    appointment.date = this.formatSelectedDate();
    this.appointmentService.updateAppointment(appointment);
  }

  formatSelectedDate() {
    let date = this.relativeDate(this.selectedDay);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  dayAppointments(search: string): Array<Appointment> {
    let selected = this.formatSelectedDate();
    return this.appointmentService
      .filter(this.filter, search)
      .filter((appointment) => appointment.date === selected);
  }

  toggleSelected(appointment: number) {
    if (!this.selecting) {
      return;
    }
    if (!this.selected.includes(appointment)) {
      this.selected.push(appointment);
      return;
    }
    this.selected = this.selected.filter((element) => element !== appointment);
  }

  toggleSelecting() {
    this.selecting = !this.selecting;
    if (!this.selecting) this.selected = [];
  }

  updateSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
  }

  handleClick(appointment: number) {
    if (this.selecting) {
      return this.toggleSelected(appointment);
    }
    this.updating = appointment;
    console.log(this.updating);
  }

  twoDigits(value: number): string {
    if (value < 10) {
        return `0${value}`;
    }
    return `${value}`;
  }

  formatTime(time: number): string {
    return `${Math.floor(time / 60)}:${this.twoDigits(time % 60)}`;
  }

  dynamicHoverStyle() {
    return `position: absolute; left: ${this.hovering![1] - 280}px; top: ${this.hovering![2]}px;` 
  }
}
