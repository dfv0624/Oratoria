import { Injectable } from '@angular/core';
import { PASSAGES } from '../data/passages.data';
import { Passage } from '../models/passage.model';

@Injectable({
  providedIn: 'root'
})
export class PassageService {
  private readonly passages: Passage[] = PASSAGES;

  getPassages(): Passage[] {
    return this.passages;
  }

  getPassageById(id: number): Passage | undefined {
    return this.passages.find(p => p.id === id);
  }
}
