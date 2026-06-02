import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { SpaceService } from '../../services/space.service';

@Component({
  selector: 'app-space-canvas',
  standalone: true,
  template: `<canvas #spaceCanvas id="space-canvas"></canvas>`,
})
export class SpaceCanvasComponent implements AfterViewInit, OnDestroy {

  @ViewChild('spaceCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private resizeObserver!: ResizeObserver;

  constructor(private spaceService: SpaceService) {}

  ngAfterViewInit(): void {
    this.spaceService.attachCanvas(this.canvasRef.nativeElement);
    this.resizeObserver = new ResizeObserver(() => this.spaceService.onResize());
    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.spaceService.detachCanvas();
  }
}
