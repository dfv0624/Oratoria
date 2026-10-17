import { Routes } from '@angular/router';
import { PassageListComponent } from './components/passage-list/passage-list.component';
import { PracticeViewComponent } from './components/practice-view/practice-view.component';

export const routes: Routes = [
  { path: '', component: PassageListComponent, title: 'Pasajes - Concurso de Oratoria' },
  { path: 'practice/:id', component: PracticeViewComponent, title: 'Práctica - Concurso de Oratoria' },
  { path: '**', redirectTo: '' }
];
