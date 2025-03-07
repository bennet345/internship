import { inject, Injectable } from '@angular/core';
import { ServerService } from './server.service';
import { Option } from '../filter-selector/filter-selector.component';

export interface Instructor {
  name: string;
  id: number;
  subjects: Array<number>;
  image: string;
  color: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstructorService {
  serverService: ServerService = inject(ServerService);
  instructors: Array<Instructor> = [];

  constructor() {
    this.serverService.socket.addEventListener('open', (event) => {
      this.serverService.getResponse<null, Array<Instructor>>(
        'get_instructors',
        null,
        (data) => {
          this.instructors = data;
        }
      );
    });
    this.serverService.permanentListener<Instructor>(
      'created_instructor',
      (data) => {
        this.instructors.push(data);
      }
    );
    this.serverService.permanentListener<{id: number, subject: number}>(
      'gave_instructor_subject',
      data => {
        let index = this.instructors.findIndex(element => element.id === data.id);
        if (index === -1) return;
        this.instructors[index].subjects.push(data.subject);
      }
    );
  }

  createInstructor(instructor: Instructor) {
    this.serverService.sendMessage('create_instructor', instructor);
  }

  giveInstructorSubject(instructor: number, subject: number) {
    this.serverService.sendMessage('give_instructor_subject', {
      id: instructor,
      subject: subject,
    });
  }

  getById(id: number): Instructor | null {
    for (let instructor of this.instructors) {
      if (instructor.id == id) {
        return instructor;
      }
    }
    return null;
  }

  filter(subjectFilter: Array<Option>, search: string): Array<Instructor> {
    let filteredInstructors: Array<Instructor> = [];
    if (subjectFilter.filter((element) => element.active).length === 0) {
      filteredInstructors = this.instructors;
    } else {
      for (let instructor of this.instructors) {
        for (let subject of instructor.subjects) {
          if (subjectFilter[subject].active) {
            filteredInstructors.push(instructor);
            break;
          }
        }
      }
    }

    let searchedInstructors: Array<Instructor> = [];
    if (search !== '') {
      for (let instructor of filteredInstructors) {
        if (instructor.name.toLowerCase().includes(search.toLowerCase()))
          searchedInstructors.push(instructor);
      }
    } else {
      searchedInstructors = filteredInstructors;
    }
    return searchedInstructors;
  }
}
