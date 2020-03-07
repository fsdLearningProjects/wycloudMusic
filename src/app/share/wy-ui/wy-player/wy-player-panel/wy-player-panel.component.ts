import { Component, OnInit, OnChanges, Input, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { Song } from 'src/app/services/data-types/common.types';

@Component({
  selector: 'app-wy-player-panel',
  templateUrl: './wy-player-panel.component.html',
  styleUrls: ['./wy-player-panel.component.less']
})
export class WyPlayerPanelComponent implements OnInit, OnChanges {

  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['songList']) {

    }
  }

}
