import { Component } from '@angular/core';
import { Board } from './component/board';

@Component({
  selector: 'od-home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  imports: [Board],
})
export class Home {}
