import { Component, inject, Input } from '@angular/core';
import { SubjectService } from '../services/subject.service';
import { RouterModule } from '@angular/router';
import { Instructor, InstructorService } from '../services/instructor.service';
import { InstructorSmallComponent } from '../instructors/instructor-small.component';

@Component({
  selector: 'subject',
  imports: [RouterModule, InstructorSmallComponent],
  template: `
    <div class='subject'>
        <h2 [routerLink]="[this.link()]">{{ subjectService.getById(id)!.name }}</h2>
        @if (isTaught()) {
            <span class='teacher'>Instructors: </span>
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
            @if (teachers().length < instructorService.instructors.length) {
                <button (click)='add = [id, $event.x, $event.y]'>add</button>
            }
        } @else {
            <div>No one teaches this subject yet..</div>
        }

        @if (hovering !== null) {
            <div [style]='hoverPositionStyle(this.hovering[1] - 120, this.hovering[2] + 50)' style='z-index: 10;'>
                <app-instructor-small [instructor]='instructorService.getById(hovering[0])!' />
            </div>
        }
        @if (add !== null) {
            <div [style]='hoverPositionStyle(this.add[1], this.add[2])' style='background-color: white; width: 500px;'>
                <button (click)='add = null'>X</button>
                @for (instructor of instructorService.instructors; track $index) {
                    @if (! instructor.subjects.includes(id)) {
                        <img 
                            style='margin-left: 5px; border-radius: 50%; height: 30px; width: 30px;'
                            (click)='this.instructorService.giveInstructorSubject(instructor.id, id)'
                            [src]='instructor.image'
                            (mouseenter)="hovering = [instructor.id, $event.x, $event.y]"
                            (mouseleave)='hovering = null'
                        >
                    }
                }
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
    add: Array<number> | null = null;

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

    hoverPositionStyle(x: number, y: number) {
        return `position: absolute; left: ${x}px; top: ${y}px;` 
    }
}
