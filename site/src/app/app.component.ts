import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { InstructorService } from './services/instructor.service';
import { SubjectService } from './services/subject.service';
import { AppointmentService } from './services/appointment.service';
import { ServerService } from './services/server.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'minty-mint';
  instructorService: InstructorService = inject(InstructorService);
  subjectService: SubjectService = inject(SubjectService);
  appointmentService: AppointmentService = inject(AppointmentService);
  serverService: ServerService = inject(ServerService);

  constructor() {
    this.subjectService.whenReady(() => {});
  }
}
