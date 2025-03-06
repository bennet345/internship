import { Component, inject, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Instructor, InstructorService } from '../services/instructor.service';
import { SubjectService } from '../services/subject.service';

@Component({
  selector: 'app-instructor-small',
  imports: [RouterModule],
  template: `
    <div
      class="main"
      [routerLink]="['/instructors/' + instructor.id]"
      [style]="dynamicColor()"
    >
      <img
        alt="{{ instructor.name }}"
        [src]="instructorService.getById(instructor.id)?.image"
        class="image"
      />
      <div class="name">{{ instructor.name }}</div>
      <div>{{ subjects(instructor.id) }}</div>
      <div class="fields">
        <div class="field">{{ fields[0] }}</div>
        <div class="field">{{ fields[1] }}</div>
        <div class="field">{{ fields[2] }}</div>
      </div>
    </div>
  `,
  styles: `
        .main {
            padding: 10px;
            width: max-content;
            border-radius: 15px;
            text-align: center;
        }

        .fields {
            display: flex;
            margin: 20px 0px 20px 0px;
        }

        .field {
            flex: 1 auto;
            background-color: RGB(255, 255, 255);
            margin: 5px;
            border-radius: 5px;
            padding: 1px;
        }

        .image {
            width: 75px;
            height: 75px;
            border-radius: 50%;
            padding: 25px;
        }

        .name {
            font-size: 20px;
            font-weight: bold;
        }
    `,
})
export class InstructorSmallComponent {
  subjectService: SubjectService = inject(SubjectService);
  instructorService: InstructorService = inject(InstructorService);
  @Input() instructor!: Instructor;
  fields: Array<string> = ['50 years xp', 'Political', 'Story teller'];

  constructor() {
    this.subjectService.whenReady(() => {});
  }

  dynamicColor(): string {
    return `background-color: ${this.instructor.color};`;
  }

  subjects(instructor: number): string {
    let output = '';
    let subjects = this.instructorService.getById(instructor)!.subjects;
    for (let i = 0; i < subjects.length; i++) {
      if (i === 0) {
        output = this.subjectService.getById(subjects[0])!.name;
      } else {
        output = `${output}, ${this.subjectService.getById(subjects[i])?.name}`;
      }
    }
    return output;
  }
}
