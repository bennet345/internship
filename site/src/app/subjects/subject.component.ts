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
                <img
                    class='teacher' 
                    [routerLink]='"/instructors/" + teacher.id' 
                    (mouseenter)="hovering = [teacher.id, $event.x, $event.y]"
                    (mouseleave)='hovering = null'
                    [src]='teacher.image'
                    style='border-radius: 50%; height: 30px; width: 30px;'
                    [style]='colorStyle(teacher.color)'
                />
            }
            @if (teachers().length < instructorService.instructors.length) {
                <button (click)='handleClick($event)'>
                    @if (this.add === null) {
                        add 
                    } @else {
                        close
                    }
                </button>
            }
        } @else {
            <div>No one teaches this subject yet..</div>
        }

        @if (hovering !== null) {
            <div [style]='hoverPositionStyle(this.hovering[1] - 120, this.hovering[2] + hoverOffset(this.hovering[1], this.hovering[2]))' style='z-index: 10;'>
                <app-instructor-small [instructor]='instructorService.getById(hovering[0])!' />
            </div>
        }
        @if (add !== null) {
            <div 
                [style]='hoverPositionStyle(this.add[1] + addOffset(this.add[1]), this.add[2])' 
                style='background-color: white; width: 500px; padding: 10px; border-radius: 10px;'
            >
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
        return `background-color: ${color}; padding: 3px;`;
    }

    hoverPositionStyle(x: number, y: number) {
        return `position: absolute; left: ${x}px; top: ${y}px;` 
    }

    hoverOffset(x: number, y: number): number {
        if (y > 400) return -300; 
        return 50;
    }

    addOffset(x: number): number {
        if (x > 1000) return -700;
        return 50;
    }

    handleClick(event: MouseEvent) {
        if (this.add === null) {
            this.add = [this.id, event.x, event.y]; 
            return;
        }
        this.add = null;
    }
}
