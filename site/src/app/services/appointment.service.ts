import { inject, Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { Option } from '../filter-selector/filter-selector.component';
import { InstructorService } from './instructor.service';
import { SubjectService } from './subject.service';

export interface Appointment {
  id: number;
  subject: number;
  instructor: number;
  date: string;
  time: Array<number>;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  serverService: ServerService = inject(ServerService);
  instructorService: InstructorService = inject(InstructorService);
  subjectService: SubjectService = inject(SubjectService);
  appointments: Array<Appointment> = [];

  constructor() {
    this.serverService.socket.addEventListener('open', (event) => {
      this.serverService.getResponse<null, Array<Appointment>>(
        'get_appointments',
        null,
        (data) => (this.appointments = data)
      );
    });
    this.serverService.permanentListener<Appointment>(
      'created_appointment',
      (data) => this.appointments.push(data)
    );
    this.serverService.permanentListener<Array<number>>(
      'deleted_appointments',
      (data) => {
        for (let id of data) {
          this.appointments = this.appointments.filter(
            (element) => element.id !== id
          );
        }
      }
    );
    this.serverService.permanentListener<Appointment>(
      'updated_appointment',
      (data) => {
        let index = this.appointments.findIndex(
          (element) => element.id === data.id
        );
        if (index === -1) {
          return;
        }
        this.appointments[index] = data;
      }
    );
  }

  createAppointment(appointment: Appointment) {
    this.serverService.sendMessage('create_appointment', appointment);
  }

  deleteAppointments(appointments: Array<number>) {
    this.serverService.sendMessage('delete_appointments', appointments);
  }

  updateAppointment(appointment: Appointment) {
    this.serverService.sendMessage('update_appointment', appointment);
  }

  filter(subjectFilter: Array<Option>, search: string): Array<Appointment> {
    let filteredAppointments = [];
    if (subjectFilter.filter((element) => element.active).length === 0) {
      filteredAppointments = this.appointments;
    } else {
      for (let appointment of this.appointments) {
        if (subjectFilter[appointment.subject].active) {
          filteredAppointments.push(appointment);
        }
      }
    }

    let searchedAppointments: Array<Appointment> = [];
    if (search !== '') {
      for (let appointment of filteredAppointments) {
        if (
          this.instructorService
            .getById(appointment.instructor)
            ?.name.toLowerCase()
            .includes(search.toLowerCase()) ||
          this.subjectService
            .getById(appointment.subject)
            ?.name.toLowerCase()
            .includes(search.toLowerCase())
        ) {
          searchedAppointments.push(appointment);
        }
      }
    } else {
      searchedAppointments = filteredAppointments;
    }
    return searchedAppointments;
  }
}
