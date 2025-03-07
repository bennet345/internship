import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SubjectService } from '../services/subject.service';
import { SubjectComponent } from "./subject.component";
import { InstructorSmallComponent } from '../instructors/instructor-small.component';

@Component({
  selector: 'app-subjects',
  imports: [RouterModule, SubjectComponent],
  templateUrl: './subjects.component.html',
  styleUrl: './subjects.component.scss',
})
export class SubjectsComponent {
  @Input() id: number | null = null;
  subjectService: SubjectService = inject(SubjectService);

  constructor(private readonly route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id') == null) return;
      this.id = Number(params.get('id'));
    });
  }

  createSubject(name: string) {
    if (name === '') return;
    this.subjectService.createSubject({ name, id: 0 });
  }
}
