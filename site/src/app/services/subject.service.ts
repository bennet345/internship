import { inject, Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { Option } from '../filter-selector/filter-selector.component';

interface Subject {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  serverService: ServerService = inject(ServerService);
  subjects: Array<Subject> = [];
  ready: boolean = false;

  constructor() {
    this.serverService.permanentListener<Subject>('created_subject', (data) => {
      this.subjects.push(data);
    });
  }

  whenReady(callback: () => void) {
    if (this.ready) {
      callback();
      return;
    }
    this.serverService.socket.addEventListener('open', (event) => {
      this.serverService.getResponse<null, Array<Subject>>(
        'get_subjects',
        null,
        (data) => {
          this.subjects = data;
          this.ready = true;
          callback();
        }
      );
    });
  }

  createSubject(subject: Subject) {
    this.serverService.sendMessage('create_subject', subject);
  }

  getById(id: number): Subject | null {
    for (let subject of this.subjects) {
      if (subject.id == id) {
        return subject;
      }
    }
    return null;
  }

  subjectOptions(): Array<Option> {
    let options: Array<Option> = [];
    for (let subject of this.subjects) {
      options.push({
        name: subject.name,
        active: false,
      });
    }
    return options;
  }
}
