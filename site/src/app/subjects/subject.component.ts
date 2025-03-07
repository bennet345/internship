import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { RouterModule } from '@angular/router';
import { InstructorService } from '../services/instructor.service';

@Component({
  selector: 'subject',
  imports: [RouterModule],
  template: `
    <div [routerLink]="[this.link()]" class='subject'>
        <h2>{{ subjectService.getById(id)!.name }}</h2>
        <div><b>Teachers:</b> {{ teachers() }}</div>
    </div>
  `,
  styles: `
    .subject {
        background-color: blue;
        padding: 10px;
        width: 400px;
        margin-bottom: 10px;
    }
  `,
})
export class SubjectComponent {
    @Input() id: number = 0;
    subjectService: SubjectService = inject(SubjectService);
    instructorService: InstructorService = inject(InstructorService);

    link() {
        return `/subjects/${this.id}`;
    }

    teachers(): string {
        let output = '';
        for (let instructor of this.instructorService.instructors) {
            if (instructor.subjects.includes(this.id)) {
                if (output === '') {
                    output = instructor.name;
                    continue;
                }
                output = `${output}, ${instructor.name}`;
            }
        }
        return output;
    }
}
