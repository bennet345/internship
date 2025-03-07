import { Component, inject, Input } from '@angular/core';
import { InstructorService } from '../services/instructor.service';
import {
  FilterSelectorComponent,
  Option,
} from '../filter-selector/filter-selector.component';
import { SubjectService } from '../services/subject.service';
import { ServerService } from '../services/server.service';
import { InstructorSmallComponent } from './instructor-small.component';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EventPopupComponent } from './instructor-popup.component';

@Component({
  selector: 'instructors',
  imports: [
    FilterSelectorComponent,
    InstructorSmallComponent,
    RouterModule,
    EventPopupComponent,
  ],
  templateUrl: './instructors.component.html',
  styleUrl: './instructors.component.scss',
})
export class InstructorsComponent {
  socket: WebSocket = new WebSocket('http://localhost:8080/');
  serverService: ServerService = inject(ServerService);
  instructorService: InstructorService = inject(InstructorService);
  subjectService: SubjectService = inject(SubjectService);
  input: string = '';
  options: Array<Option> = [];
  showPopup: boolean = false;
  search: string = '';
  @Input() id: number | null = null;

  constructor(private readonly route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') == null) return;
      this.id = Number(params.get('id'));
    });
    this.subjectService.whenReady(() => (this.options = this.subjectOptions()));
  }

  formatId(id: string): number {
    return Number(id);
  }
  subjectOptions(): Array<Option> {
    let output = [];
    for (let subject of this.subjectService.subjects) {
      output.push({
        name: subject.name,
        active: false,
      });
    }
    return output;
  }
  updateSearch(event: Event) {
    this.search = (event.target as HTMLInputElement).value;
  }
}
