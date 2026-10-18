import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PassageService } from '../../services/passage.service';
import { Passage } from '../../models/passage.model';

@Component({
  selector: 'app-passage-list',
  imports: [RouterLink],
  templateUrl: './passage-list.component.html',
  styleUrl: './passage-list.component.css'
})
export class PassageListComponent {
  private readonly passageService = inject(PassageService);
  readonly passages: Passage[] = this.passageService.getPassages();


  formatId(id: number): string {
    return id.toString().padStart(2, '0');
  }
}
