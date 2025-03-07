import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { RouterModule } from '@angular/router';
import { Instructor, InstructorService } from '../services/instructor.service';
import { InstructorSmallComponent } from '../instructors/instructor-small.component';

@Component({
  selector: 'subject',
  imports: [RouterModule, InstructorSmallComponent],
  template: `
    <div [routerLink]="[this.link()]" class='subject'>
        <h2>{{ subjectService.getById(id)!.name }}</h2>
        @if (isTaught()) {
            <span class='teacher'>Teachers: </span>
            @for (teacher of teachers(); track $index) {
                <span 
                    class='teacher' 
                    [routerLink]='"/instructors/" + teacher.id' 
                    (mouseenter)="hovering = [teacher.id, $event.x, $event.y]"
                    (mouseleave)='hovering = null'
                    [style]='colorStyle(teacher.color)'
                >
                    {{ teacher.name }}
                </span>
            }
        } @else {
            <div>No one teaches this subject yet..</div>
        }

        @if (hovering !== null) {
            <div [style]='dynamicStyle()'>
                <app-instructor-small [instructor]='instructorService.getById(hovering[0])!' />
            </div>
        }
    </div>
  `,
  styles: `
    .subject {
        background-color: rgb(224, 224, 255);
        padding: 15px 20px 25px 30px;
        margin: 0px 10px 10px 0px;
        border-radius: 20px;
    }

    .teacher {
        margin-right: 15px;
    }
  `,
})
export class SubjectComponent {
    @Input() id: number = 0;
    subjectService: SubjectService = inject(SubjectService);
    instructorService: InstructorService = inject(InstructorService);
    hovering: Array<number> | null = null;

    link() {
        return `/subjects/${this.id}`;
    }

    teachers(): Array<Instructor> {
        let output = [];
        for (let instructor of this.instructorService.instructors) {
            if (instructor.subjects.includes(this.id)) {
                output.push(instructor);
            }
        }
        return output;
    }

    isTaught(): boolean {
        for (let instructor of this.instructorService.instructors) {
            if (instructor.subjects.includes(this.id)) return true;
        }
        return false;
    }

    colorStyle(color: string): string {
        return `color: ${color}`;
    }

    dynamicStyle() {
        return `position: absolute; left: ${this.hovering![1] - 120}px; top: ${this.hovering![2] + 50}px;` 
    }
}
