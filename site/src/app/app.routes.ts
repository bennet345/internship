import { Routes } from '@angular/router';
import { InstructorsComponent } from './instructors/instructors.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { CalendarComponent } from './calendar/calendar.component';

export const routes: Routes = [
  {
    path: 'instructors',
    component: InstructorsComponent,
    title: 'Instructors',
  },
  {
    path: 'instructors/:id',
    component: InstructorsComponent,
    title: 'Instructors',
  },
  {
    path: 'subjects',
    component: SubjectsComponent,
    title: 'Subjects',
  },
  {
    path: 'subjects/:id',
    component: SubjectsComponent,
    title: 'Subjects',
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    title: 'Calendar',
  },
];
